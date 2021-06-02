<template>
  <div class="game">
    <DropContainer/>
    <TeetleTottle />
  </div>
</template>

<script>
import DropContainer from './DropContainer'
import TeetleTottle from './TeetleTottle'

export default {
  name: 'game',
  components: {
    DropContainer,
    TeetleTottle
  }
}
</script>

<style lang="scss" scoped>
  .game {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
  }
</style>
