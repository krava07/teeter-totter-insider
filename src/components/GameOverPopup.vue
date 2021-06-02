<template>
  <div class="overlay" :style="style">
    <div class="popup">
      <div>Game over!</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'game-over-popup',
  computed: {
    ...mapGetters({
      isGameOver: 'isGameOver'
    }),
    style () {
      return {
        opacity: this.isGameOver ? 1 : 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: opacity 500ms;
  // background: rgba(0, 0, 0, 0.7);
}
.popup {
  margin: 100px auto;
  width: 30%;
  height: 300px;
  position: relative;
  font-size: 3rem;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
