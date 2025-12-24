import { Offer } from "@/types/offer";
import { calculateNetIncome } from "./taxCalculator";

export interface AnnualBreakdown {
  year: number;
  gross: number;           // 税前总包 (现金 + 股票)
  net: number;             // 税后到手现金
  fund: number;            // 公积金总额 (个人 + 公司)
  equity: number;          // 当年行权股票
  totalValue: number;      // 综合价值 (税后现金 + 公积金总额 + 股票)
  cumulative: number;      // 累计综合价值
}

// 统一导出函数，确保 OfferForm 和 DetailedComparison 都能正常调用
export function calculateTC(offer: Offer): AnnualBreakdown[] {
  const breakdown: AnnualBreakdown[] = [];
  let runningTotalValue = 0;

  // 安全转换数值，防止输入为空时计算崩溃
  const monthly = Number(offer.baseSalary?.monthly || 0);
  const months = Number(offer.baseSalary?.monthsPerYear || 12);
  const annualBase = monthly * months;
  
  const fixedBonus = Number(offer.bonus?.fixed || 0);
  const targetPercent = Number(offer.bonus?.targetPercent || 0);
  const totalAnnualBonus = (annualBase * (targetPercent / 100)) + fixedBonus;
  
  const fundRate = Number(offer.insurance?.providentFundRate || 0.12);
  const userBase = Number(offer.insurance?.socialSecurityBase || 0);
  const cityCap = Number(offer.insurance?.maxCap || 35283);

  for (let i = 0; i < 4; i++) {
    const yearNum = i + 1;
    
    // 签字费逻辑：第一年 year1，第二年 year2
    const signOn = i === 0 ? Number(offer.signOn?.year1 || 0) : (i === 1 ? Number(offer.signOn?.year2 || 0) : 0);
    
    // 当年现金税前总额
    const yearCashGross = annualBase + totalAnnualBonus + signOn;

    // 调用税后计算引擎（请确保 taxCalculator.ts 中有此导出）
    const netData = calculateNetIncome(yearCashGross, userBase, fundRate, cityCap);
    
    // 当年股票归属价值
    const currentEquity = Number(offer.equity?.totalValue || 0) * (offer.equity?.schedule?.[i] || 0);
    
    // 综合价值计算
    const yearlyValue = netData.net + netData.fundTotal + currentEquity;
    runningTotalValue += yearlyValue;

    breakdown.push({
      year: yearNum,
      gross: yearCashGross + currentEquity,
      net: netData.net,
      fund: netData.fundTotal,
      equity: currentEquity,
      totalValue: yearlyValue,
      cumulative: runningTotalValue,
    });
  }

  return breakdown;
}