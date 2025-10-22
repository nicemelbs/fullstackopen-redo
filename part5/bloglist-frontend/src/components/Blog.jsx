import { useState } from 'react'
const Blog = ({ blog, handleLike, handleDelete }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const currentUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
  const deleteButtonVisible =
    currentUser && currentUser.username === blog.user.username
  return (
    <div className="blog">
      <span className="blog-title">{blog.title}</span> by{' '}
      <span className="blog-author">{blog.author}</span>
      <button onClick={() => setDetailsVisible(!detailsVisible)}>
        {detailsVisible ? 'hide' : 'view'}
      </button>
      {detailsVisible && (
        <div>
          <a className="blog-url" target="_blank" href={blog.url}>
            {blog.url}
          </a>
          <br />
          <span className="blog-likes">likes {blog.likes}</span>
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
