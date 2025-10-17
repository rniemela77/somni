<template>
  <div class="beam-animation-container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// No props needed - this is a pure animation wrapper
</script>

<style scoped>
.beam-animation-container {
  position: relative;
  overflow: hidden;
  --reveal-progress: 0%;

  /* Soft edge width for the moving right edge */
  --soft-edge-width: 30px;

  /* Color variables for easy customization */
  --beam-color: 186, 179, 255;
  --beam-opacity-1: 0.0;
  --beam-opacity-2: 0.1;
  --beam-opacity-3: 0.3;
  --beam-opacity-4: 0.5;
  --beam-opacity-5: 0.3;
  --beam-opacity-6: 0.1;
  --beam-opacity-7: 0.0;

  --particle-color: 186, 179, 255;
  --particle-opacity-1: 0.8;
  --particle-opacity-2: 0.6;
  --particle-opacity-3: 0.9;
  --particle-opacity-4: 0.7;
  --particle-opacity-5: 0.5;

  /* Soft-edged reveal mask (standard + webkit) */
  mask-image: linear-gradient(
    90deg,
    black 0%,
    black calc(100% - var(--soft-edge-width)),
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    90deg,
    black 0%,
    black calc(100% - var(--soft-edge-width)),
    transparent 100%
  );
  mask-size: 0% 100%;
  -webkit-mask-size: 0% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;

  animation: revealMask 2s ease-out forwards;
}

.beam-animation-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(var(--beam-color), var(--beam-opacity-1)) 10%,
    rgba(var(--beam-color), var(--beam-opacity-2)) 20%,
    rgba(var(--beam-color), var(--beam-opacity-3)) 40%,
    rgba(var(--beam-color), var(--beam-opacity-4)) 50%,
    rgba(var(--beam-color), var(--beam-opacity-5)) 60%,
    rgba(var(--beam-color), var(--beam-opacity-6)) 80%,
    rgba(var(--beam-color), var(--beam-opacity-7)) 90%,
    transparent 100%
  );
  animation: beam-sweep 2s ease-out;
  z-index: 10;
  pointer-events: none;
}

/* Particle effects */
.beam-animation-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(var(--particle-color), var(--particle-opacity-1)), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(var(--particle-color), var(--particle-opacity-2)), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(var(--particle-color), var(--particle-opacity-3)), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(var(--particle-color), var(--particle-opacity-4)), transparent),
    radial-gradient(2px 2px at 160px 30px, rgba(var(--particle-color), var(--particle-opacity-5)), transparent),
    /* additional particles */
    radial-gradient(2px 2px at 15px 85px, rgba(var(--particle-color), var(--particle-opacity-2)), transparent),
    radial-gradient(1px 1px at 55px 25px, rgba(var(--particle-color), var(--particle-opacity-1)), transparent),
    radial-gradient(3px 3px at 75px 90px, rgba(var(--particle-color), var(--particle-opacity-4)), transparent),
    radial-gradient(1px 1px at 105px 15px, rgba(var(--particle-color), var(--particle-opacity-3)), transparent),
    radial-gradient(2px 2px at 125px 55px, rgba(var(--particle-color), var(--particle-opacity-5)), transparent),
    radial-gradient(1px 1px at 145px 95px, rgba(var(--particle-color), var(--particle-opacity-2)), transparent),
    radial-gradient(2px 2px at 175px 20px, rgba(var(--particle-color), var(--particle-opacity-3)), transparent),
    radial-gradient(3px 3px at 190px 75px, rgba(var(--particle-color), var(--particle-opacity-1)), transparent),
    radial-gradient(1px 1px at 35px 55px, rgba(var(--particle-color), var(--particle-opacity-4)), transparent),
    radial-gradient(2px 2px at 65px 10px, rgba(var(--particle-color), var(--particle-opacity-2)), transparent),
    radial-gradient(1px 1px at 95px 95px, rgba(var(--particle-color), var(--particle-opacity-5)), transparent),
    radial-gradient(2px 2px at 115px 35px, rgba(var(--particle-color), var(--particle-opacity-3)), transparent),
    radial-gradient(1px 1px at 155px 65px, rgba(var(--particle-color), var(--particle-opacity-1)), transparent),
    radial-gradient(2px 2px at 185px 45px, rgba(var(--particle-color), var(--particle-opacity-4)), transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: particle-float 3.4s ease-out;
  opacity: 0;
  z-index: 9;
  pointer-events: none;
}

@keyframes revealMask {
  0% {
    mask-size: 0% 100%;
    -webkit-mask-size: 0% 100%;
    --reveal-progress: 0%;
  }
  100% {
    mask-size: 100% 100%;
    -webkit-mask-size: 100% 100%;
    --reveal-progress: 100%;
  }
}

@keyframes beam-sweep {
  0% {
    left: -100%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes particle-float {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
    backdrop-filter: blur(30px);
  }
  20% {
    opacity: 1;
    transform: translateY(-10px) scale(1);
  }
  50% {
      backdrop-filter: blur(0px);
  }
  60% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(1.15);
  }
}
</style>
