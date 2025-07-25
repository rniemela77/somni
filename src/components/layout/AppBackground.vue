<template>
	<div class="app-bg"></div>
</template>

<style scoped>
.app-bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: -1;
}

.app-bg::before,
.app-bg::after {
	content: "";
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: -1;
	position: fixed;
	inset: 0;
}

.app-bg::before {
	background-image: var(--app-bg-gradient);
}

.app-bg::after {
	content: "";
	background-image: url("/src/assets/bg.jpg");
	background-size: 50% 50%;
	background-repeat: repeat;
	opacity: 0.1;
	background-blend-mode: multiply;
	z-index: 0;
	position: fixed;
	inset: 0;
}
</style>