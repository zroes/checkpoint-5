export class Post {
  constructor(data) {
    this.id = data.id
    this.body = data.body
    this.creatorId = data.creatorId
    this.createdAt = new Date(data.createdAt).toLocaleString()
    this.updatedAt = new Date(data.updatedAt).toLocaleString()
    // this.createdAt = data.createdAt
    // this.updatedAt = data.updatedAt
    this.imgUrl = data.imgUrl
    this.likeIds = data.likeIds
    this.likes = data.likes
    this.creator = data.creator
  }
}