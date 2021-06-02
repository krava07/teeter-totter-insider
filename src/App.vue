<template>
  <div id="app">
    <AppHeader />
    <Game />
    <GameOverPopup />
  </div>
</template>

<script>
import Game from './components/Game.vue'
import AppHeader from './components/AppHeader'
import GameOverPopup from './components/GameOverPopup'

export default {
  name: 'App',
  components: {
    Game,
    AppHeader,
    GameOverPopup
  }
}
</script>

<style lang="scss">
body {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
ul {
  list-style: none;
}
html {
  font-size: 14px;
}
#app {
  font-family: 'Press Start 2P', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  // margin-top: 60px;
  overflow: hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
