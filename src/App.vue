<template>
  <b-container fluid id="app" class="p-0">
    <!-- <Navbar/> -->
    <NotificationContainer />
    <router-view />
  </b-container>
</template>

<script>
import NotificationContainer from '@/components/NotificationContainer.vue'
// import Navbar from '@/components/Navbar.vue'
export default {
  components: {
    NotificationContainer
    // Navbar
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
