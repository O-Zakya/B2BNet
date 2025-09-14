'use client';
import { useEffect, useRef, useState } from 'react';
import { SimpleUser, SimpleUserOptions } from 'sip.js/lib/platform/web';

export default function SipTest() {
  const [status, setStatus] = useState('idle');
  const [su, setSu] = useState<SimpleUser | null>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  // Configurables depuis l'UI
  const [wsServer, setWsServer] = useState('ws://203.161.56.127:5066');
  const [domain, setDomain] = useState('203.161.56.127');
  const [username, setUsername] = useState('zakya');
  const [password, setPassword] = useState('password1');
  const [target, setTarget] = useState('hanane');

  // Cleanup à la fermeture de la page
  useEffect(() => {
    return () => {
      if (su) {
        su.unregister().catch(() => {});
        su.disconnect().catch(() => {});
      }
    };
  }, [su]);

  const connectAndRegister = async () => {
    try {
  setStatus('connecting'); // attente de onServerConnect
      // Nettoyer une instance existante
      if (su) {
        await su.unregister().catch(() => {});
        await su.disconnect().catch(() => {});
      }

      const aor = `sip:${username}@${domain}`;
      const opts: SimpleUserOptions = {
        aor,
        media: {
          constraints: { audio: true, video: false },
          remote: {
            audio: remoteAudioRef.current || undefined,
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
          authorizationUsername: username,
          authorizationPassword: password,
          transportOptions: { 
            server: wsServer,
            // Ajouter l'en-tête Sec-WebSocket-Protocol: sip pour Kamailio
            connectionOptions: {
              protocols: ['sip']
            }
          },
        },
      };

      const simpleUser = new SimpleUser(wsServer, opts);
      setSu(simpleUser);

      await simpleUser.connect();
      await simpleUser.register();
  setStatus('registering'); // passera à "registered" seulement si onRegistered est déclenché
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const call = async () => {
    if (!su) return;
    try {
      await su.call(`sip:${target}@${domain}`); // destinataire
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

  return (
    <div style={{ padding: 16 }}>
      <h3>SIP Test (WS 5066)</h3>
      <div>Status: {status}</div>
      <div style={{ display: 'grid', gap: 8, maxWidth: 520, margin: '12px 0' }}>
        <label>
          WS Server
          <input style={{ width: '100%' }} value={wsServer} onChange={(e) => setWsServer(e.target.value)} />
        </label>
        <label>
          Domain
          <input style={{ width: '100%' }} value={domain} onChange={(e) => setDomain(e.target.value)} />
        </label>
        <label>
          Username (AoR user)
          <input style={{ width: '100%' }} value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" style={{ width: '100%' }} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Target user
          <input style={{ width: '100%' }} value={target} onChange={(e) => setTarget(e.target.value)} />
        </label>
      </div>
      <button onClick={connectAndRegister}>Connect & Register</button>
      <button onClick={call}>Call target</button>
      <button onClick={answer}>Answer</button>
      <button onClick={hangup}>Hangup</button>

      <audio ref={localAudioRef} muted autoPlay />
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
}