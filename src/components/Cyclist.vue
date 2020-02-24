<template>
  <div>
    <button @click="moveRed" >move red</button>
    <button v-if="position == 50" @click="boostRed">Speed bonus</button>
    <button @click="slowRed">Speed bump</button>
    <div class="red" :style="{'margin-left': position+ '%'}"></div>
    <div v-if="winner">You Finished</div>
  </div>
</template>

<script>

export default {
  props: ['position', 'resistance'],
  data() {
    return {
      winner: false,
    };
  },
  methods: {
    moveRed() {
      if (this.position < 100) {
        this.position += this.resistance;
      }
    },
    boostRed() {
      this.resistance = 20;
      setTimeout(() => {
        this.resistance = 10;
      }, 5000);
    },
    slowRed() {
      this.resistance = 5;
      setTimeout(() => {
        this.resistance = 10;
      }, 5000);
    },
  },
  watch: {
    position(a) {
      if (a >= 100) {
        this.winner = true;
      }
    },
  },
};

</script>
