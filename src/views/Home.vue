<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <button @click="onClick" >Get Bluetooth</button>
    <Course />
  </div>
</template>

<script>
// @ is an alias to /src
import Course from '@/components/Course.vue';

export default {
  name: 'Home',
  components: {
    Course,
  },
  methods: {
    onClick() {
      navigator.bluetooth.requestDevice({
        filters: [
          {
            services: [
              'heart_rate',
            ],
          },
        ],
      })
        .then((device) => { console.log(device); return device.gatt.connect(); })
        .then((server) => { console.log(server); return server.getPrimaryService('heart_rate'); })
        .then((service) => {
          console.log(service);
          return service.getCharacteristic('heart_rate_measurement');
        })
        .then((characteristic) => {
          console.log(characteristic);
          return characteristic.readValue();
        })
        .then((value) => { console.log(value); })
        .catch((error) => console.log(error));
    },
  },
};
</script>
