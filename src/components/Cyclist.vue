<template>
<div :class="[count]">
  <div class="rider-details">
    <div class="player-stats">
      <h1 class="player-name white">Player {{id}}: {{name}} <button @click="start" class="connect">
        <img src="../assets/bluetooth.svg" alt="bluetooth"/>
      </button></h1>
      <div class="power-wrapper">
        <h2>Power:</h2>
        <div class="total-power white">

          Total: {{ total_power }}
          <font-awesome-icon icon="bolt" />
        </div>
        <div class="current-power white" :class="resistance">
          Current: {{ current_power }}
          <font-awesome-icon icon="bolt" />
        </div>
      </div>
    </div>
    <la-cartesian :data="powerData" class="power-graph" :width="1680">
      <la-line curve animated prop="value"></la-line>
    </la-cartesian>
  </div>

    <div>
    <div class="road">
      <div class="finished" v-if="finished">🏁 {{name}} Won! 🏁</div>
      <div class="cyclist" :style="{'margin-left': position+ '%'}">
        <div class="tag">{{name}}</div>
        <div id="bm"></div>
      </div>
    </div>

    </div>
  </div>
</template>

<script>
import { Cartesian, Line } from 'laue';
import bodymovin from 'bodymovin';
import moment from 'moment';

export default {
  components: {
    LaCartesian: Cartesian,
    LaLine: Line,
  },
  props: {
    count: Number,
    id: Number,
    record: Boolean,
    name: String,
    startTime: Object,
  },
  updated() {
    if (this.finished) {
      const now = moment();
      const seconds = now.diff(this.startTime) / 1000;
      window.alert(`${this.name} has finished in ${seconds} seconds`);
    }
  },
  mounted() {
    this.$nextTick(() => {
      const bmContainer = document.querySelector(`.rider--${this.id} #bm`);
      const animation = bodymovin.loadAnimation({
        container: bmContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/49240/bike.json',
      });
      animation.setSpeed(0);
      this.animation = animation;
    });
  },
  data() {
    return {
      powerData: [{ value: 0 }],
      animation: null,
      position: 0,
      resistance: 10,
      finished: false,
      current_power: 0,
      total_power: 0,
      target_power: 5000,
    };
  },
  methods: {
    async start() {
      try {
        const device = await navigator.bluetooth.requestDevice({ filters: [{ services: ['cycling_power'] }] });
        const server = await device.gatt.connect();
        const cyclingPower = await server.getPrimaryService('cycling_power');
        const cyclingPowerResistance = await cyclingPower.getCharacteristic('a026e005-0a7d-4ab3-97fa-f1500f9feb8b');

        const data = new Uint8Array.of(1);
        const response = await cyclingPowerResistance.writeValue(data);
        console.log(response);
        const cyclingPowerMeasurement = await cyclingPower.getCharacteristic('cycling_power_measurement');
        await cyclingPowerMeasurement.startNotifications();
        await cyclingPowerMeasurement.addEventListener('characteristicvaluechanged', this.handleCyclingPowerMeasurementValueChanged.bind(this));
      } catch (error) {
        console.log(error);
      }
    },
    handleCyclingPowerMeasurementValueChanged(event) {
      const { value } = event.target;
      const index = 1;
      const power = value.getInt16(index);
      this.current_power = power;
      if (this.record && !this.finished) {
        this.animation.setSpeed(power / 100);
        this.total_power += power;
        this.powerData.push({ value: power });
      }
    },
  },
  watch: {
    total_power(totalPower) {
      if (totalPower !== 0) {
        const percent = (totalPower / this.target_power) * 100;
        this.position = (percent > 92.7) ? 92.7 : percent;
      }

      if (totalPower >= this.target_power) {
        this.animation.setSpeed(0);
        this.finished = true;
      }
    },
  },
};

</script>
