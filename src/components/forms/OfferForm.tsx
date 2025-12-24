'use client'

import React, { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { 
  Landmark, Coins, TrendingUp, Plus, Wand2, Loader2, 
  Wallet, Sparkles, Building2, Info, ChevronRight
} from 'lucide-react';

import { useOfferStore } from '@/store/useOfferStore';
import { calculateTC } from '@/lib/calculator'; //
import { Offer, VestingPattern } from '@/types/offer'; //
import { CITY_DATA_2025 } from '@/lib/cityConfig'; //

const VESTING_PRESETS: Record<VestingPattern, number[]> = {
  linear: [0.25, 0.25, 0.25, 0.25],
  amazon: [0.05, 0.15, 0.40, 0.40],
  google: [0.33, 0.33, 0.22, 0.12],
  custom: [0.25, 0.25, 0.25, 0.25],
};

export default function OfferForm() {
  const addOffer = useOfferStore(state => state.addOffer); //
  const [aiText, setAiText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } = useForm<Offer>({
    defaultValues: {
      baseSalary: { monthly: 0, monthsPerYear: 12 },
      bonus: { fixed: 0, targetPercent: 0 },
      signOn: { year1: 0, year2: 0 },
      insurance: { 
        providentFundRate: 0.12, 
        socialSecurityBase: 0, 
        maxCap: 35283, 
        useManualBase: false 
      },
      equity: { type: 'RSU', totalValue: 0, pattern: 'linear', schedule: VESTING_PRESETS.linear }
    }
  });

  const formData = watch();

  // 自动计算：非手动模式下，缴纳基数默认等于月薪
  useEffect(() => {
    if (!formData.insurance?.useManualBase) {
      setValue('insurance.socialSecurityBase', formData.baseSalary?.monthly || 0);
    }
  }, [formData.baseSalary?.monthly, formData.insurance?.useManualBase, setValue]);

  // 实时预览计算结果
  const liveTC = useMemo(() => {
    try {
      const previewOffer: Offer = { ...formData, id: 'preview', createdAt: Date.now() };
      return calculateTC(previewOffer); 
    } catch (e) { return []; }
  }, [formData]);

  const year1 = liveTC[0] || { net: 0, totalValue: 0, fund: 0, equity: 0 };

  // AI 提取逻辑适配后端
  const handleAiExtract = async () => {
    if (!aiText.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: aiText }), 
      });
      const data = await res.json();
      if (data.companyName) setValue('companyName', data.companyName);
      if (data.monthlySalary) setValue('baseSalary.monthly', Number(data.monthlySalary));
      if (data.months) setValue('baseSalary.monthsPerYear', Number(data.months));
      if (data.bonus) setValue('bonus.fixed', Number(data.bonus));
      if (data.equity) setValue('equity.totalValue', Number(data.equity));
      if (data.signOn) setValue('signOn.year1', Number(data.signOn));
      
      if (data.city && CITY_DATA_2025[data.city]) {
        const config = CITY_DATA_2025[data.city];
        setValue('insurance.providentFundRate', config.defaultRate);
        setValue('insurance.maxCap', config.maxBase);
      }
      setAiText('');
    } catch (err) { alert("AI 解析失败"); } finally { setIsAiLoading(false); }
  };

  const onSubmit = (data: Offer) => {
    addOffer({ ...data, id: uuidv4(), createdAt: Date.now() }); //
    reset();
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
      {/* AI 解析区域 */}
      <div className="p-6 bg-slate-900">
        <div className="flex items-center gap-2 text-indigo-400 font-bold mb-3 text-[10px] uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> 智能提取文本
        </div>
        <textarea 
          className="w-full h-16 p-3 text-xs bg-slate-800 border-none rounded-xl mb-3 text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          placeholder="粘贴 Offer 文本，AI 自动填写下方表单..."
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}
        />
        <button type="button" onClick={handleAiExtract} disabled={isAiLoading} className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 text-xs">
          {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
          AI 一键填充
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
        {/* 1. 基本信息 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">公司名称</label>
            <input {...register('companyName')} placeholder="如：字节跳动" className="w-full px-4 py-2 border rounded-xl text-sm" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">职位名称</label>
            <input {...register('jobTitle')} placeholder="如：架构师" className="w-full px-4 py-2 border rounded-xl text-sm" />
          </div>
        </div>

        {/* 2. 核心收入 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 text-emerald-500" /> 现金薪酬明细
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">月薪 (Base)</label>
              <input type="number" {...register('baseSalary.monthly')} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">发薪月数</label>
              <input type="number" {...register('baseSalary.monthsPerYear')} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">固定年终 (元)</label>
              <input type="number" {...register('bonus.fixed')} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">绩效系数 (%)</label>
              <input type="number" {...register('bonus.targetPercent')} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
          </div>
        </section>

        {/* 3. 公积金封顶与基数 (重点修复) */}
        <section className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
              <Building2 className="w-3.5 h-3.5 text-blue-500" /> 城市及公积金策略
            </div>
            <div className="flex gap-1.5 bg-slate-200/50 p-1 rounded-lg">
              {['北京', '上海', '深圳', '杭州'].map(city => (
                <button key={city} type="button" onClick={() => {
                  const c = CITY_DATA_2025[city];
                  setValue('insurance.providentFundRate', c.defaultRate);
                  setValue('insurance.maxCap', c.maxBase);
                }} className="text-[9px] px-2 py-0.5 rounded-md font-bold transition-all hover:bg-white text-slate-500 hover:text-indigo-600">{city}</button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>缴纳比例</span>
                <span className="text-indigo-600">{Math.round((formData.insurance?.providentFundRate || 0) * 100)}%</span>
              </div>
              <input type="range" min="0.05" max="0.12" step="0.01" {...register('insurance.providentFundRate')} className="w-full h-1.5 accent-indigo-600 cursor-pointer" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400">实际缴纳基数</label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" {...register('insurance.useManualBase')} className="w-3 h-3 rounded" />
                  <span className="text-[9px] text-slate-500">手动修改</span>
                </label>
              </div>
              <input type="number" {...register('insurance.socialSecurityBase')} disabled={!formData.insurance?.useManualBase} className={`w-full px-3 py-2 border rounded-xl text-sm font-mono ${!formData.insurance?.useManualBase ? 'bg-slate-100 text-slate-400' : 'bg-white border-indigo-200 text-indigo-600'}`} />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 ml-1">城市封顶基数 (Max Cap)</label>
              <input type="number" {...register('insurance.maxCap')} className="w-full px-3 py-2 border rounded-xl text-sm bg-white border-slate-200" />
              <p className="text-[9px] text-slate-400 px-1">注：若月薪超过此值，则按此基数计算公积金</p>
            </div>
          </div>
        </section>

        {/* 4. 股票/签字费 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase">
            <TrendingUp className="w-3.5 h-3.5 text-purple-500" /> 长期激励与股权
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">股票总价值 (4年)</label>
              <input type="number" {...register('equity.totalValue')} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">签字费 (第1年)</label>
              <input type="number" {...register('signOn.year1')} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">归属方案</label>
              <select onChange={(e) => setValue('equity.schedule', VESTING_PRESETS[e.target.value as VestingPattern])} className="w-full px-3 py-2 border rounded-xl bg-white text-sm">
                <option value="linear">平均 (25%/年)</option>
                <option value="amazon">Amazon (5/15/40/40)</option>
                <option value="google">Google (前多后少)</option>
              </select>
            </div>
          </div>
        </section>

        {/* 汇总预览预览卡片 */}
        <div className="bg-slate-900 rounded-[1.5rem] p-6 text-white shadow-xl space-y-4">
          <div className="flex justify-between items-end border-b border-slate-800 pb-4">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Wallet className="w-3 h-3 text-emerald-400" /> 第1年到手现金 (Net)
              </p>
              <p className="text-2xl font-black text-emerald-400">¥ {Math.round(year1.net).toLocaleString()}</p>
            </div>
            <div className="text-right"><p className="text-[9px] text-slate-600 italic">已扣除五险一金/个税</p></div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> 第1年综合总收益 (TC)
              </p>
              <p className="text-3xl font-black text-indigo-400">¥ {Math.round(year1.totalValue).toLocaleString()}</p>
            </div>
            <button type="submit" className="bg-white text-indigo-600 p-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg active:scale-95"><Plus className="w-6 h-6" /></button>
          </div>
        </div>
      </form>
    </div>
  );
}