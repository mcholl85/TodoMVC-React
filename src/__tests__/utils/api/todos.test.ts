import Api from '../../../utils/api/todos'
import { BASE_URL } from '../../../utils/api/todos.constants'
import { mockPartialTodo, mockTodo } from '../../../utils/mocks/todos'

describe('Api', () => {
  let fetchSpy: jest.SpyInstance

  beforeEach(() => {
    fetchSpy = (jest.spyOn(global, 'fetch') as jest.SpyInstance).mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    })
  })

  afterEach(() => {
    fetchSpy.mockRestore()
  })

  describe('fetchTodos', () => {
    it('should call fetch with correct url', async () => {
      await Api.fetchTodos()

      expect(fetchSpy).toHaveBeenCalledWith(BASE_URL)
    })

    it('should return a JSON response', async () => {
      const response = await Api.fetchTodos()

      expect(response).toEqual({})
    })
  })

  describe('createTodo', () => {
    it('should call fetch with correct url and options', async () => {
      const title = 'A new todo'

      await Api.createTodo(title)

      expect(fetchSpy).toHaveBeenCalledWith(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
        }),
      })
    })

    it('should return a JSON response', async () => {
      const response = await Api.createTodo('A new todo')

      expect(response).toEqual({})
    })
  })

  describe('updateTodo', () => {
    it('should call fetch with correct url and options', async () => {
      const { id, ...body } = mockTodo
      await Api.updateTodo(mockTodo)

      expect(fetchSpy).toHaveBeenCalledWith(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    })

    it('should return a JSON response', async () => {
      const response = await Api.updateTodo(mockTodo)

      expect(response).toEqual({})
    })
  })
  describe('updatePartiallyTodo', () => {
    it('should call fetch with correct url and options', async () => {
      const { id, ...body } = mockPartialTodo

      await Api.updatePartiallyTodo(mockPartialTodo)

      expect(fetchSpy).toHaveBeenCalledWith(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    })

    it('should return a JSON response', async () => {
      const response = await Api.updatePartiallyTodo(mockPartialTodo)

      expect(response).toEqual({})
    })
  })
  describe('deleteTodo', () => {
    it('should call fetch with correct url and options', async () => {
      const id = '1'

      await Api.deleteTodo(id)

      expect(fetchSpy).toHaveBeenCalledWith(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      })
    })
  })
  describe('deleteTodos', () => {
    it.each`
      completed
      ${true}
      ${false}
    `('should call fetch with correct url and options', async ({ completed }) => {
      await Api.deleteTodos(completed)

      expect(fetchSpy).toHaveBeenCalledWith(`${BASE_URL}?completed=${completed}`, {
        method: 'DELETE',
      })
    })
  })
})
