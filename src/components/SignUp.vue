<template>
    <div>
        <h2>Sign Up</h2>
        <form @submit.prevent="signUp">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
        </form>
        <p>{{ message }}</p>
    </div>
</template>

<script>
import { auth } from "../../firebase";

import { createUserWithEmailAndPassword } from "firebase/auth";

export default {
    data() {
        return {
            email: "",
            password: "",
            message: "",
        };
    },
    methods: {
        async signUp() {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
                this.message = "Sign-up successful!";
                console.log("User:", userCredential.user);
            } catch (error) {
                this.message = error.message;
            }
        },
    },
};
</script>