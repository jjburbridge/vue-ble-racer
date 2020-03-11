<template>
  <div>
    <div class="power white">
      <h3>{{ current_power }}</h3>
    </div>
    <div>
      <button @click="start" >Connect</button>
      <div class="cyclist" :style="{'margin-left': position+ '%'}">🚴🏼‍♂️</div>
      <div v-if="finished">You Finished</div>
      <la-cartesian :data="powerData">
        <la-line curve animated prop="value"></la-line>
      </la-cartesian>
    </div>
  </div>
</template>

<script>
import { Cartesian, Line } from 'laue';

export default {
  components: {
    LaCartesian: Cartesian,
    LaLine: Line,
  },
  props: {
    record: Boolean,
  },
  data() {
    return {
      powerData: [
        { value: 0 },
      ],
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
      navigator.bluetooth.requestDevice({ filters: [{ services: ['cycling_power'] }] })
        .then((device) => device.gatt.connect())
        .then((server) => server.getPrimaryService('cycling_power'))
        .then((service) => service.getCharacteristic('cycling_power_measurement'))
        .then((characteristic) => characteristic.startNotifications())
        .then((characteristic) => {
          characteristic.addEventListener('characteristicvaluechanged', this.handleCharacteristicValueChanged.bind(this));
        })
        .catch((error) => console.log(error));
    },
    handleCharacteristicValueChanged(event) {
      const { value } = event.target;
      const index = 1;
      const power = value.getInt16(index);
      console.log(power);
      this.current_power = power;
      if (this.record) {
        this.powerData.push({ value: power });
        this.moveRed(power);
      }
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
