'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useRef } from 'react';

export default function CallActivePage() {
  const router = useRouter();
  const search = useSearchParams();

  const data = useMemo(
    () => ({
      phone: search.get('phone') || '',
      email: search.get('email') || '',
      tr: search.get('tr') === '1',
    }),
    [search]
  );

  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Call Active
          </h2>
          <button
            onClick={() => router.push('/calls/new')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Change destination
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Destination</p>
          <p className="text-lg font-semibold text-gray-900">
            {data.phone || data.email}
          </p>
          <p className="text-sm text-gray-500">
            Translation: {data.tr ? 'Enabled' : 'Disabled'}
          </p>
        </div>

        {/* Audio placeholders */}
        <div className="space-y-2">
          <audio ref={localAudioRef} autoPlay muted className="w-full" />
          <audio ref={remoteAudioRef} autoPlay className="w-full" />
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all cursor-pointer"
            onClick={() => router.push('/dashboard')}
          >
            Hang up
          </button>
          <button
            className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Prochaine étape : connexion SIP/WebSocket et démarrage automatique de l’appel.
        </p>
      </div>
    </div>
  );
}
