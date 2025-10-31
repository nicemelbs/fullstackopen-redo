import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

//The test should check, that the form calls the event handler it received as props with the right details when a new blog is created.

test('<CreateBlogForm /> ', async () => {
  const handleCreateBlog = vi.fn()
  const user = userEvent.setup()

  render(<CreateBlogForm handleCreateBlog={handleCreateBlog} />)

  const title = screen.getByLabelText('title')
  const author = screen.getByLabelText('author')
  const url = screen.getByLabelText('URL')
  const saveButton = screen.getByText('post')

  await user.type(title, 'We are testing the blog creation form')
  await user.type(author, 'Michael Realman')
  await user.type(url, 'https://thegoodplace.com')
  await user.click(saveButton)

  expect(handleCreateBlog.mock.calls).toHaveLength(1)
  expect(handleCreateBlog.mock.calls[0][0].title).toBe(
    'We are testing the blog creation form'
  )
  expect(handleCreateBlog.mock.calls[0][0].author).toBe('Michael Realman')
  expect(handleCreateBlog.mock.calls[0][0].url).toBe('https://thegoodplace.com')
})
