import { Offer } from "@/types/offer";
import { calculateNetIncome } from "./taxCalculator";

export interface AnnualBreakdown {
  year: number;
  gross: number;
  net: number;
  fund: number;
  equity: number;
  totalValue: number;
  cumulative: number;
}

export function calculateTC(offer: Offer): AnnualBreakdown[] {
  const breakdown: AnnualBreakdown[] = [];
  let runningTotalValue = 0;

  // 安全提取数值
  const monthly = Number(offer.baseSalary?.monthly || 0);
  const months = Number(offer.baseSalary?.monthsPerYear || 12);
  const annualBase = monthly * months;
  
  const fixedBonus = Number(offer.bonus?.fixed || 0);
  const targetPercent = Number(offer.bonus?.targetPercent || 0);
  const totalAnnualBonus = (annualBase * (targetPercent / 100)) + fixedBonus;
  
  // 公积金相关参数
  const fundRate = Number(offer.insurance?.providentFundRate || 0.12);
  const userBase = Number(offer.insurance?.socialSecurityBase || 0);
  const cityCap = Number(offer.insurance?.maxCap || 35283);

  for (let i = 0; i < 4; i++) {
    const yearNum = i + 1;
    
    // 签字费逻辑
    const signOn = i === 0 ? Number(offer.signOn?.year1 || 0) : (i === 1 ? Number(offer.signOn?.year2 || 0) : 0);
    
    // 该年税前总额 (现金部分)
    const yearCashGross = annualBase + totalAnnualBonus + signOn;

    // 调用税后计算引擎
    const netData = calculateNetIncome(yearCashGross, userBase, fundRate, cityCap);
    
    // 该年股票归属
    const currentEquity = Number(offer.equity?.totalValue || 0) * (offer.equity?.schedule?.[i] || 0);
    
    // 综合价值 = 税后现金 + 公积金总额 + 股票
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