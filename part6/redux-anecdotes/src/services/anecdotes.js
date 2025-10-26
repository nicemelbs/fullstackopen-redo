const baseUrl = 'http://localhost:3001/anecdotes'
const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) throw new Error('Failed to fetch notes')

  return await response.json()
}

const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })

  if (!response.ok) throw new Error('Failed to create blog')

  return await response.json()
}

const voteFor = async (content) => {
  const id = content.id
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...content, votes: content.votes + 1 }),
  })

  if (!response.ok) throw new Error('Failed to update')

  return await response.json()
}

export default { getAll, createNew, voteFor }
