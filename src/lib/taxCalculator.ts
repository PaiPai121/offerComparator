/**
 * 中国个税与五险一金计算器
 */

const TAX_BRACKETS = [
    { limit: 36000, rate: 0.03, deduction: 0 },
    { limit: 144000, rate: 0.1, deduction: 2520 },
    { limit: 300000, rate: 0.2, deduction: 16920 },
    { limit: 420000, rate: 0.25, deduction: 31920 },
    { limit: 660000, rate: 0.3, deduction: 52920 },
    { limit: 960000, rate: 0.35, deduction: 85920 },
    { limit: Infinity, rate: 0.45, deduction: 181920 },
  ];
  
  export function calculateNetIncome(
    annualGross: number, 
    userProvidedBase: number, 
    fundRate: number, 
    maxCap: number
  ) {
    // 核心：强制转换为数字，防止 NaN
    const gross = Number(annualGross) || 0;
    const rawBase = Number(userProvidedBase) || 0;
    const rate = Number(fundRate) || 0;
    const cap = Number(maxCap) || 35283; // 默认北京上限
  
    // 最终缴纳基数受限于城市封顶值
    const effectiveBase = Math.min(rawBase, cap); 
    
    // 五险一金 (个人缴纳部分: 养老8%+医疗2%+失业0.5% + 公积金)
    const monthlyInsurance = effectiveBase * (0.08 + 0.02 + 0.005);
    const monthlyFund = effectiveBase * rate;
    
    const annualInsurance = (monthlyInsurance + monthlyFund) * 12;
    const annualFundTotal = (monthlyFund * 2) * 12; // 个人+公司总额
  
    // 计算年度应纳税所得额 (减去 6w 免征额和五险一金)
    const taxableIncome = Math.max(0, gross - 60000 - annualInsurance);
  
    let tax = 0;
    for (const bracket of TAX_BRACKETS) {
      if (taxableIncome <= bracket.limit) {
        tax = taxableIncome * bracket.rate - bracket.deduction;
        break;
      }
    }
  
    return {
      net: Math.round(gross - annualInsurance - tax),
      fundTotal: Math.round(annualFundTotal),
      tax: Math.round(tax)
    };
  }