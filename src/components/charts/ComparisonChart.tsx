'use client'

import React, { useMemo, useState, useRef } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { useOfferStore } from '@/store/useOfferStore';
import { calculateTC } from '@/lib/calculator';
import { 
    BarChart3, 
    TrendingUp, 
    Download, 
    Loader2, 
    Coins, 
    Wallet,     // 确保这里有 Wallet
    PieChart 
  } from 'lucide-react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

// 定义对比维度类型
type Metric = 'gross' | 'net' | 'totalValue';

export default function ComparisonChart() {
  const offers = useOfferStore(state => state.offers);
  const [metric, setMetric] = useState<Metric>('totalValue'); // 默认看综合价值
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => {
    return [1, 2, 3, 4].map(year => {
      const dataPoint: any = { name: `第 ${year} 年` };
      offers.forEach(offer => {
        const breakdown = calculateTC(offer);
        // 根据选择的维度提取数据
        dataPoint[offer.companyName] = breakdown[year - 1][metric];
      });
      return dataPoint;
    });
  }, [offers, metric]);

  const handleExport = async () => {
    if (!chartRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(chartRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
      saveAs(dataUrl, `Offer分析-${metric}-${new Date().toLocaleDateString()}.png`);
    } catch (err) { console.error(err); } finally { setIsExporting(false); }
  };

  if (offers.length === 0) return null;

  return (
    <div className="space-y-4">
      <div ref={chartRef} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">收益对比分析</h3>
            <p className="text-slate-500 text-xs mt-1">
              {metric === 'gross' && '对比税前年度总薪酬 (含股票税前)'}
              {metric === 'net' && '对比纯到手现金收入 (已扣除五险一金与个税)'}
              {metric === 'totalValue' && '综合对比 (税后现金 + 公积金总额 + 股票)'}
            </p>
          </div>
          
          {/* 三维度切换开关 */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-start">
            <button 
              onClick={() => setMetric('gross')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${metric === 'gross' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
            >
              <PieChart className="w-3 h-3" /> 税前
            </button>
            <button 
              onClick={() => setMetric('net')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${metric === 'net' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
            >
              <Wallet className="w-3 h-3" /> 税后
            </button>
            <button 
              onClick={() => setMetric('totalValue')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${metric === 'totalValue' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              <Coins className="w-3 h-3" /> 综合
            </button>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                {offers.map((offer, i) => (
                  <linearGradient key={offer.id} id={`color${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={['#6366f1', '#10b981', '#f59e0b'][i % 3]} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={['#6366f1', '#10b981', '#f59e0b'][i % 3]} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <YAxis 
                axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}}
                domain={['dataMin - 50000', 'auto']}
                tickFormatter={(val) => `${(val / 10000).toFixed(0)}w`} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                formatter={(val: number) => [`¥${val.toLocaleString()}`, '预期收入']}
              />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
              {offers.map((offer, i) => (
                <Area
                  key={offer.id}
                  type="monotone"
                  dataKey={offer.companyName}
                  stroke={['#6366f1', '#10b981', '#f59e0b'][i % 3]}
                  strokeWidth={4}
                  fillOpacity={1}
                  fill={`url(#color${i})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button 
        onClick={handleExport}
        disabled={isExporting}
        className="w-full py-3 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all text-sm"
      >
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        导出当前维度分析图
      </button>
    </div>
  );
}