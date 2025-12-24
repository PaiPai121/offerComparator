'use client'

import { useOfferStore } from '@/store/useOfferStore';
import { calculateTC } from '@/lib/calculator';
import { ShieldCheck, Info, Wallet, PieChart, TrendingUp } from 'lucide-react';

export default function DetailedComparison() {
  const offers = useOfferStore(state => state.offers);
  if (offers.length < 2) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden mt-12">
      <div className="p-6 bg-slate-900 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" /> 深度财务对比 (第一年)
        </h3>
        <p className="text-slate-400 text-xs mt-1">基于 2025 中国个税及标准社保模型计算</p>
      </div>

      <div className="overflow-x-auto">
        {/* 修复：恢复表头，并增加 min-w 防止坍塌 */}
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[#64748b]">
              <th className="p-4 text-xs font-black uppercase tracking-widest">财务维度</th>
              {offers.map(o => (
                <th key={o.id} className="p-4 text-base font-black text-indigo-600 border-l border-slate-100">
                  {o.companyName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* 1. 税前总包 */}
            <tr>
              <td className="p-4 text-sm font-medium text-slate-600 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-slate-400" /> 年度税前总包
              </td>
              {offers.map(o => (
                <td key={o.id} className="p-4 font-bold border-l border-slate-100">
                  ¥{(calculateTC(o)[0].gross / 10000).toFixed(1)}w
                </td>
              ))}
            </tr>
            {/* 2. 税后现金 */}
            <tr>
              <td className="p-4 text-sm font-medium text-slate-600 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-500" /> 税后到手现金
              </td>
              {offers.map(o => (
                <td key={o.id} className="p-4 font-bold text-emerald-600 border-l border-slate-100">
                  ¥{(calculateTC(o)[0].net / 10000).toFixed(1)}w
                </td>
              ))}
            </tr>
            {/* 3. 公积金 */}
            <tr>
              <td className="p-4 text-sm font-medium text-slate-600 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> 公积金 (个人+公司)
              </td>
              {offers.map(o => (
                <td key={o.id} className="p-4 font-bold text-blue-600 border-l border-slate-100">
                  ¥{(calculateTC(o)[0].fund / 10000).toFixed(1)}w
                </td>
              ))}
            </tr>
            {/* 4. 股票行权 */}
            <tr>
              <td className="p-4 text-sm font-medium text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" /> 当年股票行权价值
              </td>
              {offers.map(o => (
                <td key={o.id} className="p-4 font-bold text-purple-600 border-l border-slate-100">
                  ¥{(calculateTC(o)[0].equity / 10000).toFixed(1)}w
                </td>
              ))}
            </tr>
            {/* 5. 综合总价值 */}
            <tr className="bg-indigo-50/50">
              <td className="p-4 text-sm font-black text-indigo-900 italic">综合收益 (首年)</td>
              {offers.map(o => (
                <td key={o.id} className="p-4 text-xl font-black text-indigo-700 border-l border-indigo-100">
                  ¥{(calculateTC(o)[0].totalValue / 10000).toFixed(1)}w
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}