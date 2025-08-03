<template>
    <div>
        <!-- Generate Narrative Button -->
        <div v-if="!narrative && !loading" class="mb-5">
            <div class="alert alert-info" role="alert">
                <p class="mb-0">Generate a personalized narrative about an animal that represents your personality and
                    how its unique traits help overcome challenges.</p>
            </div>

            <div class="mb-3 d-flex align-items-center">
                <span class="fw-bold">AI Analysis Requests:</span>

                <small class="text-muted ms-2">
                    {{ apiCallsDescription }}
                </small>
            </div>

            <button v-if="userStore.openaiApiCallsRemaining > 0" @click="generateNarrative" 
                class="btn btn-primary btn-lg" :disabled="buttonDisabled">
                {{ generateButtonText }}
            </button>

            <!-- Upgrade prompt when limit reached -->
            <div v-if="userStore.openaiApiCallsRemaining <= 0 && !userStore.isPaid" class="mt-3">
                <router-link to="/account" class="btn btn-outline-primary">
                    <i class="bi bi-arrow-up-circle me-2"></i>
                    Upgrade to Premium ({{ API_LIMITS.PAID_OPENAI_CALLS_LIMIT }} Requests)
                </router-link>
            </div>

            <div v-if="userStore.noQuizzesCompleted" class="mt-3 text-muted">
                <small>
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    Please complete some assessments first to create your narrative
                </small>
            </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="alert alert-danger text-center" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
            <button @click="generateNarrative" class="btn btn-outline-danger btn-sm ms-3">
                Try Again
            </button>
        </div>

        <!-- Narrative Display Container - Always Show -->
        <div class="narrative-content">
            <div class="narrative-card rounded-3 shadow-lg p-4 p-md-5 bg-white">
                <!-- Loading State -->
                <div v-if="loading" class="text-center">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted">Crafting a personalized narrative...</p>
                </div>

                <!-- Narrative Content -->
                <div v-else-if="narrative">
                    <div class="narrative-header-section text-center mb-4">
                        <div class="narrative-icon mb-3">
                            <i class="bi bi-book-heart display-1 text-primary"></i>
                        </div>
                        <h2 class="narrative-title fw-bold text-primary mb-2">{{ narrativeTitle }}</h2>
                    </div>

                    <div class="narrative-body">
                        <div class="narrative-text" v-html="formattedNarrative"></div>
                    </div>

                    <div class="narrative-footer text-center mt-4 pt-4 border-top">
                        <button @click="generateNarrative" class="btn btn-outline-primary me-2" :disabled="buttonDisabled">
                            <i class="bi bi-arrow-clockwise me-2"></i>
                            Generate New Narrative
                        </button>
                        <button @click="shareNarrative" class="btn btn-outline-secondary">
                            <i class="bi bi-share me-2"></i>
                            Share Narrative
                        </button>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center">
                    <div class="narrative-icon mb-3">
                        <i class="bi bi-book-heart display-1 text-muted"></i>
                    </div>
                    <h3 class="text-muted mb-3">No Narrative Yet</h3>
                    <p class="text-muted mb-4">Generate your personalized narrative to see it displayed here.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../../stores/user';
import { API_LIMITS } from '../../config/limits';

// Props
interface Props {
  apiCallsDescription: string;
  generateButtonText: string;
  isUnlocked: boolean;
  quizzesLeft: number;
}

const props = defineProps<Props>();

const userStore = useUserStore();

// Reactive state
const loading = ref<boolean>(false);
const error = ref<string>('');

// Computed properties
const narrative = computed(() => userStore.currentStory);
const narrativeTitle = computed(() => {
    if (!narrative.value) return '';

    // Split the narrative into title and content
    const lines = narrative.value.split('\n').filter(line => line.trim());

    if (lines.length > 0) {
        // First line is usually the title
        return lines[0].replace(/^#+\s*/, '').trim();
    }

    return '';
});

const formattedNarrative = computed(() => {
    if (!narrative.value) return '';

    // Split the narrative into title and content
    const lines = narrative.value.split('\n').filter(line => line.trim());

    if (lines.length > 0) {
        // Format the rest as paragraphs
        const content = lines.slice(1).join('\n\n');
        return content.replace(/\n\n/g, '</p><p>').replace(/^\s*/, '<p>') + '</p>';
    }

    return narrative.value;
});

const buttonDisabled = computed(() =>
  loading.value ||
  userStore.noQuizzesCompleted ||
  !props.isUnlocked ||
  (userStore.openaiApiCallsRemaining <= 0 && !userStore.isPaid)
);

// Methods
async function generateNarrative() {
    if (!userStore.user) {
        error.value = 'Please log in to generate your narrative';
        return;
    }

    if (userStore.noQuizzesCompleted) {
        error.value = 'Please complete some assessments first';
        return;
    }

    loading.value = true;
    error.value = '';

    try {
        // Get the current user's auth token
        const currentUser = userStore.user;
        const idToken = await currentUser.getIdToken();

        // Call the backend function
        const response = await fetch('/.netlify/functions/generate-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate narrative`);
        }

        const data = await response.json();

        if (data.story) {
            await userStore.updateStory(data.story);
        } else {
            throw new Error('No narrative generated');
        }

    } catch (err) {
        console.error('Error generating narrative:', err);
        error.value = err instanceof Error ? err.message : 'Failed to generate narrative';
    } finally {
        loading.value = false;
    }
}

function shareNarrative() {
    if (navigator.share && narrative.value) {
        navigator.share({
            title: narrativeTitle.value || 'My Personal Narrative',
            text: narrative.value,
            url: window.location.href
        }).catch(err => {
            console.error('Error sharing:', err);
            // Fallback to copying to clipboard
            copyToClipboard();
        });
    } else {
        copyToClipboard();
    }
}

function copyToClipboard() {
    if (narrative.value) {
        navigator.clipboard.writeText(narrative.value).then(() => {
            // You could add a toast notification here
            alert('Narrative copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
        });
    }
}
</script>

<style scoped>
.narrative-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.narrative-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid #e9ecef;
}

.narrative-icon {
    opacity: 0.8;
}

.narrative-title {
    font-size: 2rem;
    color: #495057;
}

.narrative-subtitle {
    font-style: italic;
}

.narrative-body {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #495057;
}

.narrative-text {
    text-align: justify;
}

.narrative-text p {
    margin-bottom: 1.5rem;
    text-indent: 1.5rem;
}

.narrative-text p:first-child {
    text-indent: 0;
    font-weight: 500;
}

.narrative-footer {
    border-top-color: #dee2e6;
}

@media (max-width: 768px) {
    .narrative-container {
        padding: 1rem 0.5rem;
    }

    .narrative-card {
        padding: 2rem 1.5rem;
    }

    .narrative-title {
        font-size: 1.5rem;
    }

    .narrative-body {
        font-size: 1rem;
    }
}
</style>