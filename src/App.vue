<template>
  <v-app>
    <v-app-bar app color="warning" dark>
      <div class="d-flex align-center">
        <h2>Отказы СИКН</h2>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import SiknFailures from "./components/SiknFailures.vue";

export default {
  name: "App",

  components: {
    SiknFailures,    
  },

  data: () => ({
    //
  }),
};
</script>
