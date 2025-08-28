<template>
	<footer class="py-3 mt-5">
		<div class="container text-center">
			<p class="mb-1">
				&copy; {{ new Date().getFullYear() }} Somni Personality Analyzer
				- <a href="mailto:rvniemela@hotmail.com">rvniemela@hotmail.com</a>
			</p>
			<p class="d-flex gap-4 justify-content-center m-0">
				<router-link to="/privacy-policy" class="text-decoration-none">Privacy Policy</router-link>
				<router-link to="/terms-of-service" class="text-decoration-none">Terms of Service</router-link>
			</p>
		</div>
	</footer>
</template>

<style scoped>
footer {
	&:before {
		content: '';
		display: block;
		width: 100%;
		height: 2px;
		background: radial-gradient(circle, var(--primary-color), #00000000);
		margin-bottom: 10px;
	}
}
</style>