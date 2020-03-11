<template>
    <div class="wrapper">
      <div class="controls">
        <button @click="addCyclist" class="button add-cyclist">Add Cyclist</button>
        <button @click="start" class="button start-race">Start Race</button>
      </div>
      <div class="track">
        <Cyclist v-for="bike in cyclist"
          :key="bike.id"
          :class="[`rider--${bike.id}`]"
          :record="record"
          :id="bike.id"
          :name="bike.name"
        />
      </div>
    </div>
</template>

<script>
import Cyclist from '@/components/Cyclist.vue';

export default {
  components: {
    Cyclist,
  },
  data() {
    return {
      cyclist: [],
      count: 0,
      record: false,
    };
  },
  methods: {
    addCyclist() {
      this.count += 1;
      const name = window.prompt('Please enter your name', '');
      this.cyclist.push({ id: this.count, name });
    },
    start() {
      this.record = true;
    },
  },
};

</script>
