<template>
    <SectionCard title="Deeper Analysis" subtitle="AI Personality Insights" iconClass="bi bi-lightbulb">
        <template #content>
            <i class="text-muted">
                Read your AI-generated insights to understand your personality and how you can improve your
                well-being.
            </i>

            <p v-if="!isUnlocked" class="unlock-message mt-3">
                Complete <b>{{ quizzesLeft }}</b> more {{ quizzesLeft === 1 ? 'assessment' : 'assessments' }} to
                unlock AI
                insights.
            </p>
        </template>

        <template #button>
            <div v-if="!isUnlocked">
                <button class="btn btn-primary" disabled>
                    <i class="bi bi-lock-fill me-2" style="font-size: 1rem;"></i>
                    <small style="font-size: 0.8rem;">Unlocks in {{ quizzesLeft }} more {{ quizzesLeft === 1 ?
                        'assessment' : 'assessments' }}</small>
                </button>
            </div>

            <div v-else>
                <router-link to="/insights" class="btn btn-primary" :disabled="!isUnlocked">
                    <span>View Insights</span>
                    <i class="bi bi-arrow-right ms-2"></i>
                </router-link>
            </div>
        </template>
    </SectionCard>
</template>

<script setup lang="ts">
import { useInsightsProgress } from '../../composables/useInsightsProgress';
import SectionCard from '../ui/SectionCard.vue';
const { isUnlocked, quizzesLeft } = useInsightsProgress();
</script>

<style scoped>
.unlock-message {
    color: var(--text-primary);
}
</style>