<template>
	<footer class="py-3 mt-5">
		<div class="container text-center">
			<p class="mb-1">
				&copy; {{ new Date().getFullYear() }} Somni Personality Analyzer. Created by Robert Niemela
				- <a href="mailto:rvniemela@hotmail.com">rvniemela@hotmail.com</a>
			</p>
			<p class="mb-0">
				<router-link to="/privacy-policy" class="text-decoration-none me-3">Privacy Policy</router-link>
				<router-link to="/terms-of-service" class="text-decoration-none">Terms of Service</router-link>
			</p>
		</div>
	</footer>
</template>

<style scoped>
footer {
	box-shadow: 0 -37px 17px -48px #0009dd70;
}
</style>