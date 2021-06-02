<template>
  <section class="teetleTottle">
    <Swing/>
    <SwingPillar/>
  </section>
</template>

<script>
import Swing from './Swing'
import SwingPillar from './SwingPillar'

export default {
  name: 'teetle-tottle',
  components: {
    Swing, SwingPillar
  }
}
</script>

<style scoped>
  .teetleTottle{
    height: 35%;
    width: 100%;
  }
</style>
