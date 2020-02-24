<template>
    <div>
      <button @click="addCyclist" >Add Cyclist</button>
      <div class="track">
        <Cyclist v-for="bike in cyclist"
          :key="bike.id"
          :position="bike.position"
          :resistance="bike.resistance"
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
      this.cyclist.push({ id: this.count, position: 0, resistance: 10 });
    },
  },
};

</script>
