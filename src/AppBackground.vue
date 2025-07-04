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
	background-image: radial-gradient(circle at 15% 25%,
			#FFFDE6 0%,
			transparent 70%),
			radial-gradient(circle at 50% 50%, #E1F7FF 0%, transparent 70%),
			radial-gradient(circle at 75% 75%, #EBF1FF 0%, transparent 90%);
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