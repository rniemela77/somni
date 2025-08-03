<template>
  <div class="story-container">
    <!-- Generate Story Button -->
    <div v-if="!story && !loading" class="text-center mb-5">
      <div class="alert alert-info mb-4" role="alert">
        <i class="bi bi-info-circle me-2"></i>
        <strong>Ready to discover your story?</strong> We'll create a personalized tale about an animal that represents your personality and how its unique traits help overcome challenges.
      </div>
      
      <button 
        @click="generateStory" 
        class="btn btn-primary btn-lg"
        :disabled="userStore.noQuizzesCompleted"
      >
        <i class="bi bi-magic me-2"></i>
        Generate My Story
      </button>
      
      <div v-if="userStore.noQuizzesCompleted" 
           class="mt-3 text-muted">
        <small>
          <i class="bi bi-exclamation-triangle me-1"></i>
          Please complete some assessments first to create your story
        </small>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted">Creating your personalized story...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="alert alert-danger text-center" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ error }}
      <button @click="generateStory" class="btn btn-outline-danger btn-sm ms-3">
        Try Again
      </button>
    </div>

    <!-- Story Display -->
    <div v-if="story && !loading" class="story-content">
      <div class="story-card rounded-3 shadow-lg p-4 p-md-5 bg-white">
        <div class="story-header-section text-center mb-4">
          <div class="story-icon mb-3">
            <i class="bi bi-book-heart display-1 text-primary"></i>
          </div>
          <h2 class="story-title fw-bold text-primary mb-2">{{ storyTitle }}</h2>
        </div>

        <div class="story-body">
          <div class="story-text" v-html="formattedStory"></div>
        </div>

        <div class="story-footer text-center mt-4 pt-4 border-top">
          <button @click="generateStory" class="btn btn-outline-primary me-2">
            <i class="bi bi-arrow-clockwise me-2"></i>
            Generate New Story
          </button>
          <button @click="shareStory" class="btn btn-outline-secondary">
            <i class="bi bi-share me-2"></i>
            Share Story
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();

// Reactive state
const loading = ref<boolean>(false);
const error = ref<string>('');

// Computed properties
const story = computed(() => userStore.currentStory);
const storyTitle = computed(() => {
  if (!story.value) return '';
  
  // Split the story into title and content
  const lines = story.value.split('\n').filter(line => line.trim());
  
  if (lines.length > 0) {
    // First line is usually the title
    return lines[0].replace(/^#+\s*/, '').trim();
  }
  
  return '';
});

const formattedStory = computed(() => {
  if (!story.value) return '';
  
  // Split the story into title and content
  const lines = story.value.split('\n').filter(line => line.trim());
  
  if (lines.length > 0) {
    // Format the rest as paragraphs
    const content = lines.slice(1).join('\n\n');
    return content.replace(/\n\n/g, '</p><p>').replace(/^\s*/, '<p>') + '</p>';
  }
  
  return story.value;
});

// Methods
async function generateStory() {
  if (!userStore.user) {
    error.value = 'Please log in to generate your story';
    return;
  }

  if (userStore.noQuizzesCompleted) {
    error.value = 'Please complete some assessments first';
    return;
  }

  loading.value = true;
  error.value = '';
  // story.value = ''; // This line is no longer needed as story is reactive

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
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate story`);
    }

    const data = await response.json();
    
    if (data.story) {
      await userStore.updateStory(data.story);
    } else {
      throw new Error('No story generated');
    }

  } catch (err) {
    console.error('Error generating story:', err);
    error.value = err instanceof Error ? err.message : 'Failed to generate story';
  } finally {
    loading.value = false;
  }
}

function shareStory() {
  if (navigator.share && story.value) {
    navigator.share({
      title: storyTitle.value || 'My Personal Story',
      text: story.value,
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
  if (story.value) {
    navigator.clipboard.writeText(story.value).then(() => {
      // You could add a toast notification here
      alert('Story copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  }
}
</script>

<style scoped>
.story-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.story-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid #e9ecef;
}

.story-icon {
  opacity: 0.8;
}

.story-title {
  font-size: 2rem;
  color: #495057;
}

.story-subtitle {
  font-style: italic;
}

.story-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #495057;
}

.story-text {
  text-align: justify;
}

.story-text p {
  margin-bottom: 1.5rem;
  text-indent: 1.5rem;
}

.story-text p:first-child {
  text-indent: 0;
  font-weight: 500;
}

.story-footer {
  border-top-color: #dee2e6;
}

@media (max-width: 768px) {
  .story-container {
    padding: 1rem 0.5rem;
  }
  
  .story-card {
    padding: 2rem 1.5rem;
  }
  
  .story-title {
    font-size: 1.5rem;
  }
  
  .story-body {
    font-size: 1rem;
  }
}
</style>