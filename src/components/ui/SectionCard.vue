<template>
    <Card>
        <div class="d-flex gap-4 flex-column flex-md-row">
            <div class="flex-grow-1 gap-2 d-flex flex-column">
                <div class="d-flex gap-4">
                    <i class="card-icon align-self-center" :class="iconClass"></i>
                    <div class="d-flex flex-column">
                        <h2>{{ title }}</h2>
                        <h3>{{ subtitle }}</h3>
                    </div>
                </div>

                <div class="section-card-content" :style="{ maxWidth: $slots.button ? '33rem' : '100%' }">
                    <slot name="content" />
                </div>
            </div>

            <div v-if="$slots.button" class="d-flex align-items-stretch flex-column align-self-md-end section-card-button">
                <slot name="button" />
            </div>
        </div>
    </card>
</template>

<script setup lang="ts">
import Card from '../ui/Card.vue';

const props = defineProps<{
    title: string;
    subtitle: string;
    iconClass: string;
}>();
</script>

<style scoped>
.card-icon {
    font-size: 3rem;
    color: var(--text-primary);
}

:deep(.section-card-button .btn) {
    padding: clamp(1rem, 2vw, 2rem);
    font-size: 1.2rem;
    font-weight: 700;
    width: 100%;
}
.section-card-button {
    flex: 0 0 34%;
}

h3 {
    color: var(--text-primary);
}

.section-card-content {
    max-width: 33rem;
}
</style>