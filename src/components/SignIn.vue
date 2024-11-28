<template>
    <div>
        <h2>Sign In</h2>
        <form @submit.prevent="signIn">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <button type="submit">Sign In</button>
        </form>
        <p>{{ message }}</p>
    </div>
</template>

<script>
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
    data() {
        return {
            email: "",
            password: "",
            message: "",
        };
    },
    methods: {
        async signIn() {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
                this.message = "Login successful!";
                console.log("User:", userCredential.user);
            } catch (error) {
                this.message = error.message;
            }
        },
    },
};
</script>

<style scoped>
/* Optional styles */
</style>