<template>
  <div class="row justify-content-center">
    <div class="my-2 text-center col-5">
      <form @submit="getPostsByQuery()" class="d-flex">
        <input v-model="search" type="text" class="form-control" placeholder="Search...">
        <button type="submit" class="btn btn-info"><i class="mdi mdi-magnify"></i></button>
      </form>
    </div>
  </div>
  <div v-if="account.id" class="mx-4 my-2 text-end">
    <button data-bs-toggle="modal" data-bs-target="#createPost" class="btn btn-warning">
      <i class="mdi mdi-pencil-plus"></i> Create Post</button>
  </div>
  <div v-for="(post, index) in posts">
    <PostCard :post="post" :index="index" />
    <AdCard v-if="index % 5 == 4" :index="index" />
  </div>
  <div class="row justify-content-center mb-2">
    <div class="col-6 d-flex justify-content-evenly">
      <button @click="getPostsByPage(prev)" class="btn btn-light" :disabled="!prev">Previous</button>
      <button @click="getPostsByPage(next)" class="btn btn-light" :disabled="!next">Next</button>
    </div>
  </div>

  <div class="modal fade" id="createPost" tabindex="-1" aria-labelledby="createModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createModal">Create Post</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="createPost()">
          <div class="modal-body">

            <div class="form-floating">
              <textarea v-model="editable.body" class="form-control" placeholder="Leave a comment here"
                id="floatingTextarea" required="true"></textarea>
              <label for="floatingTextarea">What's Going On?</label>
            </div>
            <input v-model="editable.imgUrl" class="form-control mt-3" placeholder="Image URL (Optional)" type="url">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Post</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue"
import { logger } from "../utils/Logger.js"
import Pop from "../utils/Pop.js"
import { postsService } from '../services/PostsService.js'
import { adsService } from "../services/AdsService.js"
import { AppState } from "../AppState.js"
import PostCard from '../components/PostCard.vue'
import AdCard from '../components/AdCard.vue'


export default {


  setup() {

    const editable = ref({})
    const search = ref()

    async function getPosts() {
      try {
        await postsService.getPosts()
      } catch (error) {
        logger.error(error)
        Pop.error(error.message)
      }
    }

    async function getBannerAds() {
      try {
        await adsService.getBannerAd()
      } catch (error) {
        Pop.error(error.message)
        logger.error(error)
      }
    }

    onMounted(() => {
      getPosts()
      getBannerAds()
    })
    return {
      posts: computed(() => AppState.posts),
      account: computed(() => AppState.account),
      prev: computed(() => AppState.prev),
      next: computed(() => AppState.next),
      editable,
      search,
      async createPost() {
        try {
          await postsService.createPost(editable.value)
          editable.value = {}
        } catch (error) {
          logger.error(error)
          Pop.error(error.message)
        }
      },
      async getPostsByPage(page) {
        try {
          const endpoint = page.slice(34)
          logger.log(endpoint)
          await postsService.getPostsByPage(endpoint)
        } catch (error) {
          logger.error(error)
          Pop.error(error.message)
        }
      },
      async getPostsByQuery() {
        try {
          await postsService.getPostsByQuery(search.value)
        } catch (error) {
          logger.error(error)
          Pop.error(error.message)
        }
      }
    }
  },
  components: { PostCard, AdCard }
}
</script>

<style scoped lang="scss">
.home {
  display: grid;
  height: 80vh;
  place-content: center;
  text-align: center;
  user-select: none;

  .home-card {
    width: 50vw;

    >img {
      height: 200px;
      max-width: 200px;
      width: 100%;
      object-fit: contain;
      object-position: center;
    }
  }
}
</style>