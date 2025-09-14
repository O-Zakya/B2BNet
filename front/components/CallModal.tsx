'use client';
import { useEffect, useRef, useState } from 'react';
import { SimpleUser, SimpleUserOptions } from 'sip.js/lib/platform/web';
import { useAuth } from '@/context/AuthContext';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallModal({ isOpen, onClose }: CallModalProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<string>('idle');
  const [su, setSu] = useState<SimpleUser | null>(null);
  const [sipCredentials, setSipCredentials] = useState<any>(null);
  const [targetEmail, setTargetEmail] = useState('');
  const [targetUser, setTargetUser] = useState<any>(null);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Récupérer les credentials SIP au chargement
  useEffect(() => {
    if (isOpen && user && !sipCredentials) {
      fetchSipCredentials();
    }
  }, [isOpen, user]);

  const fetchSipCredentials = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/user/sip-credentials', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSipCredentials(data.sipCredentials);
      }
    } catch (error) {
      console.error('Erreur récupération credentials SIP:', error);
    }
  };

  const searchUser = async () => {
    if (!targetEmail.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/user/search/${encodeURIComponent(targetEmail)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTargetUser(data.user);
      } else {
        alert('Utilisateur non trouvé');
        setTargetUser(null);
      }
    } catch (error) {
      console.error('Erreur recherche utilisateur:', error);
      alert('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const connectAndRegister = async () => {
    if (!sipCredentials) return;
    
    try {
      setStatus('connecting');
      
      // Nettoyer une instance existante
      if (su) {
        await su.unregister().catch(() => {});
        await su.disconnect().catch(() => {});
      }

      const aor = `sip:${sipCredentials.sipUsername}@${sipCredentials.domain}`;
      const opts: SimpleUserOptions = {
        aor,
        media: {
          constraints: { 
            audio: true, 
            video: isVideoCall 
          },
          remote: {
            audio: remoteAudioRef.current || undefined,
            video: isVideoCall ? remoteVideoRef.current || undefined : undefined,
          },
        },
        delegate: {
          onServerConnect: () => setStatus('connected'),
          onServerDisconnect: () => setStatus('disconnected'),
          onRegistered: () => setStatus('registered'),
          onUnregistered: () => setStatus('connected'),
          onCallReceived: () => setStatus('incoming'),
          onCallAnswered: () => setStatus('in-call'),
          onCallHangup: () => setStatus('registered'),
        },
        userAgentOptions: {
          authorizationUsername: sipCredentials.sipUsername,
          authorizationPassword: sipCredentials.sipPassword,
          transportOptions: { 
            server: sipCredentials.wsServer,
            connectionOptions: {
              protocols: ['sip']
            }
          },
        },
      };

      const simpleUser = new SimpleUser(sipCredentials.wsServer, opts);
      setSu(simpleUser);

      await simpleUser.connect();
      await simpleUser.register();
      setStatus('registering');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const call = async () => {
    if (!su || !targetUser) return;
    
    try {
      await su.call(`sip:${targetUser.sipUsername}@${sipCredentials.domain}`);
      setStatus('calling');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const answer = async () => {
    if (!su) return;
    try {
      await su.answer();
      setStatus('in-call');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const hangup = async () => {
    if (!su) return;
    try {
      await su.hangup();
      setStatus('registered');
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = () => {
    if (su) {
      su.unregister().catch(() => {});
      su.disconnect().catch(() => {});
      setSu(null);
    }
    setStatus('idle');
    setTargetEmail('');
    setTargetUser(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isVideoCall ? 'Appel Vidéo' : 'Appel Audio'}
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Status */}
          <div className="text-center">
            <span className={`px-3 py-1 rounded-full text-sm ${
              status === 'registered' ? 'bg-green-100 text-green-800' :
              status === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {status === 'idle' ? 'Non connecté' :
               status === 'connecting' ? 'Connexion...' :
               status === 'connected' ? 'Connecté' :
               status === 'registering' ? 'Enregistrement...' :
               status === 'registered' ? 'Prêt' :
               status === 'calling' ? 'Appel en cours...' :
               status === 'incoming' ? 'Appel entrant' :
               status === 'in-call' ? 'En communication' :
               status === 'error' ? 'Erreur' : status}
            </span>
          </div>

          {/* Type d'appel */}
          <div className="flex justify-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={!isVideoCall}
                onChange={() => setIsVideoCall(false)}
                className="mr-2"
              />
              Audio
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={isVideoCall}
                onChange={() => setIsVideoCall(true)}
                className="mr-2"
              />
              Vidéo
            </label>
          </div>

          {/* Recherche utilisateur */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email de la personne à appeler
            </label>
            <div className="flex space-x-2">
              <input
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="email@exemple.com"
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={searchUser}
                disabled={loading || !targetEmail.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? '...' : 'Chercher'}
              </button>
            </div>
          </div>

          {/* Utilisateur trouvé */}
          {targetUser && (
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-sm">
                <strong>{targetUser.firstName} {targetUser.lastName}</strong>
                <br />
                {targetUser.email}
              </p>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex space-x-2">
            {status === 'idle' && (
              <button
                onClick={connectAndRegister}
                disabled={!sipCredentials}
                className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                Se connecter
              </button>
            )}
            
            {status === 'registered' && (
              <button
                onClick={call}
                disabled={!targetUser}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Appeler
              </button>
            )}
            
            {status === 'incoming' && (
              <button
                onClick={answer}
                className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Répondre
              </button>
            )}
            
            {(status === 'calling' || status === 'in-call') && (
              <button
                onClick={hangup}
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Raccrocher
              </button>
            )}
          </div>
        </div>

        {/* Éléments audio/video cachés */}
        <audio ref={localAudioRef} muted autoPlay style={{ display: 'none' }} />
        <audio ref={remoteAudioRef} autoPlay style={{ display: 'none' }} />
        {isVideoCall && (
          <>
            <video ref={localVideoRef} muted autoPlay style={{ display: 'none' }} />
            <video ref={remoteVideoRef} autoPlay style={{ display: 'none' }} />
          </>
        )}
      </div>
    </div>
  );
}
