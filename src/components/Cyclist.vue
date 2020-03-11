<template>
  <div>
    <div class="power white">
      <h3>{{ current_power }}</h3>
      <h4>Total power: {{ total_power }}</h4>
    </div>
    <div>
      <button @click="start" >start</button>
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
  data() {
    return {
      powerData: [
        { value: 0 },
      ],
      position: 0,
      resistance: 10,
      finished: false,
      current_power: 0,
      total_power: 0,
      target_power: 1000,
    };
  },
  methods: {
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
      this.total_power += power;
      this.powerData.push({ value: power });
    },
  },
  watch: {
    total_power(totalPower) {
      if (totalPower !== 0) {
        const percent = (totalPower / this.target_power) * 100;
        this.position = (percent > 100) ? 100 : percent;
      }

      if (totalPower >= this.target_power) {
        this.finished = true;
      }
    },
  },
};

</script>
