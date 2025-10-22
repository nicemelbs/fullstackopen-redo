import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

let blogComponent = null
const handleLike = vi.fn()
describe('renders content', () => {
  beforeEach(() => {
    const blog = {
      title: 'Somewhere I Belong',
      author: 'Michael Shinoda',
      url: 'https://linkin.park',
      likes: 25,
      user: { username: 'cbennington', name: 'Chester Bennington' },
    }

    blogComponent = <Blog blog={blog} handleLike={handleLike} />
  })

  test('author and title are displayed by default. url and likes are hidden', () => {
    const { container } = render(blogComponent)
    const title = container.querySelector('.blog-title')
    expect(title).toHaveTextContent('Somewhere I Belong')
    const author = container.querySelector('.blog-author')
    expect(author).toHaveTextContent('Michael Shinoda')

    const url = container.querySelector('.blog-url')
    expect(url).toBeNull()
    const likes = container.querySelector('.blog-likes')
    expect(likes).toBeNull()
  })

  test('url and likes are shown when the button is clicked', async () => {
    const { container } = render(blogComponent)
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    const url = container.querySelector('.blog-url')
    expect(url).toBeNull()
    const likes = container.querySelector('.blog-likes')
    expect(likes).toBeNull()

    await user.click(viewButton)
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('when the like button is clicked twice, the event handler is called twice', async () => {
    render(blogComponent)
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(handleLike.mock.calls).toHaveLength(2)
  })
})
