<template>
    <div>
        <section>
            <h1>Welcome</h1>
            <p v-if="userState?.user">
                Logged in as: {{ userState.user.email }}
                <button @click="logout">Log Out</button>
            </p>
            <p v-else>
                Not logged in
            </p>
        </section>

        <nav>
            <router-link to="/sign-up">Sign Up</router-link>
            <router-link to="/sign-in">Sign In</router-link>
            <router-link to="/quiz">Take Quiz</router-link>
            <router-link to="/results">View Results</router-link>
            <router-link to="/payment">Make Payment</router-link>
        </nav>

        <main>
            <router-view />
        </main>
    </div>
</template>

<script>
import { inject } from "vue";
import { logout } from "./provide/inject";

export default {
    setup() {
        const userState = inject("userState");
        return { userState, logout };
    },
};
</script>

<style>
:root {
    --primary-color: blue;
    --primary-color-light: #6060FF;
    --secondary-color: white;
}

* {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    padding: 2rem;
}

a {
    color: var(--primary-color);
    text-decoration: none;
    border: 1px solid var(--primary-color);
    border-radius: 5px;
    padding: 0.5rem 1rem;
    display: inline-block;
    transition: all 0.1s ease;
}

button:not(:last-child),
a:not(:last-child) {
    margin-right: 10px;
}

a:hover {
    background-color: var(--primary-color);
    color: var(--secondary-color);
}

button {
    background-color: var(--primary-color);
    color: var(--secondary-color);
    border: 1px solid var(--primary-color);
    border-radius: 5px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.1s ease;
}

button:hover {
    background-color: var(--primary-color-light);
    color: var(--secondary-color);
}

a:active,
button:active {
    transform: scale(0.95);
}

section,
nav {
    margin-bottom: 2rem;
}

main {
    padding: 2rem;
    background-color: #f0f0f0;
    border-radius: 10px;
}
</style>