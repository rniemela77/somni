<template>
    <Teleport to="body">
        <div v-if="isOpen">
            <!-- Modal backdrop -->
            <div class="modal-backdrop" @click="closeModal"></div>
            
            <!-- Modal content -->
            <div class="modal-container">
                <Card class="modal-content h-auto" padding="0" bg-opacity="full">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <slot name="title" />
                        </h5>
                        <button type="button" class="close-btn" @click="closeModal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <slot name="body" />
                    </div>
                    <div class="modal-footer">
                        <slot name="footer" />
                    </div>
                </Card>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from './ui/Card.vue';

const isOpen = ref(true);

const closeModal = () => {
    isOpen.value = false;
};
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1040;
}

.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    z-index: 1050;
    pointer-events: none;
    padding: 2rem 0;
}

.modal-container .modal-content {
    max-width: 900px;
    width: 95%;
    margin: 0 auto;
    pointer-events: all;
    overflow:hidden;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--card-inset-bg-color);
    background-color: var(--card-bg-color);
}

.modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
    padding: 1rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    line-height: 1;
    opacity: 0.5;
    cursor: pointer;
    padding: 0.5rem;
    min-width: 64px;
    min-height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
    color: var(--body-text-color);
}

.close-btn:hover {
    opacity: 0.75;
    background-color: var(--card-inset-bg-color);
}

.close-btn:active {
    transform: scale(0.95);
}

.modal-body {
    padding: 1rem;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid var(--card-inset-bg-color);
    background-color: var(--card-bg-color);
}

/* Make close button even bigger on mobile */
@media (max-width: 768px) {
    .close-btn {
        min-width: 64px;
        min-height: 64px;
        font-size: 2.5rem;
    }
}
</style>