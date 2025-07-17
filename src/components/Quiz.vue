<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Quiz'
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
