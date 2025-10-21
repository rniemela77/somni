<template>
  <div class="beam-animation-overlay" ref="overlayRef">
    <div class="darkening-layer"></div>
    <div class="masked-effects">
      <div class="beam-effect"></div>
      <div class="particle-effect"></div>
    </div>
  </div>
  <div class="revelation-content-masked">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const overlayRef = ref<HTMLElement>();

onMounted(() => {
  // Calculate total animation time from CSS variables
  const getCSSValue = (property: string) => {
    const value = getComputedStyle(overlayRef.value!).getPropertyValue(property);
    return parseFloat(value) * (value.includes('s') ? 1000 : 1);
  };
  
  const autoRemovalDelay = getCSSValue('--auto-removal-delay');
  
  // Remove the overlay after the animation completes
  setTimeout(() => {
    if (overlayRef.value) {
      overlayRef.value.style.opacity = '0';
      overlayRef.value.style.transition = 'opacity 0.5s ease-out';
      setTimeout(() => {
        if (overlayRef.value) {
          overlayRef.value.remove();
        }
      }, 500);
    }
  }, autoRemovalDelay);
});
</script>

<style>
:root {
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

  /* Animation timing variables */
  --darkness-duration: 7s;
  --mask-delay: 1s;
  --mask-duration: 0.7s;
  --particle-delay: 1s;
  --particle-duration: 3s;
  --auto-removal-delay: 7s;
}

.beam-animation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
  --reveal-progress: 0%;
}

.darkening-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  animation: darkenPage var(--darkness-duration) ease-out forwards;
  z-index: 0;
  pointer-events: none;
}

.masked-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  /* Soft-edged reveal mask (standard + webkit) - only for beam/particles */
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

  animation: revealMask var(--mask-duration) ease-out var(--mask-delay) forwards;
}

.revelation-content-masked {
  position: relative;
  z-index: 2;
  
  /* Apply the same mask as the effects */
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

  animation: revealMask var(--mask-duration) ease-out var(--mask-delay) forwards;
}

.beam-effect {
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
  animation: beam-sweep var(--mask-duration) ease-out var(--mask-delay);
  z-index: 3;
  pointer-events: none;
}

.particle-effect {
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
  animation: particle-float var(--particle-duration) ease-out var(--particle-delay);
  opacity: 0;
  z-index: 2;
  pointer-events: none;
}

@keyframes darkenPage {
  0% {
    background: rgba(0, 0, 0, 0);
}
10%, 70% {
    background: rgba(0, 0, 0, 0.4);
}
100% {
      background: rgba(0, 0, 0, 0);
  }
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
  40% {
      backdrop-filter: blur(0px);
  }
  50% {
    opacity: 0.2;
  }
  70% {
    opacity: 0.05;
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(1.15);
  }
}
</style>

