<template>
    <SectionCard title="NEXT QUEST" :subtitle="assessment.title" iconClass="bi bi-feather" border="light">
        <template #content>
            <i class="text-muted my-3">{{ assessment.description }}</i>
        </template>

        <template #button>
            <router-link class="btn btn-primary align-self-md-end"
                :to="{ name: 'assessment', params: { assessmentSlug: assessment.slug } }">
                <span>Start Quest</span>
                <i class="bi bi-arrow-right ms-2"></i>
            </router-link>
        </template>
    </SectionCard>
</template>

<script setup lang="ts">
import SectionCard from '../ui/SectionCard.vue';
import type { Assessment } from '../../../shared/types/shared';

defineProps<{ assessment: Assessment }>();
</script>

<style scoped></style>