<template>
	<footer class="py-5 mt-5">
		<div class="container">
			<div class="row">
				<!-- Brand Section -->
				<div class="col-lg-4 col-md-6 mb-4">
					<div class="footer-brand">
						<h5 class="fw-bold mb-2 text-cinzel">Somni</h5>
						<p class="text-muted mb-3">Discover your unique archetype</p>
						<p class="small text-muted">
							Unlock the mysteries of your personality through ancient wisdom and modern psychology.
						</p>
					</div>
				</div>

				<!-- Quick Links -->
				<div class="col-lg-2 col-md-6 mb-4">
					<h6 class="fw-semibold mb-3">Quick Links</h6>
					<ul class="list-unstyled">
						<li class="mb-2">
							<router-link to="/" class="text-decoration-none text-muted small">Dashboard</router-link>
						</li>
						<li class="mb-2">
							<router-link to="/mythbook" class="text-decoration-none text-muted small">Mythbook</router-link>
						</li>
						<li class="mb-2">
							<router-link to="/contact" class="text-decoration-none text-muted small">Contact</router-link>
						</li>
						<li class="mb-2">
							<router-link to="/account" class="text-decoration-none text-muted small">Account</router-link>
						</li>
						<li class="mb-2">
							<router-link to="/account" class="text-decoration-none text-muted small">Donate</router-link>
						</li>
					</ul>
				</div>

				<!-- Legal -->
				<div class="col-lg-2 col-md-6 mb-4">
					<h6 class="fw-semibold mb-3">Legal</h6>
					<ul class="list-unstyled">
						<li class="mb-2">
							<router-link to="/privacy-policy" class="text-decoration-none text-muted small">Privacy Policy</router-link>
						</li>
						<li class="mb-2">
							<router-link to="/terms-of-service" class="text-decoration-none text-muted small">Terms of Service</router-link>
						</li>
					</ul>
				</div>

				<!-- Contact & Social -->
				<div class="col-lg-4 col-md-6 mb-4">
					<h6 class="fw-semibold mb-3">Connect</h6>
					<div class="mb-3">
						<a href="mailto:rvniemela@hotmail.com" class="text-decoration-none text-muted small d-block mb-1">
							<i class="bi bi-envelope me-2"></i>rvniemela@hotmail.com
						</a>
					</div>
					<!-- Social links, commented out for now -->
					<!-- <div class="social-links">
						<a href="https://twitter.com/somni" target="_blank" rel="noopener noreferrer" class="text-decoration-none text-muted me-3">
							<i class="bi bi-twitter fs-5"></i>
						</a>
						<a href="https://facebook.com/somni" target="_blank" rel="noopener noreferrer" class="text-decoration-none text-muted me-3">
							<i class="bi bi-facebook fs-5"></i>
						</a>
						<a href="https://instagram.com/somni" target="_blank" rel="noopener noreferrer" class="text-decoration-none text-muted me-3">
							<i class="bi bi-instagram fs-5"></i>
						</a>
						<a href="https://linkedin.com/company/somni" target="_blank" rel="noopener noreferrer" class="text-decoration-none text-muted">
							<i class="bi bi-linkedin fs-5"></i>
						</a>
					</div> -->
				</div>
			</div>

			<!-- Bottom Bar -->
			<hr class="my-4">
			<div class="row align-items-center">
				<div class="col-12 text-center">
					<p class="mb-0 small text-muted">
						&copy; {{ new Date().getFullYear() }} Somni Quest. All rights reserved.
					</p>
				</div>
			</div>
		</div>
	</footer>
</template>

<style scoped>
footer {
	/* background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 40, 0.9) 100%); */
	/* border-top: 1px solid rgba(255, 255, 255, 0.1); */
	
	&:before {
		content: '';
		display: block;
		width: 100%;
		height: 2px;
		background: radial-gradient(circle, var(--primary-color), #00000000);
		margin-bottom: 20px;
	}
}

.footer-brand h5 {
	color: var(--text-primary);
	font-size: 3rem;
}

.social-links a {
	transition: all 0.3s ease;
	display: inline-block;
}

.social-links a:hover {
	color: var(--primary-color) !important;
	transform: translateY(-2px);
}

.footer-brand p:first-of-type {
	color: var(--primary-color);
	font-weight: 500;
	font-size: 0.9rem;
}

hr {
	border-color: rgba(255, 255, 255, 0.1);
}

.list-unstyled li a {
	transition: color 0.3s ease;
}

.list-unstyled li a:hover {
	color: var(--primary-color) !important;
}

@media (max-width: 768px) {
	footer {
		text-align: center;
	}
	
	.social-links {
		justify-content: center;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
}
</style>