'use client'

import React, { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { 
  Calculator, Landmark, Coins, TrendingUp, Plus, Wand2, Loader2, 
  ShieldCheck, Info, Wallet, Sparkles, Building2
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
      insurance: { 
        providentFundRate: 0.12, 
        socialSecurityBase: 0, // 实际缴纳基数
        maxCap: 35283,         // 封顶值
        useManualBase: false 
      },
      equity: { type: 'RSU', totalValue: 0, pattern: 'linear', schedule: VESTING_PRESETS.linear }
    }
  });

  const formData = watch();

  // 【核心逻辑 1】自动同步：如果未开启手动模式，缴纳基数 = 月薪
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

  const year1Data = liveTC[0] || { net: 0, totalValue: 0 };

  const handleAiExtract = async () => {
    if (!aiText) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiText }),
      });
      const data = await res.json();
      if (data.companyName) setValue('companyName', data.companyName);
      if (data.baseSalary) {
        setValue('baseSalary.monthly', Number(data.baseSalary.monthly));
        setValue('baseSalary.monthsPerYear', Number(data.baseSalary.monthsPerYear));
      }
      // ... 其他 AI 填充逻辑
      setAiText('');
    } catch (err) { alert("AI 解析失败"); } finally { setIsAiLoading(false); }
  };

  const onSubmit = (data: Offer) => {
    addOffer({ ...data, id: uuidv4(), createdAt: Date.now() });
    reset();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
      {/* AI 快速录入 */}
      <div className="p-6 bg-slate-900">
        <div className="flex items-center gap-2 text-indigo-400 font-bold mb-3 text-xs">
          <Sparkles className="w-4 h-4" /> AI 快速录入
        </div>
        <textarea 
          className="w-full h-20 p-3 text-xs bg-slate-800 border-none rounded-xl mb-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="在此粘贴 Offer 文本..."
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}
        />
        <button type="button" onClick={handleAiExtract} disabled={isAiLoading} className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 text-sm">
          {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          {isAiLoading ? '解析中...' : 'AI 一键提取数据'}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
        {/* 1. 基础信息 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Landmark className="w-4 h-4 text-indigo-500" /> 公司与职位
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input {...register('companyName')} placeholder="公司名称" className="px-4 py-2 border rounded-xl text-sm" required />
            <input {...register('jobTitle')} placeholder="职位名称" className="px-4 py-2 border rounded-xl text-sm" />
          </div>
        </section>

        {/* 2. 现金薪酬 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Coins className="w-4 h-4 text-emerald-500" /> 现金薪酬
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">月薪 (Base)</label>
              <input type="number" {...register('baseSalary.monthly')} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">发薪月数</label>
              <input type="number" {...register('baseSalary.monthsPerYear')} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">固定奖金</label>
              <input type="number" {...register('bonus.fixed')} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">绩效奖 %</label>
              <input type="number" {...register('bonus.targetPercent')} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
          </div>
        </section>

        {/* 3. 公积金深度设置 */}
        <section className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Building2 className="w-4 h-4 text-emerald-500" /> 城市与公积金
            </div>
            <div className="flex gap-1 bg-slate-200/50 p-1 rounded-lg">
              {Object.keys(CITY_DATA_2025).map(cityName => (
                <button
                  key={cityName}
                  type="button"
                  onClick={() => {
                    const config = CITY_DATA_2025[cityName];
                    setValue('insurance.providentFundRate', config.defaultRate);
                    setValue('insurance.maxCap', config.maxBase);
                  }}
                  className="text-[9px] px-2 py-1 rounded-md font-bold transition-all hover:bg-white hover:text-indigo-600 text-slate-500"
                >
                  {cityName}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">缴纳比例 ({Math.round((formData.insurance?.providentFundRate || 0.12) * 100)}%)</label>
              <input type="range" min="0.05" max="0.12" step="0.01" {...register('insurance.providentFundRate')} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase">实际缴纳基数</label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" {...register('insurance.useManualBase')} className="w-3 h-3 rounded" />
                  <span className="text-[9px] font-bold text-slate-400">手动修改</span>
                </label>
              </div>
              <input 
                type="number" 
                {...register('insurance.socialSecurityBase')} 
                disabled={!formData.insurance?.useManualBase}
                className={`w-full px-4 py-2 border rounded-xl text-sm font-bold ${formData.insurance?.useManualBase ? 'bg-white border-indigo-200 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">城市封顶基数 (最大缴纳基数)</label>
              <input type="number" {...register('insurance.maxCap')} className="w-full px-4 py-2 border rounded-xl text-sm bg-white" />
              <p className="text-[9px] text-slate-400 px-1">注：计算时将自动取 [实际基数] 和 [封顶基数] 的较小值。</p>
            </div>
          </div>
        </section>

        {/* 4. 股权激励 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <TrendingUp className="w-4 h-4 text-purple-500" /> 股权激励 (RSU/Options)
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">4年总包价值</label>
              <input type="number" {...register('equity.totalValue')} className="w-full px-4 py-2 border rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">归属方案</label>
              <select onChange={(e) => setValue('equity.schedule', VESTING_PRESETS[e.target.value as VestingPattern])} className="w-full px-4 py-2 border rounded-xl bg-white text-sm">
                <option value="linear">平均归属 (25%每年)</option>
                <option value="amazon">Amazon (5/15/40/40)</option>
                <option value="google">Google (前多后少)</option>
              </select>
            </div>
          </div>
        </section>

        {/* 预览区 */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl space-y-4">
          <div className="flex justify-between items-end border-b border-slate-800 pb-4">
            <div>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                <Wallet className="w-3 h-3 text-emerald-400" /> Year 1 纯到手现金
              </p>
              <p className="text-2xl font-black text-emerald-400">¥ {Math.round(year1Data.net).toLocaleString()}</p>
            </div>
            <div className="text-right"><p className="text-slate-500 text-[9px]">已扣除五险一金个税</p></div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                <Coins className="w-3 h-3 text-indigo-400" /> Year 1 综合价值 (含公积金)
              </p>
              <p className="text-3xl font-black text-indigo-400">¥ {Math.round(year1Data.totalValue).toLocaleString()}</p>
            </div>
            <button type="submit" className="bg-white text-indigo-600 p-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg active:scale-95"><Plus className="w-6 h-6" /></button>
          </div>
        </div>
      </form>
    </div>
  );
}