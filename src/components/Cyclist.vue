<template>
  <div>
    <button @click="start" >start</button>
    <button v-if="position == 50" @click="boostRed">Speed bonus</button>
    <button @click="slowRed">Speed bump</button>
    <div class="cyclist" :style="{'margin-left': position+ '%'}">🚴🏼‍♂️</div>
    <div v-if="winner">You Finished</div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      position: 0,
      resistance: 10,
      winner: false,
    };
  },
  methods: {
    moveRed(power) {
      if (this.position < 100) {
        this.position += (power / this.resistance);
      }
    },
    boostRed() {
      this.resistance = 5;
      setTimeout(() => {
        this.resistance = 10;
      }, 5000);
    },
    slowRed() {
      this.resistance = 20;
      setTimeout(() => {
        this.resistance = 10;
      }, 5000);
    },
    start() {
      navigator.bluetooth.requestDevice({
        filters: [
          {
            services: [
              'heart_rate',
            ],
          },
        ],
      })
        .then((device) => { console.log(['device', device]); return device.gatt.connect(); })
        .then((server) => { console.log(['server', server]); return server.getPrimaryService('heart_rate'); })
        .then((service) => {
          console.log(['service', service]);
          return service.getCharacteristic('heart_rate_measurement');
        })
        .then((characteristic) => characteristic.startNotifications())
        .then((characteristic) => {
          console.log(['characteristic', characteristic]);
          characteristic.addEventListener('characteristicvaluechanged', this.handleCharacteristicValueChanged.bind(this));
        })
        // .then((value) => { console.log(value); })
        .catch((error) => console.log(error));
    },
    handleCharacteristicValueChanged(event) {
      const { value } = event.target;
      let index = 1;
      const result = {};
      console.log(value.getUint8(index));
      result.heartRate = (value.getUint8(index) / 1000);
      index += 1;

      console.log([result.heartRate]);
      return this.moveRed(result.heartRate);
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
