<template>
  <header class="header">
    <template v-if="isGameOver">Press [space] to start new game</template>
    <template v-else-if="isPaused">Press [space] to run game</template>
    <template v-else>Press [space] to pause</template>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'app-header',
  created () {
    window.addEventListener('keyup', this.onKeyUp)
  },
  beforeUnmount () {
    window.removeEventListener('keyup', this.onKeyUp)
  },
  computed: {
    ...mapGetters({
      isPaused: 'isPaused',
      isGameOver: 'isGameOver'
    })
  },
  methods: {
    ...mapActions({
      togglePause: 'ON_TOGGLE_PAUSE'
    }),
    onKeyUp (e) {
      if (e.keyCode === 32) {
        this.togglePause()
      }
    }
  }
}
</script>

<style scoped>
.header {
  font-size: 2rem;
  height: 70px;
}
</style>
