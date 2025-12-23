'use client'

import React from 'react';
import { useOfferStore } from '@/store/useOfferStore';
import { Trash2, Briefcase } from 'lucide-react';

export default function OfferList() {
  const { offers, removeOffer } = useOfferStore();

  if (offers.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-indigo-500" /> 已加入对比的 Offer ({offers.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center group hover:border-indigo-300 transition-colors shadow-sm">
            <div>
              <h4 className="font-bold text-slate-900">{offer.companyName}</h4>
              <p className="text-sm text-slate-500">{offer.jobTitle || '职位未填写'}</p>
              <div className="mt-2 flex gap-3 text-xs">
                <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">月薪: ¥{(offer.baseSalary.monthly/1000).toFixed(1)}k</span>
                <span className="bg-indigo-50 px-2 py-1 rounded text-indigo-600">股票: ¥{(offer.equity.totalValue/10000).toFixed(0)}万</span>
              </div>
            </div>
            <button 
              onClick={() => removeOffer(offer.id)}
              className="text-slate-300 hover:text-red-500 p-2 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}