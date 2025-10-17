const _ = require('lodash')
const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((a, b) => {
    return a + b.likes
  }, 0)
}

//return blog with most likes. if there are more than 1 with most blogs, just return one
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let maxIndex = 0
  blogs.forEach((blog, index) => {
    if (blogs[maxIndex].likes < blog.likes) maxIndex = index
  })

  return blogs[maxIndex]
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorAndBlogCount = _.countBy(blogs, 'author')

  const arr = Object.keys(authorAndBlogCount).map((key) => {
    return { author: key, blogs: authorAndBlogCount[key] }
  })
  let maxIndex = 0
  arr.forEach((obj, index) => {
    if (arr[maxIndex].blogs < obj.blogs) maxIndex = index
  })

  return arr[maxIndex]
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const group = _.groupBy(blogs, 'author')
  const arr = Object.keys(group).map((key) => {
    return { author: key, values: group[key] }
  })

  const authorLikes = arr.map((obj) => {
    return {
      author: obj.author,
      likes: obj.values.reduce((a, b) => a + b.likes, 0),
    }
  })

  let maxIndex = 0

  authorLikes.forEach((author, index) => {
    if (authorLikes[maxIndex].likes < author.likes) maxIndex = index
  })

  return authorLikes[maxIndex]
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
