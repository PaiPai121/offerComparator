import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Offer } from '@/types/offer';

interface OfferStore {
  offers: Offer[];
  // 添加一个新的 Offer
  addOffer: (offer: Offer) => void;
  // 删除一个 Offer
  removeOffer: (id: string) => void;
  // 清空所有对比
  clearOffers: () => void;
}

export const useOfferStore = create<OfferStore>()(
  // persist 会自动把数据存在浏览器的 LocalStorage 里
  // 这样你刷新页面，填好的 Offer 也不会消失
  persist(
    (set) => ({
      offers: [],
      addOffer: (offer) => 
        set((state) => ({ offers: [...state.offers, offer] })),
      removeOffer: (id) => 
        set((state) => ({ 
          offers: state.offers.filter((o) => o.id !== id) 
        })),
      clearOffers: () => set({ offers: [] }),
    }),
    {
      name: 'offer-storage', // 存储在浏览器里的 key 名称
    }
  )
);