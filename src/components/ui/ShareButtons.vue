<template>
  <div class="dropup">
    <Button 
      class="dropdown-toggle" 
      variant="secondary" 
      outline 
      size="sm"
      data-bs-toggle="dropdown" 
      aria-expanded="false"
    >
      <i class="bi bi-share me-1"></i>
      Share
    </Button>
    <ul class="dropdown-menu dropdown-menu-dark">
      <li>
        <a class="dropdown-item" href="#" @click.prevent="shareToTwitter">
          <i class="bi bi-twitter me-2"></i>
          Twitter
        </a>
      </li>
      <li>
        <a class="dropdown-item" href="#" @click.prevent="shareToFacebook">
          <i class="bi bi-facebook me-2"></i>
          Facebook
        </a>
      </li>
      <li>
        <a class="dropdown-item" href="#" @click.prevent="shareToTikTok">
          <i class="bi bi-tiktok me-2"></i>
          TikTok
        </a>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li>
        <a class="dropdown-item" href="#" @click.prevent="copyToClipboard">
          <i class="bi bi-clipboard me-2"></i>
          Copy
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue';

interface Props {
  traitLabel: string;
}

const props = defineProps<Props>();

const generateShareText = () => {
  return `Archetype Trait Unlocked: ${props.traitLabel}\n\nDiscover your archetype at`;
};

const shareToPlatform = (platform: string) => {
  const text = generateShareText();
  const url = encodeURIComponent('https://somni.quest/');
  const encodedText = encodeURIComponent(text);
  
  const platformUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`,
    /* Cannot share text to Instagram, instead create html canvas with the text */
    // instagram: `https://www.instagram.com/create/story/?text=${encodedText}&url=${url}`,
    tiktok: `https://www.tiktok.com/upload?text=${encodedText}&url=${url}`
  };
  
  const shareUrl = platformUrls[platform as keyof typeof platformUrls];
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=550,height=420');
  }
};

const shareToTwitter = () => shareToPlatform('twitter');
const shareToFacebook = () => shareToPlatform('facebook');
const shareToTikTok = () => shareToPlatform('tiktok');

const copyToClipboard = async () => {
  const text = generateShareText();
  try {
    await navigator.clipboard.writeText(text);
    alert('Share text copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy text: ', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alert('Share text copied to clipboard!');
    } catch (fallbackErr) {
      console.error('Fallback copy failed: ', fallbackErr);
      alert('Unable to copy to clipboard');
    }
    document.body.removeChild(textArea);
  }
};
</script>

<style scoped>
.dropdown-toggle::after {
  margin-left: 0.5em;
}

.dropup .dropdown-menu {
  bottom: 100%;
  top: auto;
  margin-bottom: 0.125rem;
}
</style>
