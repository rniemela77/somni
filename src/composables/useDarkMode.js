import { ref, watchEffect } from 'vue';

const isDark = ref(true); // Default to dark mode

export function useDarkMode() {
  // Load preference from localStorage or default to dark mode
  if (localStorage.getItem('darkMode') !== null) {
    isDark.value = localStorage.getItem('darkMode') === 'true';
  } else {
    // Default to dark mode instead of following system preference
    isDark.value = true;
  }

  watchEffect(() => {
    if (isDark.value) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark.value.toString());
  });

  return { isDark };
} 