<template>
  <div class="container-fluid">
    <section class="m-0"
      :style="{ 'background-image': `url(${profile?.coverImg})`, 'background-repeat': 'no-repeat', 'background-size': 'cover', 'background-position': '50% 40%' }">


      <div class="p-5 d-flex position-relative">
        <img class="profile-picture" :src="profile?.picture" alt="">

        <h1 class="text ms-1 mb-5 align-self-center">
          <i :class="profile?.graduated ? 'verfied' : 'unverified'" class=" mdi mdi-school"> </i>
          {{ profile?.name }}
        </h1>
      </div>
      <div class="col-6 position-relative bio">
        <p class="text">class: {{ profile?.class }}</p>
        <h4 class="text ">{{ profile?.bio }}</h4>
        <p>
          <span v-if="profile?.github">
            <a :href="profile?.github"><i class="mdi mdi-github"></i></a>
          </span>
          <span v-if="profile?.linkedin">
            <a :href="profile?.linkedin"><i class="mdi mdi-linkedin"></i></a>
          </span>
          <span v-if="profile?.resume">
            <a :href="profile?.resume"><i class="mdi mdi-list-box"></i></a>
          </span>
        </p>
      </div>
      <div v-if="profile?.id == account.id" class="p-2 text-end">
        <button data-bs-toggle="modal" data-bs-target="#editProfile" class="btn btn-warning">Edit Profile</button>
      </div>
    </section>

    <div class="" v-for="(post, index) in posts">
      <PostCard :post="post" :index="index" />
    </div>
    <div class="row justify-content-center mb-2">
      <div class="col-6 d-flex justify-content-evenly">
        <button @click="getPostsByPage(prev)" class="btn btn-light" :disabled="!prev">Previous</button>
        <button @click="getPostsByPage(next)" class="btn btn-light" :disabled="!next">Next</button>
      </div>
    </div>

  </div>
  <div class="modal fade" id="editProfile" tabindex="-1" aria-labelledby="profileEdit" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="profileEdit">Update Profile</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="updateProfile()">
          <div class="modal-body">
            <div class="form-floating mb-3">
              <input v-model="editable.name" type="text" class="form-control" id="floatingInput">
              <label for="floatingInput">Name</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="editable.picture" type="text" class="form-control" id="floatingInput">
              <label for="floatingInput">Profile Picture Url</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="editable.bio" type="text" class="form-control" id="floatingInput">
              <label for="floatingInput">Bio</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="editable.coverImg" type="text" class="form-control" id="floatingInput">
              <label for="floatingInput">Cover Image</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="editable.github" type="text" class="form-control" id="floatingInput">
              <label for="floatingInput">Github</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="editable.linkedin" type="text" class="form-control" id="floatingInput">
              <label for="floatingInput">LinkedIn</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="editable.resume" type="text" class="form-control" id="floatingInput">
              <label for="floatingInput">Resume</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="editable.class" type="text" class="form-control" id="floatingInput">
              <label for="floatingInput">Class</label>
            </div>
            <input v-model="editable.graduated" type="checkbox" name="" id="graduated">
            <label class="px-2" for="graduated">Graduated</label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Update</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { onMounted, computed, ref } from "vue"
import { useRoute } from "vue-router"
import { profilesService } from "../services/ProfilesService.js"
import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import Pop from "../utils/Pop.js"
import PostCard from "../components/PostCard.vue"
import { postsService } from "../services/PostsService.js"

export default {
  setup() {
    // private variables and methods here
    const route = useRoute()
    const profileId = route.params.profileId
    const editable = ref({ ...AppState.profile })

    async function getProfileById() {
      try {
        await profilesService.getProfileById(profileId)
      } catch (error) {
        logger.error(error)
        Pop.error(error.message)
      }
    }

    async function getPostsByProfile() {
      try {
        await postsService.getPostsByProfile(profileId)
      } catch (error) {
        logger.error(error)
        Pop.error(error.message)
      }
    }


    onMounted(() => {
      getProfileById()
      getPostsByProfile()
    })
    return {
      editable,
      route,
      account: computed(() => AppState.account),
      profile: computed(() => AppState.profile),
      posts: computed(() => AppState.posts),
      prev: computed(() => AppState.prev),
      next: computed(() => AppState.next),
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
      async updateProfile() {
        try {
          await profilesService.updateProfile(route.params.profileId, editable.value)
        } catch (error) {
          logger.error(error)
          Pop.error(error.message)
        }
      }
      // public variables and methods here
    }
  },
  components: { PostCard }
}
</script>

<style scoped>
.profile-picture {
  height: 17vh;
  width: 17vh;
  object-fit: cover;
  border-radius: 42%;
  border: solid 1px rgba(20, 20, 20, 0.29);
  box-shadow: 0px 0px 10px rgba(42, 42, 42, 0.515);
}

.cover-img {
  position: absolute;
  height: 30vh;
  min-width: 81vw;
  top: -48px;
  left: -24px;
  object-fit: cover;
  object-position: center;
}

.bio {
  bottom: 6vw;
  left: 25%;
}

.text {
  color: aliceblue;
  text-shadow: 3px 2px 7px black;
}

.verfied {
  color: white;
  background-color: #42a5f5;
  text-shadow: none;
  border: solid 2px #42a5f5;
  border-radius: 50%;
  padding-left: 3.5px;
  padding-right: 3.5px;
}

.unverified {
  color: #ffffff00 !important;
  text-shadow: none;
  border: solid 2px #ffffff00;
  padding-left: 3.5px;
  padding-right: 3.5px;
}
</style>