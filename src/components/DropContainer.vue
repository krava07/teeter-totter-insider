<template>
  <section
    class="drop-container"
  >
    <Figure
      v-for="figure in fallingFigureList" :key="figure.id"
      :figure="figure"
    />
  </section>
</template>

<script>
import Figure from './Figure'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Dropbox',
  components: {
    Figure
  },
  created () {
    this.initializeFallingFigures()
    window.addEventListener('keydown', this.onKeyDown)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.onKeyDown)
  },
  data () {
    return {
      iterationCounter: 0
    }
  },
  computed: {
    ...mapGetters({
      fallingFigureList: 'fallingFigureList'
    })
  },
  methods: {
    ...mapMutations({
      initializeFallingFigures: 'INITIALIZE_FALLING_FIGURES',
      moveRight: 'MOVE_RIGHT',
      moveLeft: 'MOVE_LEFT'
    }),
    onKeyDown (ev) {
      if (ev.keyCode === 39) this.moveRight()
      if (ev.keyCode === 37) this.moveLeft()
    }
  }
}
</script>

<style lang="scss" scoped>
.drop-container {
  height: 65%;
  width: 100%;
  position: relative;
}
</style>
