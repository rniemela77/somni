<template>
    <Card>
        <div class="d-flex gap-4 flex-column justify-content-between h-100">
            <div class="flex-grow-1 gap-2 d-flex flex-column">
                <div class="d-flex gap-3 align-items-center">
                    <i class="card-icon" :class="iconClass"></i>
                    <h2 class="mb-0 text-cinzel">{{ title }}</h2>
                </div>
                <h3 v-if="subtitle">{{ subtitle }}</h3>

                <div class="section-card-content">
                    <slot name="content" />
                </div>
            </div>

            <div v-if="$slots.button" class="d-flex align-items-stretch flex-column section-card-button">
                <slot name="button" />
            </div>
        </div>
    </card>
</template>

<script setup lang="ts">
import Card from '../ui/Card.vue';

const props = defineProps<{
    title: string;
    subtitle?: string;
    iconClass: string;
}>();
</script>

<style scoped>
.card-icon {
    font-size: 2rem;
    color: var(--text-primary);
}

:deep(.section-card-button .btn) {
    padding: clamp(1rem, 2vw, 1.5rem);
    font-size: 1rem;
    font-weight: 700;
    width: 100%;
}
.section-card-button {
    /* flex: 0 0 34%; */
}

h2 {
    font-size: 14px;
}

h3 {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}
</style>