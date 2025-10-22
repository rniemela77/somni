<template>
  <div class="py-2">
    <div>
      <Card class="text-center mb-3" padding="sm">
        You lean <span class="fw-bold text-primary">{{ Math.abs(Math.round(assessment.score)) }}%</span> towards <span class="fw-bold text-primary">{{ getDominantTraitLabel(assessment) }} ({{ getDominantTrait(assessment).name.toLowerCase() }})</span>
      </Card>

      <!-- Traits Description - Dominant trait first, then weaker trait -->
      <div class="mb-4">
        <!-- Dominant Trait -->
        <div class="mb-5">
          <div class="small fst-italic mb-2 text-primary" style="text-transform: capitalize;">
            {{ getTraitIntensityText(Math.abs(assessment.score)) }} {{
              getDominantTrait(assessment).name.toLowerCase() }}
          </div>
          <h4 class="h5 fw-bold mb-2">{{ getDominantTraitLabel(assessment) }} ({{ getDominantTrait(assessment).name }})</h4>
          <p class="text-muted">{{ getDominantTrait(assessment).description }}</p>
          
          <!-- Strength and Blindspot for dominant trait -->
          <div class="mt-4 pt-3">
            <div class="mb-3">
              <h5 class="small fw-semibold d-flex align-items-center mb-2">
                <i class="bi bi-shield-check me-1 text-primary"></i>
                Strength
              </h5>
              <p class="small text-muted mb-0">{{ getDominantTrait(assessment).strength }}</p>
            </div>
            <div>
              <h5 class="small fw-semibold d-flex align-items-center mb-2">
                <i class="bi bi-eye-slash me-1 text-primary"></i>
                Blindspot
              </h5>
              <p class="small text-muted mb-0">{{ getDominantTrait(assessment).blindspot }}</p>
            </div>
          </div>

          <!-- Keywords for dominant trait -->
          <div v-if="getDominantTrait(assessment).keywords?.length" class="mt-3">
            <h6 class="small fw-semibold mb-2 text-muted">Keywords</h6>
            <div>
              <span
                v-for="kw in (getDominantTrait(assessment).keywords || [])"
                :key="kw"
                class="badge rounded-pill bg-primary text-white me-1 mb-1"
              >{{ kw }}</span>
            </div>
          </div>
        </div>

        <!-- Weaker Trait -->
        <div class="border-top pt-4">
          <div class="small fst-italic mb-2 text-muted" style="text-transform: capitalize;">
            Less expressed: {{ getWeakerTrait(assessment).name.toLowerCase() }}
          </div>
          <h4 class="h5 fw-bold mb-2 text-muted">{{ getWeakerTrait(assessment).name }}</h4>
          <p class="text-muted">{{ getWeakerTrait(assessment).description }}</p>
          
          <!-- Strength and Blindspot for weaker trait -->
          <div class="mt-4 pt-3">
            <div class="mb-3">
              <h5 class="small fw-semibold d-flex align-items-center mb-2">
                <i class="bi bi-shield-check me-1 text-muted"></i>
                Strength
              </h5>
              <p class="small text-muted mb-0">{{ getWeakerTrait(assessment).strength }}</p>
            </div>
            <div>
              <h5 class="small fw-semibold d-flex align-items-center mb-2">
                <i class="bi bi-eye-slash me-1 text-muted"></i>
                Blindspot
              </h5>
              <p class="small text-muted mb-0">{{ getWeakerTrait(assessment).blindspot }}</p>
            </div>
          </div>

          <!-- Keywords for weaker trait -->
          <div v-if="getWeakerTrait(assessment).keywords?.length" class="mt-3">
            <h6 class="small fw-semibold mb-2 text-muted">Keywords</h6>
            <div>
              <span
                v-for="kw in (getWeakerTrait(assessment).keywords || [])"
                :key="kw"
                class="badge rounded-pill bg-primary text-white me-1 mb-1"
              >{{ kw }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Share Buttons and Action Buttons -->
      <div class="d-flex justify-content-center align-items-center gap-3 mt-4 pt-3">
        <ShareButtons :trait-label="getDominantTraitLabel(assessment)" />
        <Button @click="retakeAssessment" outline variant="primary">
          <i class="bi bi-arrow-clockwise me-1"></i>
          Retake Assessment
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssessmentProgress } from '../../composables/useAssessmentProgress';
import type { AssessmentWithScore } from '../../../shared/types/shared';
import Card from '../ui/Card.vue';
import Button from '../ui/Button.vue';
import ShareButtons from '../ui/ShareButtons.vue';

interface Props {
  assessment: AssessmentWithScore;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  retakeAssessment: [assessment: AssessmentWithScore];
}>();

const { getTraitIntensityText, getDominantTrait, getWeakerTrait, getDominantTraitLabel } = useAssessmentProgress();

const retakeAssessment = () => {
  emit('retakeAssessment', props.assessment);
};

</script>

<style scoped>
/* Minimal styling - relying on Bootstrap classes */
</style>
