<template>
  <div class="swing" :style="style" ref="swing">
    <Figure
      v-for="figure in leftFigureList"
      :key="figure.id"
      :figure="figure"
      isOnSwing
    />
    <Figure
      v-for="figure in rightFigureList"
      :key="figure.id"
      :figure="figure"
      isRight
      isOnSwing
    />
  </div>
</template>

<script>
import Figure from './Figure'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Swing',
  components: {
    Figure
  },
  created () {
    this.addRightFigure()
  },
  mounted () {
    this.onUpdateCoordinates()
  },
  updated () {
    this.onUpdateCoordinates()
  },
  computed: {
    ...mapGetters({
      leftFigureList: 'leftFigureList',
      rightFigureList: 'rightFigureList',
      bending: 'bending'
    }),
    style () {
      return {
        transform: `rotate(${this.bending / 2}deg)`
      }
    }
  },
  methods: {
    ...mapMutations({
      addRightFigure: 'ADD_RIGHT_FIGURE',
      updateSwingCoordinates: 'UPDATE_SWING_COORDINATES'
    }),
    getCoordinates () {
      if (!this.$refs.swing) return
      return this.$refs.swing.getBoundingClientRect()
    },
    onUpdateCoordinates () {
      const coords = this.getCoordinates()
      this.updateSwingCoordinates(coords)
    }
  }
}
</script>

<style lang="scss" scoped>
.swing {
  width: 100%;
  height: 0.5rem;
  background-color: $swing-color;
  // border-bottom: 0.5rem solid $swing-color;
  position: relative;
  transform: rotate(0deg);
  transition: transform 0.4s ease-in-out;
}
</style>
