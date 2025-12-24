'use client'

import React from 'react';
import { useOfferStore } from '@/store/useOfferStore';
import { calculateTC } from '@/lib/calculator';
import { ShieldCheck, Info, Wallet, PieChart, TrendingUp } from 'lucide-react';

export default function DetailedComparison() {
  // 从状态库获取所有已录入的 Offer
  const offers = useOfferStore(state => state.offers);

  // 只有当存在至少两个 Offer 时才显示对比表格
  if (offers.length < 2) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden mt-12">
      {/* 表格头部标题区 */}
      <div className="p-6 bg-slate-900 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" /> 深度财务对比 (首年明细)
        </h3>
        <p className="text-slate-400 text-xs mt-1">基于 2025 中国个税模型及标准社保基数计算</p>
      </div>

      {/* 响应式容器：防止表格在移动端撑破布局或与输入框重叠 */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase w-48">对比维度</th>
              {offers.map(o => (
                <th key={o.id} className="p-4 text-base font-black text-indigo-600 border-l border-slate-100 min-w-[150px]">
                  {o.companyName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* 1. 税前总额：现金 + 当年归属股票 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4 text-sm font-medium text-slate-600 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-slate-400" /> 年度税前总包
              </td>
              {offers.map(o => {
                const year1 = calculateTC(o)[0]; // 获取第一年数据
                return (
                  <td key={o.id} className="p-4 font-bold border-l border-slate-100">
                    ¥{(year1.gross / 10000).toFixed(1)}w
                  </td>
                );
              })}
            </tr>

            {/* 2. 税后到手：扣除五险一金和个税后的纯现金 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4 text-sm font-medium text-slate-600 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-500" /> 税后到手现金
              </td>
              {offers.map(o => {
                const year1 = calculateTC(o)[0];
                return (
                  <td key={o.id} className="p-4 font-bold text-emerald-600 border-l border-slate-100">
                    ¥{(year1.net / 10000).toFixed(1)}w
                  </td>
                );
              })}
            </tr>

            {/* 3. 公积金：包含个人缴纳和公司缴纳的总额 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4 text-sm font-medium text-slate-600 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> 公积金 (个人+公司)
              </td>
              {offers.map(o => {
                const year1 = calculateTC(o)[0];
                return (
                  <td key={o.id} className="p-4 font-bold text-blue-600 border-l border-slate-100">
                    ¥{(year1.fund / 10000).toFixed(1)}w
                  </td>
                );
              })}
            </tr>

            {/* 4. 股票/期权：当年归属部分的价值 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4 text-sm font-medium text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" /> 当年股票归属
              </td>
              {offers.map(o => {
                const year1 = calculateTC(o)[0];
                return (
                  <td key={o.id} className="p-4 font-bold text-purple-600 border-l border-slate-100">
                    ¥{(year1.equity / 10000).toFixed(1)}w
                  </td>
                );
              })}
            </tr>

            {/* 5. 综合价值：最核心的对比指标 */}
            <tr className="bg-indigo-50/50">
              <td className="p-4 text-sm font-black text-indigo-900">
                第一年综合收益
              </td>
              {offers.map(o => {
                const year1 = calculateTC(o)[0];
                return (
                  <td key={o.id} className="p-4 text-xl font-black text-indigo-700 border-l border-indigo-100">
                    ¥{(year1.totalValue / 10000).toFixed(1)}w
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* 底部备注 */}
      <div className="p-4 bg-slate-50 text-[10px] text-slate-400 italic">
        * 综合收益 = 税后现金 + 公积金总额 + 当年归属股票价值。暂未扣除股票行权产生的个人所得税。
      </div>
    </div>
  );
}