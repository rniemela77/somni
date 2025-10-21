<template>
	<img src="/images/night-bg.jpg" class="app-bg" />
</template>

<style scoped>
.app-bg {
	width: 100vw;
	height: 100vh;
	object-fit: cover;
	object-position: center;
	position: fixed;
	inset: 0;
	z-index: -1;
	pointer-events: none;
	user-select: none;
}
</style>