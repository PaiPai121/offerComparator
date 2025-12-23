export interface CityConfig {
    name: string;
    maxBase: number;      // 公积金最大缴纳基数 (封顶线)
    defaultRate: number;  // 该城市常见的缴纳比例
  }
  
  export const CITY_DATA_2025: Record<string, CityConfig> = {
    "北京": { name: "北京", maxBase: 35283, defaultRate: 0.12 },
    "上海": { name: "上海", maxBase: 36012, defaultRate: 0.07 },
    "深圳": { name: "深圳", maxBase: 41190, defaultRate: 0.12 },
    "广州": { name: "广州", maxBase: 39579, defaultRate: 0.12 },
    "杭州": { name: "杭州", maxBase: 39531, defaultRate: 0.12 },
    "其他": { name: "其他", maxBase: 30000, defaultRate: 0.12 },
  };