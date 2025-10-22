<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <div class="text-center">
          <h1 class="text-cinzel">Contact</h1>
        </div>

        <div class="text-center">
          <p class="text-muted mb-4">
            Questions or feedback? We'd love to hear from you.
          </p>
          <a href="mailto:rvniemela@hotmail.com" class="btn btn-primary btn-lg">
            <i class="bi bi-envelope me-2"></i>
            rvniemela@hotmail.com
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from "../ui/Card.vue";
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.btn {
  transition: all 0.2s ease-in-out;
}

.display-4 {
  color: var(--text-primary);
}

h3 {
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .display-4 {
    font-size: 2.5rem;
  }

  .contact-icon {
    height: 60px;
  }

  .contact-icon i {
    font-size: 2.5rem !important;
  }
}
</style>
