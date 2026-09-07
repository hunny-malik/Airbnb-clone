'use client';

import React from 'react';
import { ShieldCheck, Award, MessageCircle } from 'lucide-react';
import { User } from '@/types';
import { useToast } from '@/context/ToastContext';

interface HostCardProps {
  host: User;
}

export default function HostCard({ host }: HostCardProps) {
  const { showToast } = useToast();

  const handleContactHost = () => {
    showToast(`Messaging with Host ${host.name} (Coming Soon placeholder)`, 'info');
  };

  return (
    <div className="py-8 border-t border-neutral-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
        
        {/* Host Avatar & Details */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={host.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'}
              alt={host.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            {host.is_superhost && (
              <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white p-1 rounded-full shadow-md">
                <Award className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-neutral-900">Hosted by {host.name}</h3>
              {host.is_superhost && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  <Award className="w-3 h-3" />
                  Superhost
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500">Joined in {host.joined_date || '2019'} • Hospitality Leader</p>
          </div>
        </div>

        {/* Contact Button */}
        <button
          onClick={handleContactHost}
          className="border border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors px-5 py-2.5 rounded-2xl text-xs font-bold text-neutral-900 flex items-center gap-2 shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Contact Host</span>
        </button>

      </div>

      {host.bio && (
        <p className="mt-4 text-sm text-neutral-700 leading-relaxed italic px-2">
          "{host.bio}"
        </p>
      )}
    </div>
  );
}
