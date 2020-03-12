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
    async start() {
      try {
        const device = await navigator.bluetooth.requestDevice({ filters: [{ services: ['cycling_power'] }] });
        const server = await device.gatt.connect();
        const cyclingPower = await server.getPrimaryService('cycling_power');
        const cyclingPowerResistance = await cyclingPower.getCharacteristic('a026e005-0a7d-4ab3-97fa-f1500f9feb8b');
        await cyclingPowerResistance.startNotifications();
        const resistance = await cyclingPowerResistance.getDescriptor('00002902-0000-1000-8000-00805f9b34fb');
        console.log(resistance);
        const data = new Uint8Array([32, 0xee, 0xfc]);
        const response = await resistance.writeValue(data);
        console.log(response);
        // const cyclingPowerMeasurement =
        // await cyclingPower.getCharacteristic('cycling_power_measurement');
        // await cyclingPowerMeasurement.startNotifications();
        // await cyclingPowerMeasurement.addEventListener('characteristicvaluechanged',
        // this.handleCyclingPowerMeasurementValueChanged.bind(this));
      } catch (error) {
        console.log(error);
      }
    },
    handleCyclingPowerMeasurementValueChanged(event) {
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
