'use client'

import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { calculateTC } from '@/lib/calculator';
import { useOfferStore } from '@/store/useOfferStore';
import ReactMarkdown from 'react-markdown';
import { Download, Sparkles, ShieldCheck, Landmark, Wallet, TrendingUp } from 'lucide-react';

export default function SharePoster() {
  const { offers, advice } = useOfferStore();
  const posterRef = useRef<HTMLDivElement>(null);

  if (offers.length < 2) return null;

  const handleExport = async () => {
    if (!posterRef.current) return;
    try {
      const dataUrl = await toPng(posterRef.current, { 
        cacheBust: true,
        quality: 1,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `OfferVision_战报_${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('生成海报失败');
    }
  };

  return (
    <div className="mt-12 flex flex-col items-center pb-20">
      <button onClick={handleExport} className="group flex items-center gap-4 px-10 py-5 bg-[#0f172a] text-white rounded-[2rem] font-black shadow-2xl hover:scale-105 transition-all">
        <Download className="w-6 h-6 group-hover:animate-bounce" /> 
        生成深度对比战报 (HD)
      </button>

      {/* 隐藏的海报模板 */}
      <div className="absolute left-[-9999px]">
        <div ref={posterRef} className="w-[1000px] bg-white p-20 text-[#1e293b]" style={{ backgroundColor: '#ffffff' }}>
          
          <header className="flex justify-between items-end border-b-8 border-[#0f172a] pb-12 mb-16">
            <div className="space-y-2">
              <h1 className="text-6xl font-black italic tracking-tighter" style={{ color: '#4f46e5' }}>
                OFFER<span style={{ color: '#0f172a' }}>VISION</span>
              </h1>
              <p className="text-[#64748b] font-black uppercase tracking-[0.3em] text-lg">职场财务价值深度诊断战报</p>
            </div>
            <div className="text-right text-[#94a3b8] font-mono text-sm">
              #{new Date().getTime().toString().slice(-8)}
            </div>
          </header>

          {/* 核心对垒 */}
          <div className="grid grid-cols-2 gap-16 mb-20">
            {offers.slice(0, 2).map((o, idx) => {
              const d = calculateTC(o)[0];
              const cashRatio = (d.net / d.totalValue) * 100;
              const fundRatio = (d.fund / d.totalValue) * 100;
              const equityRatio = (d.equity / d.totalValue) * 100;

              return (
                <div key={o.id} className="p-12 rounded-[3.5rem] bg-[#f8fafc] border-2 border-[#f1f5f9] relative">
                  <div className="absolute -top-6 -left-4 px-6 py-2 bg-[#0f172a] text-white rounded-full text-xs font-black">
                    OFFER {idx + 1}
                  </div>
                  <h2 className="text-5xl font-black text-[#0f172a] mb-10">{o.companyName}</h2>
                  <div className="space-y-8">
                    <div>
                      <p className="text-[#64748b] font-bold text-sm uppercase mb-1">首年综合价值 (TC)</p>
                      <p className="text-7xl font-black" style={{ color: '#4f46e5' }}>
                        ¥{(d.totalValue / 10000).toFixed(1)}<span className="text-3xl ml-1 text-[#94a3b8]">W</span>
                      </p>
                    </div>
                    {/* 收入结构条 */}
                    <div className="space-y-4">
                      <div className="w-full h-12 flex rounded-2xl overflow-hidden shadow-inner bg-[#e2e8f0]">
                        <div className="h-full bg-[#10b981]" style={{ width: `${cashRatio}%` }} />
                        <div className="h-full bg-[#3b82f6]" style={{ width: `${fundRatio}%` }} />
                        <div className="h-full bg-[#a855f7]" style={{ width: `${equityRatio}%` }} />
                      </div>
                      <div className="flex gap-4 text-[10px] font-black uppercase text-[#64748b]">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#10b981]" /> 现金 {cashRatio.toFixed(0)}%</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3b82f6]" /> 公积金 {fundRatio.toFixed(0)}%</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#a855f7]" /> 股票 {equityRatio.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 详细财务差异对比 */}
          <div className="bg-[#f8fafc] rounded-[3rem] p-12 mb-16">
            <h3 className="text-xl font-black text-[#0f172a] mb-8 uppercase tracking-widest flex items-center gap-3">
              <Landmark className="w-6 h-6 text-[#4f46e5]" /> 核心财务对垒明细
            </h3>
            <div className="space-y-6">
              {[
                { label: '税后到手现金 (Y1)', field: 'net' },
                { label: '公积金总储蓄 (Y1)', field: 'fund' },
                { label: '归属股票价值 (Y1)', field: 'equity' },
                { label: '四年累计总价值', field: 'cumulative', isLast: true }
              ].map((item, i) => {
                const v1 = (calculateTC(offers[0])[item.isLast ? 3 : 0] as any)[item.field];
                const v2 = (calculateTC(offers[1])[item.isLast ? 3 : 0] as any)[item.field];
                const diff = v1 - v2;
                return (
                  <div key={i} className="flex justify-between items-center border-b border-[#e2e8f0] pb-4">
                    <span className="text-[#64748b] font-bold">{item.label}</span>
                    <div className="flex items-center gap-6 font-black">
                      <span style={{ color: '#4f46e5' }}>¥{(v1/10000).toFixed(1)}w</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${diff > 0 ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'}`}>
                        {diff > 0 ? '+' : ''}{(diff/10000).toFixed(1)}w
                      </span>
                      <span className="text-[#94a3b8]">¥{(v2/10000).toFixed(1)}w</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI 深度建议部分 - 核心改进 */}
          {advice && (
            <div className="p-16 bg-[#0f172a] rounded-[4rem] text-white">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-8 h-8 text-[#a855f7]" />
                <span className="text-sm font-black uppercase tracking-[0.4em] opacity-60">AI 专家深度诊断</span>
              </div>
              <div className="prose prose-invert prose-slate max-w-none text-slate-300">
                <ReactMarkdown>{advice}</ReactMarkdown>
              </div>
            </div>
          )}

          <footer className="mt-16 flex justify-between items-center pt-10 border-t border-[#e2e8f0]">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-[#10b981]" />
              <div className="text-[10px] font-black uppercase text-[#94a3b8] leading-tight tracking-[0.2em]">
                2025 Financial Intelligence Verified<br />
                Security Standards by OfferVision
              </div>
            </div>
            <div className="text-right text-[10px] font-black uppercase tracking-tighter text-[#0f172a]">
              Quantifying Your Professional Value.
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}