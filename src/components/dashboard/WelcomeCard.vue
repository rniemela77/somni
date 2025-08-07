<template>
    <Alert class="container" closable>
        <h1>Welcome to Somni!</h1>

        <p>As you complete assessments, on this page you will see:</p>

        <ul>
            <li>Your <span class="fw-bold">progress</span></li>
            <li>Your <span class="fw-bold">next assessment</span></li>
            <li>Your <span class="fw-bold">completed assessments</span></li>
        </ul>

        <p>Once you've completed <span class="fw-bold">75% of the assessments</span>, you'll unlock <span
                class="fw-bold">AI insights</span>, where you can read an extended AI-driven analysis of your personality.</p>

        <p>To get started, take your first assessment by pressing the "<span class="fw-bold">Start Assessment</span>" button in the section below.</p>

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