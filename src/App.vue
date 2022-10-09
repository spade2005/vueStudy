<script setup>
import { NMessageProvider } from 'naive-ui'
</script>



<template>


  <!--
    <header>
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="You did it!Your are beautiful" />
      </div>
    </header>
    <div>
      <router-link to="/">Go to Home</router-link>
      <router-link to="/user">Go to user</router-link>
      <router-link to="/login">Go to login</router-link>

      <router-link to="/config/list">Go to config</router-link>
    </div>
  -->

  <main>
    <n-message-provider>
    <router-view></router-view>
    </n-message-provider>
  </main>
</template>

<style scoped>
</style>
