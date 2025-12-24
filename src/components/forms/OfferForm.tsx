'use client'

import React, { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { 
  Landmark, Coins, TrendingUp, Plus, Wand2, Loader2, 
  Wallet, Sparkles, Building2, ShieldCheck, Info 
} from 'lucide-react';
import { useOfferStore } from '@/store/useOfferStore';
import { calculateTC } from '@/lib/calculator';
import { Offer, VestingPattern } from '@/types/offer';
import { CITY_DATA_2025 } from '@/lib/cityConfig';

const VESTING_PRESETS: Record<VestingPattern, number[]> = {
  linear: [0.25, 0.25, 0.25, 0.25],
  amazon: [0.05, 0.15, 0.40, 0.40],
  google: [0.33, 0.33, 0.22, 0.12],
  custom: [0.25, 0.25, 0.25, 0.25],
};

export default function OfferForm() {
  const addOffer = useOfferStore(state => state.addOffer);
  const [aiText, setAiText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } = useForm<Offer>({
    defaultValues: {
      baseSalary: { monthly: 0, monthsPerYear: 12 },
      bonus: { fixed: 0, targetPercent: 0 },
      signOn: { year1: 0, year2: 0 },
      insurance: { providentFundRate: 0.12, socialSecurityBase: 0, maxCap: 35283, useManualBase: false },
      equity: { type: 'RSU', totalValue: 0, pattern: 'linear', schedule: VESTING_PRESETS.linear }
    }
  });

  const formData = watch();

  useEffect(() => {
    if (!formData.insurance?.useManualBase) {
      setValue('insurance.socialSecurityBase', formData.baseSalary?.monthly || 0);
    }
  }, [formData.baseSalary?.monthly, formData.insurance?.useManualBase, setValue]);

  const liveTC = useMemo(() => {
    try {
      const previewOffer: Offer = { ...formData, id: 'preview', createdAt: Date.now() };
      return calculateTC(previewOffer);
    } catch (e) { return []; }
  }, [formData]);

  const year1 = liveTC[0] || { net: 0, fund: 0, equity: 0, totalValue: 0 };

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
    addOffer({ ...data, id: uuidv4(), createdAt: Date.now() });
    reset();
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
      <div className="p-6 bg-[#0f172a]">
        <div className="flex items-center gap-2 text-indigo-400 font-bold mb-3 text-[10px] uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> AI 智能解析
        </div>
        <textarea 
          className="w-full h-16 p-3 text-xs bg-[#1e293b] border-none rounded-2xl mb-3 text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          placeholder="在此粘贴文本，如：字节跳动，35k*15, 签字费 5w..."
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}
        />
        <button type="button" onClick={handleAiExtract} disabled={isAiLoading} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 text-xs">
          {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          解析并回填
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">公司</label>
            <input {...register('companyName')} placeholder="必填" className="w-full px-4 py-2.5 border rounded-2xl text-sm" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">职位</label>
            <input {...register('jobTitle')} placeholder="可选" className="w-full px-4 py-2.5 border rounded-2xl text-sm" />
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <Coins className="w-4 h-4 text-emerald-500" /> 现金薪酬 (月薪与年终)
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">月薪 (Base)</label>
              <input type="number" {...register('baseSalary.monthly')} className="w-full px-4 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">发薪月数</label>
              <input type="number" {...register('baseSalary.monthsPerYear')} className="w-full px-4 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">固定年终奖</label>
              <input type="number" {...register('bonus.fixed')} className="w-full px-4 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">绩效系数(月)</label>
              <input type="number" step="0.1" {...register('bonus.targetPercent')} className="w-full px-4 py-2 border rounded-xl text-sm" />
            </div>
          </div>
        </section>

        <section className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
              <Building2 className="w-4 h-4 text-blue-500" /> 公积金深度配置
            </div>
            <div className="flex gap-1.5">
              {['北京', '上海', '深圳', '杭州'].map(city => (
                <button key={city} type="button" onClick={() => {
                  const c = CITY_DATA_2025[city];
                  setValue('insurance.providentFundRate', c.defaultRate);
                  setValue('insurance.maxCap', c.maxBase);
                }} className="text-[9px] px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-sm hover:text-indigo-600 transition-colors">{city}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>缴纳比例</span>
                <span>{Math.round((formData.insurance?.providentFundRate || 0.12) * 100)}%</span>
              </div>
              <input type="range" min="0.05" max="0.12" step="0.01" {...register('insurance.providentFundRate')} className="w-full h-1.5 accent-indigo-600 bg-slate-200 rounded-full" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">公积金封顶基数</label>
              <input type="number" {...register('insurance.maxCap')} className="w-full px-4 py-2 border rounded-xl text-sm bg-white" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase">实际缴纳基数</label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" {...register('insurance.useManualBase')} className="w-3.5 h-3.5 border-slate-300" />
                  <span className="text-[10px] text-slate-500 font-bold">手动修改</span>
                </label>
              </div>
              <input type="number" {...register('insurance.socialSecurityBase')} disabled={!formData.insurance?.useManualBase} className={`w-full px-4 py-2 border rounded-xl text-sm font-bold ${!formData.insurance?.useManualBase ? 'bg-slate-100 text-slate-400' : 'bg-white text-indigo-600 border-indigo-200'}`} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-purple-500" /> 股票与签字费
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">4年股票总价值</label>
              <input type="number" {...register('equity.totalValue')} className="w-full px-4 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">首年签字费</label>
              <input type="number" {...register('signOn.year1')} className="w-full px-4 py-2 border rounded-xl text-sm" />
            </div>
          </div>
        </section>

        <div className="bg-[#0f172a] rounded-[2rem] p-7 text-white shadow-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 首年综合价值 (TC)
            </p>
            <p className="text-4xl font-black text-indigo-400">¥ {Math.round(year1.totalValue).toLocaleString()}</p>
          </div>
          <button type="submit" className="bg-white text-[#0f172a] p-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl">
            <Plus className="w-7 h-7" />
          </button>
        </div>
      </form>
    </div>
  );
}