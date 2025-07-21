<template>
	<nav class="navbar navbar-expand-lg navbar-light">
		<div class="container">
			<router-link to="/" class="navbar-brand">
				<h1 class="h3 mb-0 d-flex flex-column justify-content-center">
					<span class="somni-text">Somni</span>
					<small class="text-muted d-block lead">Personality Analyzer</small>
				</h1>
			</router-link>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
				aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav ms-auto mb-2 gap-3 mb-lg-0 align-items-center">
					<template v-if="!userStore.isAuthenticated">
						<li class="nav-item">
							<router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/signup" class="nav-link" active-class="active">Sign Up</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/signin" class="btn btn-primary">Sign In</router-link>
						</li>
					</template>
					<template v-else>
						<li class="nav-item">
							<router-link to="/quiz" class="nav-link" active-class="active">Assessments</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/" class="nav-link" exact-active-class="active">Overview</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/insights" class="nav-link" active-class="active">Insights</router-link>
						</li>
						<li class="nav-item dropdown">
							<a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" 
							   role="button" data-bs-toggle="dropdown" aria-expanded="false">
								<div class="user-avatar me-2">
									<i class="bi bi-person-circle"></i>
								</div>
								<span class="user-email">{{ userStore.user?.email || 'User' }}</span>
							</a>
							<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
								<li>
									<router-link to="/account" class="dropdown-item">
										<i class="bi bi-gear me-2"></i>Account
									</router-link>
								</li>
								<li><hr class="dropdown-divider"></li>
								<li>
									<button @click="handleSignOut" class="dropdown-item">
										<i class="bi bi-box-arrow-right me-2"></i>Sign Out
									</button>
								</li>
							</ul>
						</li>
					</template>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleSignOut = async (): Promise<void> => {
	const { success } = await userStore.signOut()
	if (success) {
		router.push('/signin')
	}
}
</script>

<style scoped>
.navbar {    
	box-shadow: 0 56px 56px -93px #000000a1;
    margin-bottom: 2rem;
}

.somni-text {
	font-weight: 900;
	font-size: 3rem;
	text-transform: uppercase;
	letter-spacing: -2px;
	color: rgb(104 135 207);
}

/* neuomorphic text shadow effect */
/* .somni-text {
	color: rgb(236 240 243);
	text-shadow: -0px -2px 1px white, -1px -2px 5px rgb(204 204 204), 1px 3px 15px rgba(129 107 106 / 0.47), 0px 0px 2px black; 
} */

.somni-text~* {
	color: #000000;
	margin-top: -5px;
	font-size: 1rem;
	margin-left: 0.3rem;
}

.navbar-toggler {
	height: 64px;
	width: 64px;
}

a.active {
	position: relative;
	&:after {	
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background: black;
	}
}

.user-avatar i {
	font-size: 1.5rem;
	color: #6c757d;
}

.user-email {
	font-size: 0.9rem;
	max-width: 150px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.dropdown-menu {
	border: none;
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
	border-radius: 0.5rem;
	padding: 0.5rem 0;
	min-width: 180px;
}

.dropdown-item {
	padding: 0.5rem 1rem;
	font-size: 0.9rem;
	border: none;
	background: none;
	width: 100%;
	text-align: left;
}

.dropdown-item:hover {
	background-color: #f8f9fa;
}

.dropdown-item i {
	color: #6c757d;
	width: 16px;
}
</style>