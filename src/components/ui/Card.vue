<template>
    <div class="card h-100 border-0" :class="cardClasses" >
        <div :class="paddingClasses">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    shadow: {
        type: String,
        default: 'light',
        validator: (v: string) => ['dark', 'light', 'none'].includes(v)
    },
    padding: {
        type: String,
        default: 'md',
        validator: (v: string) => ['sm', 'md', 'lg', 'xl', '0'].includes(v)
    },
    bgOpacity: {
        type: String,
        default: 'low',
        validator: (v: string) => ['low', 'full'].includes(v)
    }
});

const paddingClasses = computed(() => ({
    'p-2 p-sm-3 p-xl-4': props.padding === 'sm',
    'p-3 p-sm-4 p-xl-5': props.padding === 'md',
    'p-4 p-sm-5 p-xl-6': props.padding === 'lg',
    'p-5 p-sm-6 p-xl-7': props.padding === 'xl',
    'p-0': props.padding === '0'
}));

const cardClasses = computed(() => ({
    // shadow
    'shadow-light': props.shadow === 'light',
    'shadow-dark': props.shadow === 'dark',
    'shadow-none': props.shadow === 'none',
    // bg opacity
    'bg-opacity-low': props.bgOpacity === 'low',
    'bg-opacity-full': props.bgOpacity === 'full'
}));
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}
.bg-opacity-low {
    background-color: var(--card-bg-color) !important;
}
.bg-opacity-full {
    background-color: var(--card-bg-color-full-opacity) !important;
}
.shadow-light {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
.shadow-dark {
    box-shadow: 0 3px 10px rgba(0,0,0,0.2) !important;
}
.shadow-none {
    box-shadow: none !important;
}
</style>