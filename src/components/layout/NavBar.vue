<template>
	<nav class="navbar navbar-expand-sm navbar-light mb-sm-3">
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
				<ul class="navbar-nav ms-auto mb-2 gap-3 mb-sm-0 align-items-end align-items-sm-center">
					<template v-if="!userStore.isAuthenticated">
						<li class="nav-item">
							<router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/signin" class="nav-link" active-class="active">Sign In</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/signup" class="btn btn-primary">Sign Up</router-link>
						</li>
						<button class="btn btn-outline-secondary" @click="isDark = !isDark">
							<span class="me-2" :class="{ 'bi-moon-fill': !isDark, 'bi-sun-fill': isDark }"></span>
							<span v-if="isDark">Light Mode</span>
							<span v-else>Dark Mode</span>
						</button>
					</template>
					<template v-else>
						<li class="nav-item">
							<router-link to="/" class="nav-link" exact-active-class="active">
								<i class="bi bi-house-door me-2"></i>
								Dashboard
							</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/insights" class="nav-link" active-class="active">
								<i class="bi bi-lightbulb me-2"></i>
								Insights
							</router-link>
						</li>

						<!-- Desktop dropdown (hidden on mobile) -->
						<li class="nav-item dropdown d-none d-sm-block">
							<a class="btn btn-outline-secondary nav-link dropdown-toggle d-flex align-items-center justify-content-center"
								href="#" id="userDropdown" role="button" data-bs-toggle="dropdown"
								aria-expanded="false">
								<div class="user-avatar me-2">
									<i class="bi bi-person-circle"></i>
								</div>
							</a>
							<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
								<li>
									<router-link to="/account" class="dropdown-item">
										<i class="bi bi-gear me-2"></i>Account
									</router-link>
								</li>
								<li>
									<button class="dropdown-item" @click="isDark = !isDark">
										<span class="me-2"
											:class="{ 'bi-moon-fill': !isDark, 'bi-sun-fill': isDark }"></span>
										<span v-if="isDark">Light Mode</span>
										<span v-else>Dark Mode</span>
									</button>
								</li>
								<li>
									<hr class="dropdown-divider">
								</li>
								<li>
									<button @click="handleSignOut" class="dropdown-item">
										<i class="bi bi-box-arrow-right me-2"></i>Sign Out
									</button>
								</li>
							</ul>
						</li>

						<!-- Mobile nav items (hidden on desktop) -->
						<li class="nav-item d-sm-none">
							<router-link to="/account" class="nav-link">
								<i class="bi bi-gear me-2"></i>Account
							</router-link>
						</li>
						<li class="nav-item d-sm-none">
							<button class="nav-link" @click="isDark = !isDark">
								<span class="me-2" :class="{ 'bi-moon-fill': !isDark, 'bi-sun-fill': isDark }"></span>
								<span v-if="isDark">Light Mode</span>
								<span v-else>Dark Mode</span>
							</button>
						</li>
						<li class="nav-item d-sm-none">
							<button @click="handleSignOut" class="nav-link">
								<i class="bi bi-box-arrow-right me-2"></i>Sign Out
							</button>
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
		userStore.cleanup();
		router.push('/signin')
	}
}


import { useDarkMode } from '../../composables/useDarkMode';

const { isDark } = useDarkMode();
</script>

<style scoped>
.navbar {
	box-shadow: 0 56px 56px -93px #000000a1;
}

.somni-text {
	font-weight: 900;
	font-size: 3rem;
	text-transform: uppercase;
	letter-spacing: -2px;
	color: var(--text-primary);
}

.somni-text~* {
	margin-top: -5px;
	font-size: 1rem;
	margin-left: 0.3rem;
}

.navbar-toggler {
	height: 64px;
	width: 64px;
	border: 1px solid var(--nav-toggler-bg);
	color: var(--text-primary);

	&:hover {
		background: var(--nav-toggler-hover-bg);
	}
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
		background: var(--body-text-color);
	}
}

.user-avatar i {
	font-size: 1.5rem;
	color: var(--nav-dropdown-text-color);
}

.user-email {
	font-size: 0.9rem;
	max-width: 150px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.dropdown-toggle:after {
	color: var(--nav-dropdown-text-color);
}

.dropdown-menu {
	border: none;
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
	border-radius: 0.5rem;
	padding: 0.5rem 0;
	min-width: 180px;
	background: var(--nav-dropdown-bg-color);


	.dropdown-item {

		&,
		i {
			color: var(--nav-dropdown-text-color);
		}
	}

	.dropdown-item:hover,
	.dropdown-item:focus {

		&,
		i {
			color: var(--nav-dropdown-hover-text-color);
			background-color: var(--nav-dropdown-hover-bg-color);
		}
	}
}

.dropdown-item {
	padding: 0.5rem 1rem;
	font-size: 0.9rem;
	border: none;
	background: none;
	width: 100%;
	text-align: left;
}

.dropdown-item i {
	color: #6c757d;
	width: 16px;
}
</style>