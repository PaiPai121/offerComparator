import OfferForm from '@/components/forms/OfferForm';
import OfferList from '@/components/forms/OfferList';
import ComparisonChart from '@/components/charts/ComparisonChart';
import DetailedComparison from '@/components/forms/DetailedComparison';
import { ShieldCheck, LayoutDashboard } from 'lucide-react';
import AIAdvice from '@/components/AIAdvice'; // 1. 确保这里有引入
export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* 顶部状态栏与标题 */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Privacy-First AI Analyst</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
              Offer <span className="text-indigo-600 italic">Vision</span>
            </h1>
            <p className="text-slate-500 font-medium">
              不仅看数字，更看清税后收益与资产积累。
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              2025 税法模型已激活
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              {/* Gemini 1.5 Flash 驱动 */}
            </div>
          </div>
        </header>

        {/* 主交互区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 左侧：录入表单 (占 5 列) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-8">
              <OfferForm />
            </div>
          </div>

          {/* 右侧：图表与列表 (占 7 列) */}
          <div className="lg:col-span-7 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                <LayoutDashboard className="w-5 h-5 text-indigo-500" />
                对比看板
              </div>
              
              {/* 收益对比图表 */}
              <ComparisonChart />

              {/* Offer 摘要列表 */}
              <OfferList />
              
              {/* 2. 关键：把 AI 建议放在详细对比表的下面 */}
              <AIAdvice /> 

            </section>
          </div>
        </div>

        {/* 底部：全宽详细财务对比表格 */}
        <section className="pt-8 border-t border-slate-200">
          <div className="max-w-full">
            <DetailedComparison />
          </div>
        </section>

        {/* 页脚说明 */}
        <footer className="text-center py-12 text-slate-400 text-xs space-y-2">
          <p>© 2025 Offer Comparator. 所有计算仅供参考，请以最终劳动合同为准。</p>
          <p>数据本地存储：您的 Offer 信息从未离开过您的浏览器。</p>
        </footer>
      </div>
    </main>
  );
}