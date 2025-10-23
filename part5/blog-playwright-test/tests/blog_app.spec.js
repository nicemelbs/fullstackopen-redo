import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })
    await page.goto('/')
  })

  test('home page displays log in form by default', async ({ page }) => {
    await expect(page.getByRole('heading')).toContainText('Log in')
  })

  test.describe('Logging in', async () => {
    test('succeeds with valid credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.locator('#root')).toContainText(
        'Welcome back, Matti Luukkainen'
      )
    })

    test('fails with invalid credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrongpassword')
      const notificationContainer = page.locator('.notification')
      await expect(notificationContainer).toBeVisible()
      await expect(notificationContainer).toHaveText(
        'invalid username or password'
      )
    })
  })

  test.describe('when logged in', async () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a blog can be added', async ({ page }) => {
      const title = 'Fantastic Beasts and Where to Find Them'
      const author = 'Newt Scamander'
      const url = 'http://pottermore.com'
      await createBlog(page, title, author, url)

      const postedTitle = page.locator('.blog-title')
      const postedAuthor = page.locator('.blog-author')
      await expect(postedTitle).toHaveText(title)
      await expect(postedAuthor).toHaveText(author)
    })

    test('a blog can be liked', async ({ page }) => {
      const title = 'Fantastic Beasts and Where to Find Them'
      const author = 'Newt Scamander'
      const url = 'http://pottermore.com'
      await createBlog(page, title, author, url)

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-likes')).toHaveText('likes 1')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-likes')).toHaveText('likes 2')
    })

    test('a blog can be deleted by the user who added it', async ({ page }) => {
      const title = 'This Blog Will Be Deleted'
      const author = 'Who am I even'
      const url = 'http://doesnotexist.com'
      await createBlog(page, title, author, url)

      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain(
          `Are you sure you want to delete ${title} by ${author}?`
        )
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'delete' }).click()

      const postedTitle = page.locator('.blog-title')
      const postedAuthor = page.locator('.blog-author')
      await expect(postedTitle).toHaveCount(0)
      await expect(postedAuthor).toHaveCount(0)
    })

    test('only the user who posted the blog can see the delete button', async ({
      page,
      request,
    }) => {
      const title = 'This is owned by mluukkai'
      const author = 'Douglas Judy'
      const url = 'http://brooklyn99.com'

      await createBlog(page, title, author, url)
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(1)
      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('/api/users', {
        data: {
          name: 'Capt. Raymond Holt',
          username: 'rjholt',
          password: 'crjholt',
        },
      })

      await loginWith(page, 'rjholt', 'crjholt')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(0)
    })
  })

  test('blogs are sorted by likes, descending', async ({ page, request }) => {
    await loginWith(page, 'mluukkai', 'salainen')

    await createBlog(
      page,
      'Zero Likes',
      'author:nolikes',
      'http://zerolikes.com'
    )
    await createBlog(page, 'One Like', 'author:onelike', 'http://onelikes.com')
    await createBlog(
      page,
      'Five Likes',
      'author:fivelikes',
      'http://fivelikes.com'
    )

    const fiveLikes = page
      .getByRole('listitem')
      .filter({ hasText: 'Five Likes' })
    const oneLike = page.getByRole('listitem').filter({ hasText: 'One Like' })
    const zeroLikes = page
      .getByRole('listitem')
      .filter({ hasText: 'Zero Likes' })

    await fiveLikes.getByRole('button', { name: 'view' }).click()
    await oneLike.getByRole('button', { name: 'view' }).click()
    await zeroLikes.getByRole('button', { name: 'view' }).click()

    await oneLike.getByRole('button', { name: 'like' }).click()
    await page.waitForTimeout(500)
    await fiveLikes.getByRole('button', { name: 'like' }).click()
    await page.waitForTimeout(500)
    await fiveLikes.getByRole('button', { name: 'like' }).click()
    await page.waitForTimeout(500)
    await fiveLikes.getByRole('button', { name: 'like' }).click()
    await page.waitForTimeout(500)
    await fiveLikes.getByRole('button', { name: 'like' }).click()
    await page.waitForTimeout(500)
    await fiveLikes.getByRole('button', { name: 'like' }).click()
    await page.waitForTimeout(500)

    expect(page.locator('.blog-title').first()).toHaveText('Five Likes')
    expect(page.locator('.blog-title').nth(1)).toHaveText('One Like')
    expect(page.locator('.blog-title').last()).toHaveText('Zero Likes')
  })
})
