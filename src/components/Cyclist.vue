<template>
<div :class="[count, 'fuckthis']">
    <div class="power white" :class="resistance">
      <img svg-inline class="power-icon" src="../assets/lightning.svg" alt="example" />
       {{ current_power }}
    </div>
    <div class="racing-lane">
      <h1 class="white">Player {{id}}: {{name}}</h1>
      <h4>Total power: {{ total_power }}</h4>
    </div>
    <div>
      <button @click="start" >Connect</button>
      <div class="cyclist" :style="{'margin-left': position+ '%'}">
        <div id="bm"></div>
      </div>
      <div v-if="finished">You Finished</div>
      <la-cartesian :data="powerData">
        <la-line curve animated prop="value"></la-line>
      </la-cartesian>
    </div>
  </div>
</template>

<script>
import { Cartesian, Line } from 'laue';
import bodymovin from 'bodymovin';

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
  },
  mounted() {
    this.$nextTick(() => {
      const bmContainer = document.querySelector(`.biker--${this.id} #bm`);
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
      this.current_power = power;
      if (this.record) {
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
        this.position = (percent > 100) ? 100 : percent;
      }

      if (totalPower >= this.target_power) {
        this.animation.setSpeed(0);
        this.finished = true;
      }
    },
  },
};

</script>
