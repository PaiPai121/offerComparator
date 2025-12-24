'use client'

import React, { useRef } from 'react';
import { toPng } from 'html-to-image'; // 使用 html-to-image 规避 lab 颜色解析错误
import { calculateTC } from '@/lib/calculator';
import { useOfferStore } from '@/store/useOfferStore';
import { Download, Sparkles, ShieldCheck } from 'lucide-react';

export default function SharePoster() {
  const offers = useOfferStore(state => state.offers);
  const posterRef = useRef<HTMLDivElement>(null);

  if (offers.length < 2) return null;

  const handleExport = async () => {
    if (!posterRef.current) return;
    
    try {
      // html-to-image 渲染质量高且兼容性好
      const dataUrl = await toPng(posterRef.current, { 
        cacheBust: true,
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `OfferVision_Report_${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('导出海报失败:', err);
      alert('导出海报失败，请检查浏览器兼容性');
    }
  };

  return (
    <div className="mt-12 flex flex-col items-center pb-20">
      <button onClick={handleExport} className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-95">
        <Download className="w-5 h-5" /> 生成深度诊断海报
      </button>

      {/* 渲染容器 */}
      <div className="absolute left-[-9999px]">
        {/* 在海报根部强制指定基础颜色，防止 Tailwind 4 的动态变量失效 */}
        <div ref={posterRef} className="w-[800px] bg-white p-16 text-[#1e293b]">
          <header className="flex justify-between items-end border-b-4 border-[#0f172a] pb-10 mb-12">
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter text-[#4f46e5]">OFFERVISION</h1>
              <p className="text-[#64748b] font-bold mt-2 uppercase tracking-widest text-sm">Deep Value Analysis Report</p>
            </div>
            <div className="text-right text-[#94a3b8] font-mono text-sm">{new Date().toISOString().slice(0,10)}</div>
          </header>

          <div className="grid grid-cols-2 gap-10">
            {offers.slice(0, 2).map((o, idx) => {
              const d = calculateTC(o)[0];
              return (
                <div key={o.id} className={`p-10 rounded-[3rem] ${idx === 0 ? 'bg-[#4f46e5] text-white' : 'bg-[#f1f5f9] text-[#1e293b]'}`}>
                  <h2 className="text-3xl font-black mb-8">{o.companyName}</h2>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[12px] font-bold uppercase opacity-60 mb-1">首年综合总包 (TC)</p>
                      <p className="text-5xl font-black">¥{(d.totalValue / 10000).toFixed(1)}w</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-current/10">
                      <div>
                        <p className="text-[10px] font-bold opacity-60">税后到手现金</p>
                        <p className="text-xl font-bold">¥{(d.net / 10000).toFixed(1)}w</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold opacity-60">公积金总额</p>
                        <p className="text-xl font-bold">¥{(d.fund / 10000).toFixed(1)}w</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <footer className="mt-12 flex justify-between items-center text-[#94a3b8] border-t border-[#e2e8f0] pt-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#10b981]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Financial Model verified</span>
            </div>
            <p className="text-[10px] font-bold">WWW.OFFERVISION.APP</p>
          </footer>
        </div>
      </div>
    </div>
  );
}