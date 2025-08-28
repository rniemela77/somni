import { defineStore } from 'pinia';
import type { Assessment } from '../../shared/types/shared';
import { fetchAllAssessments } from '@/services/firebase-assessment-service';

interface State {
  allAssessments: Assessment[];
  loading: boolean;
  error: string | null;
}

export const useAssessmentStore = defineStore('assessment', {
  state: (): State => ({
    allAssessments: [],
    loading: false,
    error: null,
  }),
  
  getters: {
  },
  
  actions: {
    async fetchAllAssessments() {
      console.log("fetching assessments");
      const assessments = await fetchAllAssessments();

      this.allAssessments = assessments as Assessment[];
    }
  }
}); 