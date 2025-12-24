'use client'

import React, { useState } from 'react';
import { useOfferStore } from '@/store/useOfferStore';
import ReactMarkdown from 'react-markdown'; // 确保已安装
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';

export default function AIAdvice() {
  const { offers, advice, setAdvice } = useOfferStore();
  const [isLoading, setIsLoading] = useState(false);

  const generateAdvice = async () => {
    if (offers.length < 2) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comparisonData: offers }),
      });
      const data = await res.json();
      setAdvice(data.advice); // 更新到全局 Store
    } catch (err) {
      alert("AI 诊断失败");
    } finally {
      setIsLoading(false);
    }
  };

  if (offers.length < 2) return null;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-indigo-600" /> AI 专家深度对比建议
        </h3>
        {!advice && (
          <button 
            onClick={generateAdvice} 
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 disabled:bg-slate-300 transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            开始深度诊断
          </button>
        )}
      </div>

      {advice && (
        <div className="prose prose-slate max-w-none bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
          <ReactMarkdown>{advice}</ReactMarkdown>
          <button onClick={() => setAdvice(null)} className="mt-4 text-xs text-slate-400 hover:text-indigo-600">
            重新生成建议
          </button>
        </div>
      )}
    </div>
  );
}