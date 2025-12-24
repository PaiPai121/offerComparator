import { create } from 'zustand';
import { Offer } from '@/types/offer';

interface OfferState {
  offers: Offer[];
  advice: string | null; // 新增：存储 AI 建议
  addOffer: (offer: Offer) => void;
  removeOffer: (id: string) => void;
  clearOffers: () => void;
  setAdvice: (advice: string | null) => void; // 新增：更新 AI 建议
}

export const useOfferStore = create<OfferState>((set) => ({
  offers: [],
  advice: null,
  addOffer: (offer) => set((state) => ({ offers: [...state.offers, offer] })),
  removeOffer: (id) => set((state) => ({ offers: state.offers.filter((o) => o.id !== id) })),
  clearOffers: () => set({ offers: [], advice: null }), // 清空时也重置建议
  setAdvice: (advice) => set({ advice }),
}));