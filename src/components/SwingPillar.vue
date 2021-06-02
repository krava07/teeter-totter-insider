<template>
  <div class="pillar"></div>
</template>

<script>
export default {
  name: 'swing-pillar'
}
</script>

<style lang="scss" scoped>
.pillar {
  width: 0;
  height: 0;
  margin: 0 auto;
  border-style: solid;
  border-width: 0 75px 250px 75px;
  border-color: transparent transparent $pillar-color transparent;
}
</style>
