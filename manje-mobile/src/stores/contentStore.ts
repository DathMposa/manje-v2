import { create } from 'zustand';
import {
  subscribeEducationArticles,
  subscribeSupportFaqs,
  type EducationArticleRecord,
  type SupportFaqRecord,
} from '../lib/firestore';

interface ContentState {
  isLoading: boolean;
  articles: EducationArticleRecord[];
  faqs: SupportFaqRecord[];
  initializeContent: () => void;
  getArticle: (id: string) => EducationArticleRecord | undefined;
  reset: () => void;
}

let articlesSubscription: (() => void) | null = null;
let faqsSubscription: (() => void) | null = null;

const resetContentSubscriptions = () => {
  articlesSubscription?.();
  articlesSubscription = null;
  faqsSubscription?.();
  faqsSubscription = null;
};

export const useContentStore = create<ContentState>()((set, get) => ({
  isLoading: false,
  articles: [],
  faqs: [],

  initializeContent: () => {
    if (articlesSubscription || faqsSubscription) {
      return;
    }

    set({ isLoading: true });

    articlesSubscription = subscribeEducationArticles((articles) => {
      set({
        articles,
        isLoading: faqsSubscription === null ? true : false,
      });
    });

    faqsSubscription = subscribeSupportFaqs((faqs) => {
      set({
        faqs,
        isLoading: false,
      });
    });
  },

  getArticle: (id) => get().articles.find((article) => article.id === id),

  reset: () => {
    resetContentSubscriptions();
    set({
      isLoading: false,
      articles: [],
      faqs: [],
    });
  },
}));
