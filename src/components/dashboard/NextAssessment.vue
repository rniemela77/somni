<template>
    <SectionCard title="Next Assessment" :subtitle="scale.title" iconClass="bi bi-pencil-square">
        <template #content>
            <i class="text-muted my-3">{{ scale.description }}</i>
        </template>

        <template #button>
            <router-link class="btn btn-primary align-self-md-end"
                :to="{ name: 'assessment', params: { scaleId: scale.id } }">
                <span>Start Assessment</span>
                <i class="bi bi-arrow-right ms-2"></i>
            </router-link>
        </template>
    </SectionCard>
</template>

<script setup lang="ts">
import SectionCard from '../ui/SectionCard.vue';
import { useUserStore } from '../../stores/user';

const props = defineProps<{ scale: ExtendedPersonalityScale }>();
</script>

<style scoped>

</style>