import { ref, watchEffect } from 'vue';

const isDark = ref(false);

export function useDarkMode() {
  // Load preference from localStorage or system
  if (localStorage.getItem('darkMode') !== null) {
    isDark.value = localStorage.getItem('darkMode') === 'true';
  } else {
    isDark.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  watchEffect(() => {
    if (isDark.value) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark.value);
  });

  return { isDark };
} 