<template>
  <div class="container py-4">
    <div class="row justify-content-center col-sm-8 offset-sm-2 flex-1">
      <div class="text-center mb-4">
        <h1 class="display-4 text-cinzel mb-3">Mythic Mirror</h1>
        <p class="lead text-muted">
          Share a challenge and discover how your personality traits can guide
          you.
        </p>
      </div>

      <Card class="mb-4" shadow="light" padding="lg" border="light">
        <h3 class="mb-4">
          <i class="bi bi-mirror me-2"></i>Share Your Challenge
        </h3>
        <textarea
          v-model="challengeText"
          class="form-control mb-3"
          rows="3"
          placeholder="What challenge are you facing?"
          :disabled="isGenerating"
        ></textarea>
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-muted small">{{ challengeText.length }}/500</div>
          <button
            @click="submitChallenge"
            class="btn btn-primary"
            :disabled="
              !challengeText.trim() ||
              challengeText.length > 500 ||
              isGenerating
            "
          >
            <span
              v-if="isGenerating"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            <i v-else class="bi bi-magic me-2"></i>
            {{ isGenerating ? "Generating..." : "Seek Guidance" }}
          </button>
        </div>
      </Card>
    </div>

    <Alert v-if="error" type="danger" class="mb-4">{{ error }}</Alert>

    <!--  -->
    <div class="row" v-if="mythicMirrorHistory.length > 0 || currentResponse">
      <div class="col-lg-4 col-md-5 mb-4" v-if="mythicMirrorHistory.length > 0">
        <Card class="h-100" shadow="light" padding="sm" border="medium">
          <h5 class="mb-4">
            <i class="bi bi-clock-history me-2"></i>Your Journey
          </h5>
          <div class="challenge-sidebar">
            <Card
              v-for="(entry, index) in mythicMirrorHistory"
              :key="index"
              class="challenge-item"
              :class="{ active: selectedChallengeIndex === index }"
              @click="selectChallenge(index)"
              shadow="none"
              padding="sm"
              :border="selectedChallengeIndex === index ? 'medium' : 'light'"
              :bg-opacity="selectedChallengeIndex === index ? 'full' : 'low'"
            >
              <div class="challenge-preview">{{ entry.challenge }}</div>
              <div class="challenge-date">
                {{ formatDate(entry.createdAt) }}
              </div>
            </Card>
          </div>
        </Card>
      </div>

      <div
        :class="mythicMirrorHistory.length > 0 ? 'col-lg-8 col-md-7' : 'col-12'"
      >
        <Card
          v-if="currentResponse || selectedChallenge"
          class="mb-4"
          shadow="dark"
          padding="lg"
          border="medium"
          bg-opacity="full"
        >
          <h3 class="mb-4">
            <i class="bi bi-stars me-2"></i>Your Mythic Guidance
          </h3>
          <h4 class="mythic-title">{{ displayResponse.title }}</h4>
          <div class="mythic-details">{{ displayResponse.details }}</div>
        </Card>

        <Card
          v-else-if="!isGenerating"
          shadow="none"
          padding="xl"
          border="light"
        >
          <div class="text-center py-5">
            <i class="bi bi-mirror display-1 text-muted mb-3"></i>
            <h4 class="text-muted">Begin Your Journey</h4>
            <p class="text-muted">
              Share your first challenge above to receive personalized guidance.
            </p>
          </div>
        </Card>
      </div>
    </div>

    <Card
      v-if="!mythicMirrorHistory.length && !currentResponse && !isGenerating"
      shadow="none"
      padding="xl"
      border="light"
    >
      <div class="text-center py-5">
        <i class="bi bi-mirror display-1 text-muted mb-3"></i>
        <h4 class="text-muted">Begin Your Journey</h4>
        <p class="text-muted">
          Share your first challenge above to receive personalized guidance.
        </p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../../stores/user";
import Card from "../ui/Card.vue";
import Alert from "../ui/Alert.vue";

const userStore = useUserStore();

const challengeText = ref("");
const isGenerating = ref(false);
const error = ref("");
const currentResponse = ref<{ title: string; details: string } | null>(null);
const selectedChallengeIndex = ref<number | null>(null);

const mythicMirrorHistory = computed(() => userStore.user?.mythicMirror || []);

const selectedChallenge = computed(() =>
  selectedChallengeIndex.value !== null
    ? mythicMirrorHistory.value[selectedChallengeIndex.value]
    : null
);

const displayResponse = computed(
  () =>
    currentResponse.value ||
    selectedChallenge.value?.response || { title: "", details: "" }
);

const submitChallenge = async () => {
  if (!challengeText.value.trim()) return;

  error.value = "";
  isGenerating.value = true;
  currentResponse.value = null;

  try {
    const result = await userStore.generateMythicMirrorAnalysis(
      challengeText.value.trim()
    );

    if (result.success && result.response) {
      currentResponse.value = result.response;
      challengeText.value = "";
      selectedChallengeIndex.value = null;
    } else {
      error.value = result.error || "Failed to generate mythic guidance";
    }
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "An unexpected error occurred";
  } finally {
    isGenerating.value = false;
  }
};

const selectChallenge = (index: number) => {
  selectedChallengeIndex.value = index;
  currentResponse.value = null;
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return "Unknown date";

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Unknown date";
  }
};

onMounted(() => {
  if (
    !userStore.user?.assessmentScores ||
    Object.keys(userStore.user.assessmentScores).length === 0
  ) {
    error.value =
      "Please complete at least one personality assessment before using the Mythic Mirror.";
  }
});
</script>

<style scoped>
.mythic-title {
  color: var(--primary-color);
  font-family: "Cinzel", serif;
  font-weight: 600;
  margin-bottom: 1rem;
}

.mythic-details {
  line-height: 1.6;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.challenge-sidebar {
  max-height: 60vh;
  overflow-y: auto;
}

.challenge-item {
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.challenge-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.challenge-item.active {
  color: white;
}

.challenge-item.active .challenge-date {
  color: rgba(255, 255, 255, 0.8);
}

.challenge-preview {
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.challenge-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.col-lg-4:has(.challenge-sidebar) {
  border-right: 2px solid var(--border-color);
  padding-right: 1.5rem;
}

.col-lg-8:has(.mythic-response) {
  padding-left: 1.5rem;
}

@media (max-width: 991.98px) {
  .challenge-sidebar {
    max-height: 40vh;
  }

  .col-lg-4:has(.challenge-sidebar),
  .col-lg-8:has(.mythic-response) {
    border-right: none;
    padding-right: 0;
    padding-left: 0;
  }
}
</style>
