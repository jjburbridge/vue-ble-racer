<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <button @click="onClick" >Get Bluetooth</button>
    <Course />
  </div>
</template>

<script>
/* eslint no-bitwise: ["error", { "allow": ["&"] }] */
import Course from '@/components/Course.vue';

export default {
  name: 'Home',
  components: {
    Course,
  },
  methods: {
  },
};
</script>
