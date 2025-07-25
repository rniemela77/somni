<template>
    <Alert class="container" closable>
        <h1>Welcome to your Dashboard!</h1>
        
        <p>As you complete assessments, you'll get to see:

            <ul>
                <li>Your <span class="fw-bold">progress</span></li>
                <li>Your <span class="fw-bold">next assessment</span></li>
                <li>Your <span class="fw-bold">completed assessments</span></li>
            </ul>
        </p>

        <p>Once you've completed <span class="fw-bold">75% of the assessments</span>, you'll unlock <span class="fw-bold">AI insights</span>.</p>

        <p>To get started, press the "<span class="fw-bold">Start Assessment</span>" button in the section below.</p>
    </Alert>
</template>

<script setup lang="ts">
import Alert from '../ui/Alert.vue';
</script>

<style scoped>
p:last-of-type {
    /* color: var(--text-primary); */
    font-weight: 600;
}

.fw-bold {
    color: var(--text-primary);
}
</style>