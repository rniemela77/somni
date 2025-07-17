<template>
	<footer class="bg-light py-3">
		<div class="container text-center">
			<p class="mb-1">
				&copy; {{ new Date().getFullYear() }} Somni Personality Analyzer. Created by Robert Niemela
				- rvniemela@hotmail.com
			</p>
			<p class="mb-0">
				<router-link to="/privacy-policy" class="text-decoration-none">Privacy Policy</router-link>
			</p>
		</div>
	</footer>
</template>

<style scoped>
footer a {
	color: var(--bs-secondary, #6c757d);
	font-size: 0.9rem;
}

footer a:hover {
	color: var(--bs-primary, #0d6efd);
}
</style>