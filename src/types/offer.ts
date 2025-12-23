export type VestingPattern = 'linear' | 'amazon' | 'google' | 'custom';

export interface Offer {
  id: string;
  companyName: string;
  jobTitle: string;
  
  // 1. 现金薪酬
  baseSalary: {
    monthly: number;       // 月薪
    monthsPerYear: number; // 发薪月数 (如14)
  };
  bonus: {
    fixed: number;         // 固定数额年终奖
    targetPercent: number; // 比例年终奖 (0-100)
  };
  signOn: {
    year1: number;
    year2: number;
  };

  // 2. 社保公积金 (新增)
  insurance: {
    providentFundRate: number;
    socialSecurityBase: number; // 实际缴纳基数 (用户输入的或默认等于月薪)
    maxCap: number;             // 城市封顶值
    useManualBase: boolean;     // 是否开启手动修改基数
  };

  // 3. 股权激励
  equity: {
    type: 'RSU' | 'Option';
    totalValue: number;    // 总价值 (人民币)
    schedule: number[];    // 4年归属比例
  };
  
  createdAt: number;
}