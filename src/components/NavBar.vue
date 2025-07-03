<template>
	<nav class="navbar navbar-expand-lg navbar-light bg-light">
	        <div class="container">
	          <router-link to="/" class="navbar-brand">
	            <h1 class="h3 mb-0">
	              <span class="text-primary">Somni</span>
	              <small class="text-muted d-block">Personality Analyzer</small>
	            </h1>
	          </router-link>
	          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
	            <span class="navbar-toggler-icon"></span>
	          </button>
	          <div class="collapse navbar-collapse" id="navbarNav">
	            <ul class="navbar-nav ms-auto mb-2 gap-3 mb-lg-0 align-items-center">
	              <template v-if="!userStore.isAuthenticated">
	                <li class="nav-item">
	                  <router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
	                </li>
	                <li class="nav-item">
	                  <router-link to="/signin" class="btn btn-primary">Sign In</router-link>
	                </li>
	              </template>
	              <template v-else>
	                <li class="nav-item">
	                  <router-link to="/" class="nav-link" exact-active-class="active">Dashboard</router-link>
	                </li>
	                <li class="nav-item">
	                  <router-link to="/quiz" class="nav-link" active-class="active">Analyzers</router-link>
	                </li>
	                <li class="nav-item">
	                  <router-link to="/account" class="nav-link" active-class="active">Account</router-link>
	                </li>
	                <li class="nav-item">
	                  <button @click="handleSignOut" class="btn btn-outline-secondary">Sign Out</button>
	                </li>
	              </template>
	            </ul>
	          </div>
	        </div>
	      </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
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
