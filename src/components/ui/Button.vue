<template>
  <component
    :is="componentType"
    v-bind="mergedAttrs"
    :class="buttonClasses"
    @click="onClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import type { RouteLocationRaw } from "vue-router";

type ButtonVariant = "primary" | "secondary" | "text";
type ButtonSize = "sm" | "md" | "lg";

const props = withDefaults(defineProps<{
  variant?: ButtonVariant;
  outline?: boolean;
  size?: ButtonSize;
  block?: boolean;
  unstyled?: boolean;
  to?: RouteLocationRaw | null;
  href?: string | null;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
}>(), {
  variant: "primary",
  outline: false,
  size: "md",
  block: false,
  unstyled: false,
  to: null,
  href: null,
  type: "button",
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const isRouterLink = computed(() => !!props.to);
const isAnchor = computed(() => !!props.href && !props.to);
const isNativeButton = computed(() => !props.to && !props.href);

const componentType = computed(() => {
  if (isRouterLink.value) return "router-link";
  if (isAnchor.value) return "a";
  return "button";
});

const variantClass = computed(() => {
  if (props.unstyled) return [];
  if (props.variant === "text") {
    return ["btn", "text-primary"]; // matches existing usage of "btn text-primary"
  }
  const base = props.outline ? `btn-outline-${props.variant}` : `btn-${props.variant}`;
  return ["btn", base];
});

const sizeClass = computed(() => {
  if (props.size === "sm") return "btn-sm";
  if (props.size === "lg") return "btn-lg";
  return null;
});

const blockClass = computed(() => (props.block ? "w-100" : null));

const disabledClass = computed(() => ((isAnchor.value || isRouterLink.value) && (props.disabled || props.loading)) ? "disabled" : null);

const buttonClasses = computed(() => [
  ...variantClass.value,
  sizeClass.value,
  blockClass.value,
  disabledClass.value,
]);

const componentAttrs = computed(() => {
  const common: Record<string, unknown> = {};
  if (isNativeButton.value) {
    common.type = props.type;
    common.disabled = props.disabled || props.loading;
  } else if (isAnchor.value) {
    common.href = props.href as string;
    // Only add role="button" when styled as a button
    if (!props.unstyled) {
      common.role = "button";
    }
    if (props.disabled || props.loading) {
      common.tabindex = -1;
      common["aria-disabled"] = "true";
    }
  } else if (isRouterLink.value) {
    common.to = props.to as RouteLocationRaw;
    if (props.disabled || props.loading) {
      common.tabindex = -1;
      common["aria-disabled"] = "true";
    }
  }
  return common;
});

const attrs = useAttrs();
const mergedAttrs = computed(() => ({
  ...attrs,
  ...componentAttrs.value,
}));

function onClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  emit("click", event);
}
</script>

<style scoped>
/* Inherit Bootstrap button styles via classes computed above */
</style>


