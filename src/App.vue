<template>
  <div class="flex-default" id="app">
    <left-side-bar></left-side-bar>
    <date-mark/>
  </div>
</template>

<script>
import DateMark from './views/date-mark/DateMark.vue'
import LeftSideBar from './views/layout/LeftSideBar.vue'

export default {
  name: 'App',
  components: {
    DateMark,
    LeftSideBar
  }
}
</script>

<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    user-select: none;
  }
</style>
