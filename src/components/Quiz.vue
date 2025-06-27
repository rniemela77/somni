<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import { useQuizStore } from '../stores/quiz';

export default {
    name: 'Quiz',
    setup() {
        const quizStore = useQuizStore();

        onMounted(async () => {
            await quizStore.loadQuizzes();
        });

        return {};
    }
};
</script>

<style scoped>
.fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
