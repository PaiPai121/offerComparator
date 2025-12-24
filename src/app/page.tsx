'use client'

import React from 'react';
import { useOfferStore } from '@/store/useOfferStore';
import { DEMO_OFFERS } from '@/lib/demoData';

// 导入所有核心组件
import OfferForm from '@/components/forms/OfferForm';
import OfferList from '@/components/forms/OfferList';
import ComparisonChart from '@/components/charts/ComparisonChart';
import DetailedComparison from '@/components/forms/DetailedComparison';
import AIAdvice from '@/components/AIAdvice';

// 导入图标
import { Sparkles, BarChart3, TrendingUp, Info } from 'lucide-react';
import SharePoster from '@/components/SharePoster';

export default function Home() {
  const { offers, addOffer } = useOfferStore();

  // 处理一键加载示例数据
  const handleLoadDemo = () => {
    // 为防止重复点击，先判断是否已经有数据
    if (offers.length > 0) return;
    DEMO_OFFERS.forEach(offer => addOffer(offer));
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] py-8 px-4 md:px-8 lg:py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* 顶部标题与介绍 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Offer<span className="text-indigo-600">Vision</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            不仅是算薪资，更是量化你的职业选择。基于 AI 深度解析，看清每一份 Offer 的真实含金量。
          </p>
        </div>

        {/* 1. 空状态引导 Banner - 仅在没有任何 Offer 时显示 */}
        {offers.length === 0 && (
          <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl transition-all hover:shadow-indigo-500/10">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
                  <Sparkles className="w-4 h-4" /> 快速上手
                </div>
                <h2 className="text-3xl font-bold">还没有录入 Offer？</h2>
                <p className="text-slate-400 max-w-md">
                  你可以手动在下方填写，或者粘贴 Offer 文本让 AI 帮你解析。也可以先加载示例数据，看看对比效果。
                </p>
              </div>
              <button 
                onClick={handleLoadDemo}
                className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/20"
              >
                加载示例数据体验
              </button>
            </div>
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]" />
          </div>
        )}

        {/* 2. 主功能区 - 栅格布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 左侧：录入表单 (41.6% 宽度) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 z-10">
            <div className="bg-white rounded-[2rem] p-1 shadow-sm border border-slate-200">
               <OfferForm />
            </div>
            
            {/* 小贴士 */}
            <div className="mt-6 flex items-start gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-700 text-sm">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p>数据仅存储在本地浏览器中，我们不会保存您的任何隐私信息。</p>
            </div>
          </div>

          {/* 右侧：结果看板 (58.3% 宽度) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 图表卡片 */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200 min-h-[450px]">
              <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold text-xl">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                收益趋势对比 (4年)
              </div>
              <ComparisonChart />
            </div>

            {/* 已录入列表 */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold text-xl">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Offer 简报
              </div>
              <OfferList />
            </div>

            {/* 详细对比表格 */}
            <div className="overflow-hidden">
              <DetailedComparison />
            </div>

            {/* 新增：分享海报按钮 */}
            <SharePoster />
            
            {/* AI 建议区域 */}
            <AIAdvice />
          </div>
        </div>

        {/* 底部版权/链接 */}
        <footer className="mt-24 pb-12 border-t border-slate-200 pt-12">
        <div className="flex flex-col items-center space-y-6">
          {/* 信任背书区 */}
          <div className="flex flex-wrap justify-center items-center gap-4 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col items-center border-r border-slate-100 pr-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">平台累计探索</p>
              <img 
                src="https://visitor-badge.laobi.icu/badge?page_id=niyabox.cc&left_text=Total%20Scanned&color=4f46e5" 
                alt="Visitors"
                className="h-5"
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">最近 7 日趋势</p>
              <img 
                src="https://visitor-badge.laobi.icu/badge?page_id=niyabox.cc&history=7" 
                alt="Trend"
                className="h-5"
              />
            </div>
          </div>

          {/* 品牌导流 */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-[2px] bg-slate-200" />
              <h3 className="text-xl font-black text-slate-800 tracking-tighter">
                Offer<span className="text-indigo-600">Vision</span>
              </h3>
              <div className="w-8 h-[2px] bg-slate-200" />
            </div>
            <p className="text-slate-500 text-xs font-medium">
              基于 AI 的职场财务价值深度诊断工具 · 助力每一份职业选择
            </p>
          </div>

          {/* 底部版权与域名 */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
              <a href="https://niyabox.cc" className="hover:text-indigo-600 transition-colors">NIYABOX.CC</a>
              <a href="https://github.com/paipai121/offercomparator" className="hover:text-indigo-600 transition-colors tracking-tighter">GitHub Open Source</a>
            </div>
            <p className="text-slate-300 text-[9px] font-bold uppercase tracking-widest">
              © 2025 Quantifying Professional Value
            </p>
          </div>
        </div>
      </footer>
      </div>
    </main>
  );
}