<template>
    <Alert class="container" closable>
        <h1>Welcome to Somni!</h1>

        <p>Somni is a journey of self-discovery. It's a quest to understand yourself better, and to become the best version of yourself.</p>

        <p>As you complete quests (personality quizzes), on this page you will see:</p>

        <ul>
            <li>Your <span class="fw-bold">progress</span></li>
            <li>Your <span class="fw-bold">next quest</span></li>
            <li>Your <span class="fw-bold">completed quest results</span></li>
        </ul>

        <p>As you complete quests, you'll unlock <span class="fw-bold">Revelations</span>, where you can read an extended AI-driven analysis of your personality.</p>

        <p>To get started, take your first quest by pressing the <span class="fw-bold">Start Quest</span> button below.</p>

        <strong>Have fun!</strong>
    </Alert>
</template>

<script setup lang="ts">
import Alert from '../ui/Alert.vue';
</script>

<style scoped>
.fw-bold {
    color: var(--text-primary);
}
</style>