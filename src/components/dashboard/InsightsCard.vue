<template>
  <SectionCard
    title="MYTHBOOK"
    subtitle="Mythic Profile"
    iconClass="bi bi-journal-bookmark-fill"
    border="light"
  >
    <template #content>
      <i class="text-muted">
        Explore the insights generated from your profile, including both your unlocked revelations and the ones still to come.
      </i>
    </template>

    <template #button>
      <Button
        :to="'/mythbook'"
        outline variant="primary"
      >
        <span>Open Mythbook</span>
        <i class="bi bi-arrow-right ms-2"></i>
      </Button>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
import SectionCard from "../ui/SectionCard.vue";
import Button from "../ui/Button.vue";
</script>

<style scoped>
.unlock-message {
  color: var(--text-primary);
}
</style>
