<template>
  <header class="sticky-top">
    <Navbar />
  </header>

  <main>
    <div class="row m-0">

      <div class="col-10">
        <router-view />
      </div>
      <div class="col-2">
        <div class="position-fixed">

          <img class="ad" :src="appState.sidebarAds[0]?.tall" alt="">
          <img class="ad" :src="appState.sidebarAds[1]?.tall" alt="">
        </div>
      </div>
    </div>
  </main>
  <footer class="bg-primary text-light">
    Made 😎 by me
  </footer>
</template>

<script>
import { computed, onMounted } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'
import Pop from "./utils/Pop.js"
import { logger } from "./utils/Logger.js"
import { adsService } from "../src/services/AdsService.js"

export default {
  setup() {

    async function getSidebarAds() {
      try {
        await adsService.getSidebarAds()
      } catch (error) {
        Pop.error(error.message)
        logger.error(error)
      }
    }

    onMounted(() => getSidebarAds())
    return {
      appState: computed(() => AppState)
    }
  },
  components: { Navbar }
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";

:root {
  --main-height: calc(100vh - 32px - 64px);
}

.ad {
  margin-top: 6.5%;
  width: 80%;
  object-fit: cover;
  border-radius: 6%;
}

footer {
  display: grid;
  place-content: center;
  height: 32px;
}
</style>
