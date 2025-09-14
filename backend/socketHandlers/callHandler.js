const mysql = require('mysql2');

const connectedUsers = new Map();
const activeCalls = new Map();

function setupCallHandlers(io) {
  console.log('🎯 Configuration des gestionnaires d\'appels Socket.IO');

  io.on('connection', (socket) => {
    console.log(`📞 Nouvelle connexion Socket.IO: ${socket.id}`);

    // Enregistrement d'un utilisateur
    socket.on('register-user', (userData) => {
      try {
        const { userId, username, email } = userData;
        
        connectedUsers.set(socket.id, {
          socketId: socket.id,
          userId: userId,
          username: username || `User${userId}`,
          email: email,
          status: 'online',
          joinedAt: new Date()
        });

        socket.join(`user-${userId}`);
        
        console.log(`✅ Utilisateur enregistré: ${username} (ID: ${userId})`);
        
        // Notifier les autres utilisateurs
        socket.broadcast.emit('user-online', {
          userId: userId,
          username: username,
          status: 'online'
        });

        // Envoyer la liste des utilisateurs connectés
        const onlineUsers = Array.from(connectedUsers.values())
          .filter(user => user.userId !== userId)
          .map(user => ({
            userId: user.userId,
            username: user.username,
            status: user.status
          }));

        socket.emit('online-users', onlineUsers);
        
      } catch (error) {
        console.error('❌ Erreur lors de l\'enregistrement:', error);
        socket.emit('error', { message: 'Erreur d\'enregistrement' });
      }
    });

    // Initier un appel
    socket.on('initiate-call', async (data) => {
      try {
        const { callerId, calleeId, callerName, callType = 'audio' } = data;
        
        console.log(`📞 Appel initié: ${callerName} → User${calleeId}`);

        const callId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        activeCalls.set(callId, {
          callId: callId,
          callerId: callerId,
          calleeId: calleeId,
          callerName: callerName,
          callType: callType,
          status: 'ringing',
          startTime: new Date(),
          callerSocketId: socket.id
        });

        // Trouver le socket du destinataire
        const calleeSocketId = findUserSocketId(calleeId);
        
        if (calleeSocketId) {
          io.to(calleeSocketId).emit('incoming-call', {
            callId: callId,
            callerId: callerId,
            callerName: callerName,
            callType: callType
          });

          socket.emit('call-ringing', { callId: callId });
          
        } else {
          socket.emit('call-failed', { 
            reason: 'Utilisateur non connecté',
            callId: callId
          });
          activeCalls.delete(callId);
        }

      } catch (error) {
        console.error('❌ Erreur lors de l\'initiation de l\'appel:', error);
        socket.emit('call-failed', { reason: 'Erreur serveur' });
      }
    });

    // Accepter un appel
    socket.on('accept-call', async (data) => {
      try {
        const { callId } = data;
        const call = activeCalls.get(callId);
        
        if (call) {
          call.status = 'accepted';
          call.acceptTime = new Date();
          
          console.log(`✅ Appel accepté: ${call.callerName} ↔ User${call.calleeId}`);

          io.to(call.callerSocketId).emit('call-accepted', {
            callId: callId,
            calleeId: call.calleeId
          });

          socket.emit('call-started', { callId: callId });
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'acceptation:', error);
      }
    });

    // Rejeter un appel
    socket.on('reject-call', async (data) => {
      try {
        const { callId } = data;
        const call = activeCalls.get(callId);
        
        if (call) {
          console.log(`❌ Appel rejeté: ${call.callerName} → User${call.calleeId}`);

          io.to(call.callerSocketId).emit('call-rejected', {
            callId: callId,
            reason: 'Appel rejeté'
          });

          activeCalls.delete(callId);
        }
      } catch (error) {
        console.error('❌ Erreur lors du rejet:', error);
      }
    });

    // Terminer un appel
    socket.on('end-call', async (data) => {
      try {
        const { callId } = data;
        const call = activeCalls.get(callId);
        
        if (call) {
          call.endTime = new Date();
          call.duration = Math.floor((call.endTime - (call.acceptTime || call.startTime)) / 1000);
          
          console.log(`📴 Appel terminé: ${call.callerName} (durée: ${call.duration}s)`);

          io.to(call.callerSocketId).emit('call-ended', { callId: callId });
          
          const calleeSocketId = findUserSocketId(call.calleeId);
          if (calleeSocketId) {
            io.to(calleeSocketId).emit('call-ended', { callId: callId });
          }

          activeCalls.delete(callId);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la fin d\'appel:', error);
      }
    });

    // Gestion des signaux WebRTC
    socket.on('webrtc-offer', (data) => {
      const { callId, offer } = data;
      const call = activeCalls.get(callId);
      
      if (call) {
        const targetSocketId = socket.id === call.callerSocketId 
          ? findUserSocketId(call.calleeId)
          : call.callerSocketId;
          
        if (targetSocketId) {
          io.to(targetSocketId).emit('webrtc-offer', { callId, offer });
        }
      }
    });

    socket.on('webrtc-answer', (data) => {
      const { callId, answer } = data;
      const call = activeCalls.get(callId);
      
      if (call) {
        const targetSocketId = socket.id === call.callerSocketId 
          ? findUserSocketId(call.calleeId)
          : call.callerSocketId;
          
        if (targetSocketId) {
          io.to(targetSocketId).emit('webrtc-answer', { callId, answer });
        }
      }
    });

    socket.on('webrtc-ice-candidate', (data) => {
      const { callId, candidate } = data;
      const call = activeCalls.get(callId);
      
      if (call) {
        const targetSocketId = socket.id === call.callerSocketId 
          ? findUserSocketId(call.calleeId)
          : call.callerSocketId;
          
        if (targetSocketId) {
          io.to(targetSocketId).emit('webrtc-ice-candidate', { callId, candidate });
        }
      }
    });

    // Gestion de la déconnexion
    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);
      
      if (user) {
        console.log(`🔌 Déconnexion: ${user.username}`);
        
        // Terminer les appels actifs
        for (const [callId, call] of activeCalls.entries()) {
          if (call.callerSocketId === socket.id) {
            const calleeSocketId = findUserSocketId(call.calleeId);
            if (calleeSocketId) {
              io.to(calleeSocketId).emit('call-ended', { 
                callId: callId, 
                reason: 'L\'appelant s\'est déconnecté' 
              });
            }
            activeCalls.delete(callId);
          }
        }

        // Notifier les autres utilisateurs
        socket.broadcast.emit('user-offline', {
          userId: user.userId,
          username: user.username,
          status: 'offline'
        });

        connectedUsers.delete(socket.id);
      }
    });
  });

  function findUserSocketId(userId) {
    for (const [socketId, userData] of connectedUsers.entries()) {
      if (userData.userId === userId) {
        return socketId;
      }
    }
    return null;
  }

  console.log('✅ Gestionnaire d\'appels configuré avec succès');
}

module.exports = setupCallHandlers;