import { BASE_URL } from '../api/todos.constants'

type Todo = {
  id: string
  title: string
  completed: boolean
  order: number
}

export default class Api {
  static fetchTodos = async () => {
    const response = await fetch(BASE_URL)
    return await response.json()
  }

  static createTodo = async (title: string) => {
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

  static updateTodo = async ({ id, title, completed, order }: Todo) => {
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

  static updatePartiallyTodo = async ({ id, title, completed, order }: Partial<Todo>) => {
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

  static deleteTodo = async (id: string) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
  }

  static deleteTodos = async (completed: boolean) => {
    await fetch(`${BASE_URL}?completed=${completed}`, {
      method: 'DELETE',
    })
  }
}
