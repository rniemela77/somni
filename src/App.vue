<template>
    <div>
      <h1>Welcome</h1>
      <p v-if="userState?.user">
        Logged in as: {{ userState.user.email }}
        <button @click="logout">Log Out</button>
      </p>
      <p v-else>
        Not logged in
      </p>
      <router-link to="/sign-up">Sign Up</router-link>
      <router-link to="/sign-in">Sign In</router-link>
      <router-view />
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
  
  <style scoped>
  button {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  