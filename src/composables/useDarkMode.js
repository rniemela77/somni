import { ref, watchEffect } from 'vue';

const isDark = ref(true);

export function useDarkMode() {
  watchEffect(() => {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    localStorage.setItem('darkMode', 'true');
  });

  return { isDark };
} 