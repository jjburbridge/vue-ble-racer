<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <button @click="onClick" >Get Bluetooth</button>
      <button @click="moveRed" >move red</button>
      <button v-if="red.position == 50" @click="boostRed">Speed bonus</button>
      <button @click="slowRed">Speed bump</button>
      <div class="track">
        <div class="red" :style="{'margin-left': red.position+ '%'}"></div>
      </div>
      <div v-if="winner">You Won</div>
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  data() {
    return {
      red: {
        position: 0,
        resistance: 10,
      },
      winner: false,
    };
  },
  methods: {
    moveRed() {
      if (this.red.position < 100) {
        this.red.position += this.red.resistance;
      }
    },
    boostRed() {
      this.red.resistance = 20;
      setTimeout(() => {
        this.red.resistance = 10;
      }, 5000);
    },
    slowRed() {
      this.red.resistance = 5;
      setTimeout(() => {
        this.red.resistance = 10;
      }, 5000);
    },
    onClick() {
      navigator.bluetooth.requestDevice({
        filters: [
          {
            services: [
              'generic_access',
              'alert_notification',
              'automation_io',
              'battery_service',
              'blood_pressure',
              'body_composition',
              'bond_management',
              'continuous_glucose_monitoring',
              'current_time',
              'cycling_power',
              'cycling_speed_and_cadence',
              'device_information',
              'environmental_sensing',
              'fitness_machine',
              'generic_attribute',
              'glucose',
              'health_thermometer',
              'heart_rate',
              'http_proxy',
              'immediate_alert',
              'indoor_positioning',
              'internet_protocol_support',
              'link_loss',
              'location_and_navigation',
              'mesh_provisioning',
              'mesh_proxy',
              'next_dst_change',
              'object_transfer',
              'phone_alert_status',
              'pulse_oximeter',
              'reconnection_configuration',
              'reference_time_update',
              'running_speed_and_cadence',
              'scan_parameters',
              'transport_discovery',
              'tx_power',
              'user_data',
              'weight_scale',
            ],
          },
        ],
      })
        .then((device) => { console.log(device); return device.gatt.connect(); })
        .then((server) => { console.log(server); return server.getPrimaryServices(); })
        .then((services) => console.log(services))
        .catch((error) => console.log(error));
    },
  },
  watch: {
    'red.position': function (a) {
      if (a >= 100) {
        this.winner = true;
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
div.track {
  width: 100%;
  height: 10px;
}
.red{
  background-color:red;
  width: 1%;
  height: 100%;
}
</style>
