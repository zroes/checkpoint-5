import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"
import { Post } from "../models/Post.js"

class PostsService {

  async getPosts() {
    AppState.posts = null
    const res = await api.get('api/posts')
    logger.log(res.data)
    AppState.posts = res.data.posts.map(post => new Post(post))
    AppState.next = res.data.older
    AppState.prev = res.data.newer
    logger.log('[GETTING POSTS]', AppState.posts)
  }

  async getPostsByProfile(profileId) {
    AppState.posts = null
    const res = await api.get('api/posts?creatorId=' + profileId)
    AppState.posts = res.data.posts.map(post => new Post(post))
    AppState.next = res.data.older
    AppState.prev = res.data.newer
    logger.log('[GETTING PROFILE POSTS]', AppState.posts)
  }

  async getPostsByPage(endpoint) {
    AppState.posts = null
    const res = await api.get(endpoint)
    AppState.posts = res.data.posts.map(post => new Post(post))
    AppState.next = res.data.older
    AppState.prev = res.data.newer
    logger.log('[Changing page]', res.data)
  }

  async getPostsByQuery(search) {
    AppState.posts = null
    const res = await api.get('api/posts?query=' + search.replace(' ', '+'))
    AppState.posts = res.data.posts.map(post => new Post(post))
    AppState.next = res.data.older
    AppState.prev = res.data.newer
    logger.log(res.data)
  }

  async createPost(postData) {
    const res = await api.post('api/posts', postData)
    logger.log('[Making new Post]', res.data)
    this.getPosts()
  }

  async likePost(postId) {
    const res = await api.post(`api/posts/${postId}/like`)
    logger.log(res.data)
    const foundPost = AppState.posts.find(p => p.id == postId)
    foundPost.likes = res.data.likes
  }

  async editPost(postId, postData) {
    const res = await api.put(`api/posts/${postId}`, postData)
    logger.log('[EDITING POST]', res.data)
    this.getPosts()
  }

  async deletePost(postid) {
    const res = await api.delete('api/posts/' + postid)
    logger.log('[DELETING POST]', res.data)
    this.getPosts()
  }
}

export const postsService = new PostsService()