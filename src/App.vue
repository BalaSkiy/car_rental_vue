<template>
  <div id="app">
  <router-view></router-view>
  </div>
</template>

<script>
import { watch } from 'vue';
export default {
  name: 'App',
  components: {
  },
  data(){
    return{
      user:JSON.parse(sessionStorage.getItem('CurUser')),
    }
  },
  watch:{
    '$store.state.menu':{
      handler(val,old){
        if (!old && this.user && this.user.id){
          this.$store.commit("setRouter",val)
        }
      },
      immediate:true
    }
  }
}
</script>

<style>
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
</style>
