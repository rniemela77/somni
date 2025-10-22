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
              <span class="revelation-badge completed">
                <i class="bi bi-check"></i>
              </span>
            </router-link>
            <span v-else class="revelation-icon-hitbox">
              <span 
                class="revelation-badge upcoming tooltip-trigger"
                data-tooltip="Your story awaits..."
              >
                <i class="bi bi-question"></i>
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

interface ProgressBarProps {
  completedAssessments: number;
  totalAssessments: number;
}

interface RevelationData {
  slug: string;
  completed: boolean;
}

const props = withDefaults(defineProps<ProgressBarProps>(), {
  completedAssessments: 0,
  totalAssessments: 0,
});

/**
 * Creates an array of segment indices for the progress bar
 * Each segment represents one assessment
 */
const segments = computed(() => {
  const count = Math.max(0, props.totalAssessments);
  return Array.from({ length: count }, (_, i) => i);
});

/**
 * Groups revelations by the assessment segment that unlocks them
 * Returns a map where key is segment index (0-based) and value is array of revelations
 */
const segmentRevelations = computed<Record<number, RevelationData[]>>(() => {
  const map: Record<number, RevelationData[]> = {};
  
  REVELATION_MILESTONES.forEach((revelation) => {
    const requiredAssessments = revelation.requiredAssessments || 0;
    const segmentIndex = Math.max(0, requiredAssessments - 1); // Convert to 0-based index
    const isCompleted = props.completedAssessments >= requiredAssessments;
    
    const revelationData: RevelationData = {
      slug: revelation.slug,
      completed: isCompleted,
    };
    
    if (!map[segmentIndex]) {
      map[segmentIndex] = [];
    }
    map[segmentIndex].push(revelationData);
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
  border: 1px solid rgba(0,0,0, 0.5);
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
  background: rgba(0,0,0,0.3);
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

/* Custom tooltip styles */
.tooltip-trigger {
  position: relative;
}

.tooltip-trigger::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 1000;
  margin-bottom: 5px;
  pointer-events: none;
}

.tooltip-trigger::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 1000;
  margin-bottom: 1px;
  pointer-events: none;
}

.tooltip-trigger:hover::before,
.tooltip-trigger:hover::after {
  opacity: 1;
  visibility: visible;
}
</style>
