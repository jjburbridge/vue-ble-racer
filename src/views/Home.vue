<template>
  <div class="home">
    <div class="header">
      <span class="white">GC<i>N</i></span>
      <span class="red">Bro<i>w</i>ser Cr<i>i</i>t</span>
    </div>
    <button @click="start" >startRace</button>
    <Course :record="record"/>
  </div>
</template>

<style lang="scss">
  @import '../assets/css/base.scss';
</style>
<script>
/* eslint no-bitwise: ["error", { "allow": ["&"] }] */
import Course from '@/components/Course.vue';

export default {
  name: 'Home',
  components: {
    Course,
  },
  data() {
    return {
      record: false,
    };
  },
  methods: {
    start() {
      this.record = true;
    },
  },
};
</script>
