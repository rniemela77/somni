<template>
    <div>
        <h1>Welcome</h1>
        <p v-if="userState.user">Logged in as: {{ userState.user.email }}</p>
        <p v-else>Not logged in</p>
        <router-link to="/sign-up">Sign Up</router-link>
        <router-link to="/sign-in">Sign In</router-link>
        <router-view />
    </div>
</template>

<script>
import { inject } from "vue";
export default {
    setup() {
        const userState = inject("userState");
        return { userState };
    },
};
</script>