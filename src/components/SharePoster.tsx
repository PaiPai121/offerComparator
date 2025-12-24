'use client'

import React, { useRef, useMemo } from 'react';
import { toPng } from 'html-to-image';
import { calculateTC } from '@/lib/calculator';
import { useOfferStore } from '@/store/useOfferStore';
import ReactMarkdown from 'react-markdown';
import { Download, Sparkles, ShieldCheck, Landmark, Wallet, TrendingUp, Trophy, QrCode } from 'lucide-react';
// 1. 引入 Recharts 组件
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

export default function SharePoster() {
  const { offers, advice } = useOfferStore();
  const posterRef = useRef<HTMLDivElement>(null);

  // 核心对比数据准备
  const comparisonData = useMemo(() => {
    if (offers.length < 2) return null;
    return offers.slice(0, 2).map(o => {
      const d = calculateTC(o)[0];
      const ratios = {
        cash: (d.net / d.totalValue) * 100,
        fund: (d.fund / d.totalValue) * 100,
        equity: (d.equity / d.totalValue) * 100
      };
      return { companyName: o.companyName, data: d, ratios, cumulative: calculateTC(o)[3].cumulative };
    });
  }, [offers]);

  // 2. 准备图表专用数据 (4年累计趋势)
  const chartData = useMemo(() => {
    if (offers.length < 2) return [];
    const o1 = offers[0];
    const o2 = offers[1];
    const tc1 = calculateTC(o1);
    const tc2 = calculateTC(o2);

    return [0, 1, 2, 3].map(i => ({
      year: `Year ${i + 1}`,
      [o1.companyName]: Number((tc1[i].cumulative / 10000).toFixed(1)),
      [o2.companyName]: Number((tc2[i].cumulative / 10000).toFixed(1)),
    }));
  }, [offers]);

  if (!comparisonData) return null;

  const handleExport = async () => {
    if (!posterRef.current) return;
    try {
      const fullHeight = posterRef.current.scrollHeight;
      const dataUrl = await toPng(posterRef.current, { 
        cacheBust: true,
        quality: 1,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
        height: fullHeight, 
        // 确保图表字体渲染正确
        style: { fontFamily: 'sans-serif' }
      });
      const link = document.createElement('a');
      link.download = `OfferVision_对垒战报_${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('生成海报失败，请刷新页面重试');
    }
  };

  return (
    <div className="mt-12 flex flex-col items-center pb-20">
      <button onClick={handleExport} className="group flex items-center gap-4 px-10 py-5 bg-[#0f172a] text-white rounded-[2rem] font-black shadow-2xl hover:scale-105 transition-all">
        <Download className="w-6 h-6 group-hover:animate-bounce" /> 
        生成深度对比战报 (HD)
      </button>

      {/* 导出模板 */}
      <div className="absolute left-[-9999px] top-0">
        {/* 增加宽度到 1100px 以容纳图表 */}
        <div ref={posterRef} className="w-[1100px] bg-white p-20 text-[#1e293b] flex flex-col" style={{ backgroundColor: '#ffffff' }}>
          
          {/* Header */}
          <header className="flex justify-between items-end border-b-8 border-[#0f172a] pb-12 mb-16">
            <div className="space-y-2">
              <h1 className="text-7xl font-black italic tracking-tighter" style={{ color: '#4f46e5' }}>
                OFFER<span style={{ color: '#0f172a' }}>VISION</span>
              </h1>
              <p className="text-[#64748b] font-black uppercase tracking-[0.3em] text-xl">职场财务价值深度诊断战报</p>
            </div>
            <div className="text-right text-[#94a3b8] font-mono text-sm">
              #{new Date().getTime().toString().slice(-8)}
            </div>
          </header>

          {/* 核心对垒卡片 */}
          <div className="grid grid-cols-2 gap-16 mb-20">
            {comparisonData.map((item, idx) => (
              <div key={idx} className="p-12 rounded-[3.5rem] bg-[#f8fafc] border-2 border-[#f1f5f9] relative">
                <div className="absolute -top-6 -left-4 px-6 py-2 bg-[#0f172a] text-white rounded-full text-xs font-black">
                  OFFER {idx + 1}
                </div>
                <h2 className="text-5xl font-black text-[#0f172a] mb-10 truncate">{item.companyName}</h2>
                <div className="space-y-8">
                  <div>
                    <p className="text-[#64748b] font-bold text-sm uppercase mb-1">首年综合价值 (TC)</p>
                    <p className="text-7xl font-black" style={{ color: idx === 0 ? '#4f46e5' : '#0f172a' }}>
                      ¥{(item.data.totalValue / 10000).toFixed(1)}<span className="text-3xl ml-1 text-[#94a3b8]">W</span>
                    </p>
                  </div>
                  <div className="w-full h-12 flex rounded-2xl overflow-hidden shadow-inner bg-[#e2e8f0]">
                    <div className="h-full bg-[#10b981]" style={{ width: `${item.ratios.cash}%` }} />
                    <div className="h-full bg-[#3b82f6]" style={{ width: `${item.ratios.fund}%` }} />
                    <div className="h-full bg-[#a855f7]" style={{ width: `${item.ratios.equity}%` }} />
                  </div>
                  <div className="flex gap-4 text-[11px] font-black uppercase text-[#64748b]">
                    <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> 现金</span>
                    <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> 公积金</span>
                    <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" /> 股票</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3. 新增：4年累计收益趋势图表 */}
          <div className="bg-white rounded-[3rem] p-12 mb-20 border-2 border-[#f1f5f9] shadow-sm">
            <h3 className="text-2xl font-black text-[#0f172a] mb-10 uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#e2e8f0] pb-6">
              <TrendingUp className="w-8 h-8 text-[#4f46e5]" /> 4年累计收益趋势 (万元)
            </h3>
            <div className="h-[500px] w-full" style={{ fontFamily: 'sans-serif' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontWeight: 800, fontSize: 14 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontWeight: 800, fontSize: 14 }} 
                    unit="w"
                    dx={-10}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={60} 
                    wrapperStyle={{ fontWeight: 900, color: '#0f172a', fontSize: 16 }}
                    iconType="circle"
                  />
                  {/* Offer 1 线条 - 紫色 */}
                  <Line 
                    type="monotone" 
                    dataKey={offers[0].companyName} 
                    stroke="#4f46e5" 
                    strokeWidth={5} 
                    dot={{ r: 8, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 3 }}
                    activeDot={false}
                  />
                  {/* Offer 2 线条 - 深色 */}
                  <Line 
                    type="monotone" 
                    dataKey={offers[1].companyName} 
                    stroke="#0f172a" 
                    strokeWidth={5} 
                    dot={{ r: 8, fill: '#0f172a', stroke: '#ffffff', strokeWidth: 3 }}
                    activeDot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 对账明细表 */}
          <div className="bg-[#f8fafc] rounded-[3rem] p-12 mb-16 border-2 border-[#f1f5f9]">
            <h3 className="text-2xl font-black text-[#0f172a] mb-8 uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#e2e8f0] pb-6">
              <Landmark className="w-7 h-7 text-[#4f46e5]" /> 核心财务对垒对账表
            </h3>
            {/* ... 表格内容保持不变 ... */}
            <table className="w-full text-left">
              <thead>
                <tr className="text-[#64748b] text-sm uppercase font-black border-b border-[#e2e8f0]">
                  <th className="pb-4">对比项</th>
                  <th className="pb-4">{comparisonData[0].companyName}</th>
                  <th className="pb-4 text-center">差异</th>
                  <th className="pb-4 text-right">{comparisonData[1].companyName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {[
                  { label: '税后到手现金 (Y1)', field: 'net' },
                  { label: '公积金总储蓄 (Y1)', field: 'fund' },
                  { label: '当年归属股票 (Y1)', field: 'equity' },
                  { label: '四年累计总价值', field: 'cumulative', isLast: true }
                ].map((item, i) => {
                  const v1 = item.isLast ? comparisonData[0].cumulative : (comparisonData[0].data as any)[item.field];
                  const v2 = item.isLast ? comparisonData[1].cumulative : (comparisonData[1].data as any)[item.field];
                  const diff = v1 - v2;
                  return (
                    <tr key={i} className="text-[#0f172a] font-black">
                      <td className="py-6 text-[#64748b] text-base">{item.label}</td>
                      <td className="py-6 text-xl">¥{(v1/10000).toFixed(1)}w</td>
                      <td className="py-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs ${diff >= 0 ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'}`}>
                          {diff >= 0 ? '+' : ''}{(diff/10000).toFixed(1)}w
                        </span>
                      </td>
                      <td className="py-6 text-xl text-right">¥{(v2/10000).toFixed(1)}w</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* AI 建议 */}
          {advice && (
            <div className="p-16 bg-[#0f172a] rounded-[4rem] text-white mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-8 h-8 text-[#a855f7]" />
                <span className="text-sm font-black uppercase tracking-[0.4em] opacity-60">AI 专家诊断建议</span>
              </div>
              <div className="prose prose-invert prose-slate max-w-none text-slate-300 text-xl leading-relaxed font-medium">
                <ReactMarkdown>{advice}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* 页脚推广区 */}
          <footer className="mt-auto flex justify-between items-center p-12 bg-[#f8fafc] rounded-[3.5rem] border-2 border-[#f1f5f9]">
            <div className="flex items-center gap-6">
              <ShieldCheck className="w-14 h-14 text-[#10b981]" />
              <div className="space-y-1">
                <p className="text-xl font-black text-[#0f172a] uppercase">Verified by OfferVision Engine</p>
                <p className="text-lg font-black text-[#4f46e5]">WWW.NIYABOX.CC</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-[#0f172a] uppercase italic">
                Quantifying Your Professional Value.
              </p>
              <p className="text-[10px] font-bold text-[#94a3b8] mt-1">
                Deep Analysis Report Generated by NIYABOX.CC
              </p>
            </div>
          </footer>
          
          <div className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}