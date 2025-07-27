<template>
  <div class="personality-analysis-list">
    <PersonalityAnalysisSection
      v-for="section in sortedSections"
      :key="section.id"
      :title="section.title"
      :icon="section.icon"
      :name="getAnalysisName(section.id)"
      :description="getAnalysisDescription(section.id)"
      :key-insights="getAnalysisKeyInsights(section.id)"
      :quote-maxim="getAnalysisQuoteMaxim(section.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PERSONALITY_ANALYSIS_SECTIONS } from '../../config/personalityAnalysis';
import PersonalityAnalysisSection from './PersonalityAnalysisSection.vue';
import { AnalysisData, PersonalityAnalysis } from '../../types/personality';

interface Props {
  personalityAnalysis: PersonalityAnalysis;
}

const props = defineProps<Props>();

const sortedSections = computed(() => {
  return Object.values(PERSONALITY_ANALYSIS_SECTIONS)
    .sort((a, b) => a.display.order - b.display.order);
});

// Helper functions to extract individual fields
const getAnalysisName = (sectionId: string): string | undefined => {
  const data = props.personalityAnalysis[sectionId];
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return (data as AnalysisData).name;
  }
  return undefined;
};

const getAnalysisDescription = (sectionId: string): string | undefined => {
  const data = props.personalityAnalysis[sectionId];
  if (typeof data === 'object' && data !== null && 'description' in data) {
    return (data as AnalysisData).description;
  }
  return undefined;
};

const getAnalysisKeyInsights = (sectionId: string): string | undefined => {
  const data = props.personalityAnalysis[sectionId];
  if (typeof data === 'object' && data !== null && 'keyInsights' in data) {
    return (data as AnalysisData).keyInsights;
  }
  return undefined;
};

const getAnalysisQuoteMaxim = (sectionId: string): string | undefined => {
  const data = props.personalityAnalysis[sectionId];
  if (typeof data === 'object' && data !== null && 'quoteMaxim' in data) {
    return (data as AnalysisData).quoteMaxim;
  }
  return undefined;
};
</script> 