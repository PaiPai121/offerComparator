import { Offer } from "@/types/offer";
import { v4 as uuidv4 } from "uuid";

export const DEMO_OFFERS: Offer[] = [
  {
    id: uuidv4(),
    companyName: "某大厂 (核心业务)",
    baseSalary: { monthly: 35000, monthsPerYear: 16 },
    bonus: { targetPercent: 0, fixed: 0 },
    equity: { totalValue: 600000, schedule: [0.25, 0.25, 0.25, 0.25], pattern: "even" },
    signOn: { year1: 50000, year2: 0 },
    insurance: { providentFundRate: 0.12, socialSecurityBase: 35283, maxCap: 35283 }
  },
  {
    id: uuidv4(),
    companyName: "独角兽 (高期权)",
    baseSalary: { monthly: 45000, monthsPerYear: 14 },
    bonus: { targetPercent: 0, fixed: 0 },
    equity: { totalValue: 1200000, schedule: [0.15, 0.25, 0.25, 0.35], pattern: "back-loaded" },
    signOn: { year1: 0, year2: 0 },
    insurance: { providentFundRate: 0.07, socialSecurityBase: 25000, maxCap: 35283 }
  }
];