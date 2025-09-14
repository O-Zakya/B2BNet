'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCallPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [enableTranslation, setEnableTranslation] = useState(false);

  const goToActive = () => {
    if (!phone && !email) {
      alert('Veuillez saisir un numéro de téléphone ou une adresse email.');
      return;
    }
    const params = new URLSearchParams();
    if (phone) params.set('phone', phone.trim());
    if (email) params.set('email', email.trim());
    if (enableTranslation) params.set('tr', '1');
    router.push(`/calls/active?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Start New Call</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+212 661-234-567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="translation"
              checked={enableTranslation}
              onChange={(e) => setEnableTranslation(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="translation" className="text-sm text-gray-700">
              Enable AI Translation
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={goToActive}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all cursor-pointer whitespace-nowrap"
            >
              Start Voice Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
