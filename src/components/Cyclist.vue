<template>
  <div>
    <div class="power">
      <h3>{{ current_power }}</h3>
    </div>
    <div>
      <button @click="start" >start</button>
      <div class="cyclist" :style="{'margin-left': position+ '%'}">🚴🏼‍♂️</div>
      <div v-if="winner">You Finished</div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      position: 0,
      resistance: 10,
      finished: false,
      current_power: 0,
    };
  },
  methods: {
    moveRed(power) {
      if (this.position < 100) {
        this.position += (power / this.resistance);
      }
    },
    start() {
      navigator.bluetooth.requestDevice({
        filters: [
          {
            services: [
              'cycling_power',
            ],
          },
        ],
      })
        .then((device) => { console.log(['device', device]); return device.gatt.connect(); })
        .then((server) => { console.log(['server', server]); return server.getPrimaryService('cycling_power'); })
        .then((service) => {
          console.log(['service', service]);
          return service.getCharacteristic('cycling_power_measurement');
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
      const index = 1;
      const power = value.getInt16(index);
      console.log(power);
      this.current_power = power;
      return this.moveRed(power);
    },
  },
  watch: {
    position(a) {
      if (a >= 100) {
        this.finished = true;
      }
    },
  },
};

</script>
