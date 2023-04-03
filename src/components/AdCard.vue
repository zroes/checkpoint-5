<template>
  <div class="bg-white m-2 elevation-5 rounded">
    <a target="_blank" :href="'https://' + bannerAds[0].linkURL">
      <img class="rounded" :src="bannerAds[(index - 4) / 5].banner" alt="">
    </a>
  </div>
</template>

<script>
import { computed, onMounted } from "vue"
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { adsService } from "../services/AdsService.js"
import { AppState } from "../AppState.js"

export default {
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  setup() {
    // private variables and methods here

    return {
      bannerAds: computed(() => AppState.bannerAds)
      // public variables and methods here
    }
  },
}
</script>

<style>
img {
  width: 100%;
}
</style>