<template>
  <div class="bg-white m-2 elevation-5 rounded">
    <div class="row">
      <div class="col-12">
        <div class="p-3 d-flex">
          <router-link :to="{ name: 'Profile', params: { profileId: post.creatorId } }">
            <img class="profile-picture" :src="post?.creator.picture" alt="">
          </router-link>
          <div class="d-block ms-3 mt-3">
            <h6 class=""><i :class="post?.creator.graduated ? 'verfied' : 'unverified'" class=" mdi mdi-school"> </i> {{
              post?.creator.name }}
            </h6>
            <p class="ms-4 time-text">{{ newTime }}</p>
            <!-- <span v-if="post?.createdAt != post?.updatedAt">(edited)</span> -->
          </div>
        </div>
      </div>

    </div>

    <div class="row">
      <div class="mx-5 py-1 col">
        <p>{{ post?.body }}</p>
        <div class="row justify-content-between">
          <div @click="likePost(post?.id)" class="col-1 text-center align-content-center">
            <button class="btn btn-light fs-5">{{ post?.likes.length }}
              <i class="mdi" :class="post?.likeIds.includes(account.id)
                ? 'mdi-heart text-danger'
                : 'mdi-heart-outline'">
              </i>
            </button>
          </div>
          <div v-if="post?.creatorId == account.id" class="col-3 justify-content-evenly d-flex">
            <button data-bs-toggle="modal" :data-bs-target="'#editPost' + index" class="btn btn-light">Edit</button>
            <button @click="deletePost(post?.id)" class="btn btn-danger">Delete</button>
          </div>

        </div>

      </div>
      <div class="">
        <img class=" rounded-bottom img-fluid" :src="post?.imgUrl" alt="">
      </div>
    </div>
  </div>

  <div class="modal fade" :id="'editPost' + index" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editModal">Edit Post</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="editPost(post?.id)">
          <div class="modal-body">
            <div class="form-floating">
              <textarea v-model="editable.body" class="form-control" id="floatingTextarea" required="true"></textarea>
              <label for="floatingTextarea">What's Going On?</label>
            </div>
            <input v-model="editable.imgUrl" class="form-control mt-3" placeholder="Image URL (Optional)" type="url">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Edit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue"
import { Post } from "../models/Post.js"
import { format } from 'timeago.js'
import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import Pop from "../utils/Pop.js"
import { postsService } from "../services/PostsService.js"

export default {
  props: {
    post: {
      type: Post,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const editable = ref({ ...props.post })
    // private variables and methods here
    return {
      newTime: format(props.post.createdAt),
      account: computed(() => AppState.account),
      editable,

      async likePost(postId) {
        if (this.account.id) {
          try {
            await postsService.likePost(postId)
          } catch (error) {
            logger.error(error.message)
            Pop.error(error)
          }
        }
        else {
          Pop.toast('You must be logged in to like a post')
        }
      },

      async editPost(postId) {
        try {
          await postsService.editPost(postId, editable.value)
          editable.value = { ...props.post }
        } catch (error) {
          logger.error(error.message)
          Pop.error(error)
        }
      },

      async deletePost(postId) {
        try {
          if (await Pop.confirm('are you sure', "this can't be undone"))
            await postsService.deletePost(postId)
        } catch (error) {
          logger.error(error)
          Pop.error(error.message)
        }
      }
      // public variables and methods here
    }
  },
}
</script>

<style scoped>
.profile-picture {
  height: 9vh;
  width: 9vh;
  object-fit: cover;
  border-radius: 42%;
  border: solid 1px rgba(20, 20, 20, 0.29);
  box-shadow: 0px 0px 10px rgba(42, 42, 42, 0.515);
}

img {
  max-height: 60vh;
}

.time-text {
  color: rgb(145, 145, 145);
  padding-left: 5px;
}

.verfied {
  color: white;
  background-color: #42a5f5;
  border: solid 2px #42a5f5;
  border-radius: 50%;
  padding-left: 1.5px;
  padding-right: 1.5px;
}

.unverified {
  color: #ffffff00;
  border: solid 2px #ffffff00;
  padding-left: 1.5px;
  padding-right: 1.5px;
}
</style>