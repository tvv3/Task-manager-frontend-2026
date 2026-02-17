<script setup>

import {
  RouterLink,
  RouterView
} from 'vue-router';
import {
  useAuthStore
} from '@/stores/auth';


const authStore = useAuthStore();
//console.log('home:',authStore.user);
// moved to main.js  !!!!

</script>

<template>
  <div id="bodyDiv">

    <header>
      <div class="d-flex justify-content-between" style="margin:2rem;">
       <p class="text-left" style="color:blueviolet;font-weight: bold;"> Tasks App </p>
    
       <div v-if="authStore.user">
      You are connected with:
       <strong> {{ authStore.user.name }}</strong>
      </div>
      </div>
       <div class="wrapper">
        <nav class="navbar navbar-expand-lg">
          <div class="container-fluid d-flex justify-content-end">
            <button class="navbar-toggler bg-light" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
              aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse d-lg-flex justify-content-lg-center" id="navbarSupportedContent">
              <br>
              <ul class="navbar-nav mb-2 mb-lg-0">
                
                <div class="d-flex justify-content-end">
                  <li class="nav-item">
                  <RouterLink :to="{ name: 'home' }">Home</RouterLink>
                  </li>
                  <li  v-if="authStore.user==null" class="nav-item">
                    <RouterLink :to="{ name: 'login' }">Sign In</RouterLink>
                  </li>
                <!--/div>
                <div class="d-flex justify-content-end"-->
                  <li v-if="authStore.user!=null" class="nav-item">
                    <RouterLink :to="{ name: 'tasks' }">Tasks</RouterLink>
                  </li>
                  <li class="nav-item" v-if="authStore.user==null?false:authStore.user.user_role.role=='admin'">
                    <RouterLink :to="{ name: 'register' }">New User</RouterLink>
                  </li>
                  <li class="nav-item">
                    <RouterLink :to="{ name: 'changePassword' }" v-if="authStore.user==null?false:authStore.user.user_role.role=='admin'">Change Password</RouterLink>
                  </li>
                  <li class="nav-item" v-if="authStore.user!=null">
                    <form><button id="logoutButton" type="button" @click.prevent="authStore.logout();"
                        class="btn btn-primary btn-block fa-lg bg-violet-custom mb-1"
                        style="margin-right: 0.5em;font-size:16px;padding: 0 1rem;">Logout</button></form>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </nav>

      </div>
    </header>
   
    <br>
    <RouterView />
    <br>
    <br>
  </div>
</template>

<style>

</style>
