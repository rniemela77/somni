<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h4 class="mb-0 progress-title text-muted">Progress</h4>
      <span class="progress-fraction-container"
        ><span class="progress-fraction">
          <span class="progress-fraction-number"
            >{{ completedAssessments }}
            /
            {{ totalAssessments }}</span
          >
        </span>
        <span class="ms-2 text-muted">Completed</span>
      </span>
    </div>

    <div
      class="segmented-progress"
      role="progressbar"
      :aria-valuenow="completedAssessments"
      :aria-valuemin="0"
      :aria-valuemax="totalAssessments"
    >
      <div
        v-for="index in segments.length"
        :key="index - 1"
        class="segment"
        :class="{
          completed: index - 1 < completedAssessments,
          upcoming: index - 1 >= completedAssessments,
        }"
        :aria-label="`Assessment ${index}`"
      >
        <div class="segment-fill"></div>

        <div
          v-if="
            segmentRevelations[index - 1] &&
            segmentRevelations[index - 1].length
          "
          class="revelation-icons"
        >
          <template
            v-for="rev in segmentRevelations[index - 1]"
            :key="rev.slug"
          >
            <router-link
              v-if="rev.completed"
              :to="{ name: 'revelation', params: { revelationSlug: rev.slug } }"
              class="revelation-icon-link"
            >
              <span
                class="revelation-badge"
                :class="{ completed: rev.completed, upcoming: !rev.completed }"
              >
                <i
                  :class="
                    rev.completed ? 'bi bi-check' : 'bi bi-question'
                  "
                ></i>
              </span>
            </router-link>
            <span v-else class="revelation-icon-hitbox">
              <span
                class="revelation-badge"
                :class="{ completed: rev.completed, upcoming: !rev.completed }"
              >
                <i
                  :class="
                    rev.completed ? 'bi bi-exclamation' : 'bi bi-question'
                  "
                ></i>
              </span>
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { REVELATION_MILESTONES } from "../../../shared/config/personalityAnalysis";

// props
const props = defineProps({
  completedAssessments: {
    type: Number,
    default: 0,
    required: true,
  },
  totalAssessments: {
    type: Number,
    default: 0,
    required: true,
  },
});

// build an array representing each assessment segment
const segments = computed(() => {
  const count = Math.max(0, props.totalAssessments || 0);
  return Array.from({ length: count }, (_, i) => i);
});

// group revelations by the segment index that unlocks them
const segmentRevelations = computed<
  Record<
    number,
    Array<{
      slug: string;
      icon: string;
      color: string;
      background: string;
      completed: boolean;
    }>
  >
>(() => {
  const map: Record<
    number,
    Array<{
      slug: string;
      icon: string;
      color: string;
      background: string;
      completed: boolean;
    }>
  > = {};
  REVELATION_MILESTONES.forEach((revelation) => {
    const required = revelation.requiredAssessments || 0;
    const segmentIndex = Math.max(0, required - 1);
    const isCompleted = props.completedAssessments >= required;
    const entry = {
      background: isCompleted ? "var(--body-bg-color)" : "transparent",
      color: isCompleted ? "var(--text-muted)" : "var(--primary-color)",
      icon: isCompleted
        ? "bi bi-exclamation-circle-fill"
        : "bi bi-question-circle",
      slug: revelation.slug,
      completed: isCompleted,
    };
    if (!map[segmentIndex]) map[segmentIndex] = [];
    map[segmentIndex].push(entry);
  });
  return map;
});
</script>

<style scoped>
.progress-title,
.progress-fraction-container {
  font-size: 14px;
}

.segmented-progress {
  max-width: 100%;
}

.segmented-progress {
  display: flex;
  gap: 0.5px;
  position: relative;
  overflow: visible;
}

.segment {
  position: relative;
  flex: 1 1 0;
  height: 15px;
  background: var(--card-bg-color);
  border: 1px solid rgba(0,0,0, 0.1);
}

.segment:first-child {
  border-top-left-radius: 5px !important;
  border-bottom-left-radius: 5px !important;
}

.segment:last-child {
  border-top-right-radius: 5px !important;
  border-bottom-right-radius: 5px !important;
}

.segment.completed {
  background: var(--primary-color);
}

.segment.upcoming {
  background: var(--card-bg-color);
}

.segment .segment-fill {
  width: 100%;
  height: 100%;
}

.progress-fraction {
  color: var(--text-primary) !important;
  letter-spacing: 0.1rem;
}

.revelation-icons {
  position: absolute;
  top: 50%;
  left: 50%;
  right: auto;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  width: 64px;
  z-index: 1;
}

.revelation-icon-link,
.revelation-icon-hitbox {
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.revelation-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.revelation-badge.completed {
  border-color: #ffffff;
}

.revelation-badge i {
  font-size: 16px;
  line-height: 1;
}

.revelation-badge.completed i {
  color: #ffffff;
}

.revelation-badge.upcoming i {
  color: var(--primary-color);
}

.revelation-icon-link {
  transition: transform 0.2s ease-in-out;
}

.revelation-icon-link:hover,
.revelation-icon-link:active,
.revelation-icon-link:focus {
  transform: scale(1.25);
}
</style>
