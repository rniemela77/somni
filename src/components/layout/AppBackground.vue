<template>
	<img src="/Users/rvniemela/Sites/somni/public/images/night-bg.jpg" class="app-bg" />
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
	/*light mode*/
	filter: contrast(0.9) saturate(0.2) brightness(6.8);
}
</style>