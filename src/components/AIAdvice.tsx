'use client'

import React, { useState } from 'react';
import { useOfferStore } from '@/store/useOfferStore';
import { calculateTC } from '@/lib/calculator';
import { Sparkles, Loader2, BrainCircuit, Quote } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // 需安装: npm install react-markdown

export default function AIAdvice() {
  const offers = useOfferStore(state => state.offers);
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (offers.length < 2) return;
    setLoading(true);
    
    // 构造对比简报传给 AI
    const comparisonData = offers.map(o => ({
      company: o.companyName,
      firstYearDetail: calculateTC(o)[0],
      equityPattern: o.equity.pattern
    }));

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({ comparisonData }),
      });
      const data = await res.json();
      setAdvice(data.advice);
    } catch (err) {
      setAdvice("诊断失败，请检查 AI 配置");
    } finally {
      setLoading(false);
    }
  };

  if (offers.length < 2) return null;

  return (
    <div className="mt-12 space-y-6">
      <div className="flex justify-center">
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <div className="relative z-10 flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5 text-indigo-400" />}
            {loading ? 'AI 正在深度复盘数据...' : '获取 AI 专家对比建议'}
          </div>
          {/* 背景动画装饰 */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {advice && (
        <div className="bg-white rounded-3xl border-2 border-indigo-100 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Quote className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-2 text-indigo-600 font-black mb-6 uppercase tracking-widest text-sm">
            <Sparkles className="w-4 h-4" /> AI 职业顾问诊断报告
          </div>
          <article className="prose prose-indigo max-w-none text-slate-700 leading-relaxed">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </article>
        </div>
      )}
    </div>
  );
}