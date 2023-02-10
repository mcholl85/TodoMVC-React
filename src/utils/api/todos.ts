import { BASE_URL } from './todos.constants'

type Todo = {
  id: string
  title: string
  completed: boolean
  order: number
}

export const fetchTodos = async () => {
  const response = await fetch(BASE_URL)
  return await response.json()
}

export const createTodo = async (title: string) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
    }),
  })
  return await response.json()
}

export const updateTodo = async ({ id, title, completed, order }: Todo) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      completed: completed,
      order: order,
    }),
  })
  return await response.json()
}

export const updatePartiallyTodo = async ({ id, title, completed, order }: Partial<Todo>) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      completed: completed,
      order: order,
    }),
  })
  return await response.json()
}

export const deleteTodo = async (id: string) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
}

export const deleteTodos = async (completed: boolean) => {
  await fetch(`${BASE_URL}?completed=${completed}`, {
    method: 'DELETE',
  })
}
