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
          :startTime="startTime"
          :id="bike.id"
          :name="bike.name"
        />
      </div>
    </div>
</template>

<script>
import Cyclist from '@/components/Cyclist.vue';
import moment from 'moment';

export default {
  components: {
    Cyclist,
  },
  data() {
    return {
      cyclist: [],
      count: 0,
      record: false,
      startTime: null,
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
      this.startTime = moment();
      console.log(this.startTime);
    },
  },
};

</script>
