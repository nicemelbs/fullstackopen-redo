import { useState } from 'react'
const Blog = ({ blog, handleLike, handleDelete }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const deleteButtonVisible =
    JSON.parse(window.localStorage.getItem('loggedInUser')).username ===
    blog.user.username
  return (
    <div className="blog">
      <span className="blog-title">{blog.title}</span> by{' '}
      <span className="blog-author">{blog.author}</span>
      <button onClick={() => setDetailsVisible(!detailsVisible)}>
        {detailsVisible ? 'hide' : 'view'}
      </button>
      {detailsVisible && (
        <div>
          <a target="_blank" href={blog.url}>
            {blog.url}
          </a>
          <br />
          likes {blog.likes}{' '}
          <button onClick={() => handleLike(blog)}>like</button>
          <br />
          {blog.user.name}
          <br />
          {deleteButtonVisible && (
            <button onClick={() => handleDelete(blog)}>delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
