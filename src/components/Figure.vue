<template>
  <div
    :class="`figure figure-${figure.type}`"
    :style="style"
    ref="figure"
  >
    {{ figure.weight }}
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'app-figure',
  props: {
    figure: {
      type: Object,
      required: true
    },
    isRight: {
      type: Boolean
    },
    isOnSwing: {
      type: Boolean
    }
  },
  updated () {
    const currentBottomCoordinate = this.getBottomCoordinate()
    this.updateBottomCoord(currentBottomCoordinate)
  },
  computed: {
    leftOffset () {
      if (this.isRight) {
        return 50 + this.figure.offset * 10
      }
      return 50 - this.figure.offset * 10
    },
    style () {
      const { type, size, top, offsetBottom } = this.figure
      let blockHeight = {
        height: `${size}px`,
        width: `${size}px`,
        lineHeight: `${size}px`
      }
      if (type === 'triangle') {
        blockHeight = {
          borderWidth: `0 ${size}px ${size}px ${size}px`,
          lineHeight: `${(size * 1.2)}px`
        }
      }
      const style = {
        top: this.isOnSwing ? `-${offsetBottom}px` : `${top}px`, // this.isOnSwing ? 0 : `${top}px`,
        left: `${this.leftOffset}%`,
        ...blockHeight
      }
      // if (this.isOnSwing) {
      //   style.bottom = `${offsetBottom}px`
      // } else {
      //   style.top = `${top}px`
      // }
      return style
    }
  },
  methods: {
    ...mapMutations({
      updateBottomCoord: 'UPDATE_FIGURE_BOTTOM_COORDINATE'
    }),
    getBottomCoordinate () {
      if (!this.$refs.figure) return 0
      return this.$refs.figure.getBoundingClientRect().bottom
    }
  }
}
</script>

<style lang="scss" scoped>
.figure {
  position: absolute;
  transform: translate(-50%, -100%);
  text-align: center;
  font-size: 0.7rem;
  bottom: 0;

  &-circle {
    background-color: $circle-color;
    border-radius: 50%;
  }

  &-triangle {
    width: 0;
    height: 0;
    line-height: 4rem;
    border-style: solid;
    border-color: transparent transparent $triangle-color transparent;
  }

  &-rectangle {
    background-color: $rectangle-color;
  }
}

</style>
