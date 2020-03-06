<template>
    <div>
      <button @click="addCyclist" >Add Cyclist</button>
      <div class="track">
        <Cyclist v-for="bike in cyclist"
          :key="bike.id"
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
    };
  },
  methods: {
    addCyclist() {
      this.count += 1;
      this.cyclist.push({ id: this.count });
    },
  },
};

</script>
