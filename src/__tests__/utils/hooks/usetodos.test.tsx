import { act, renderHook, waitFor } from '@testing-library/react'
import { useTodos } from '../../../utils/hooks/useTodos'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { mockAllActiveTodos, mockAllCompletedTodos, mockTodos } from '../../../utils/mocks/todos'
import Api from '../../../utils/api/todos'

const queryClient = new QueryClient()
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('Custom Hook useTodos should', () => {
  test('have an empty array as initial value of todos', async () => {
    const spyFetchTodos = jest.spyOn(Api, 'fetchTodos').mockResolvedValue(undefined)
    renderHook(() => useTodos('all'), { wrapper })

    await waitFor(() => {
      expect(spyFetchTodos).toBeCalledTimes(1)
    })
  })

  test('save a todo given a title', async () => {
    const spyCreateTodo = jest.spyOn(Api, 'createTodo').mockResolvedValue(undefined)
    const { result } = renderHook(() => useTodos('all'), { wrapper })
    act(() => {
      result.current.saveTodo('Hello')
    })

    await waitFor(() => {
      expect(spyCreateTodo).toBeCalledTimes(1)
      expect(spyCreateTodo).toBeCalledWith('Hello')
    })
  })

  test('remove a todo with the id', async () => {
    const id = '627ccf8e-96cf-4607-80a5-22b01a35c7eb'
    const spyRemoveTodo = jest.spyOn(Api, 'deleteTodo').mockResolvedValue(undefined)
    const { result } = renderHook(() => useTodos('all'), { wrapper })

    act(() => {
      result.current.removeTodo(id)
    })
    await waitFor(() => {
      expect(spyRemoveTodo).toBeCalledTimes(1)
      expect(spyRemoveTodo).toBeCalledWith(id)
    })
  })

  test.each`
    filter         | todos
    ${'all'}       | ${mockTodos}
    ${'active'}    | ${mockAllActiveTodos}
    ${'completed'} | ${mockAllCompletedTodos}
  `('return expected todos given the filter $filter', async ({ filter, todos }) => {
    jest.spyOn(Api, 'fetchTodos').mockResolvedValue(todos)
    const { result } = renderHook(() => useTodos(filter), { wrapper })

    await waitFor(() => expect(result.current.todos).toEqual(todos))
  })

  test('return an object with the counts of 3 types of todos', async () => {
    jest.spyOn(Api, 'fetchTodos').mockResolvedValue(mockTodos)
    const { result } = renderHook(() => useTodos('all'), { wrapper })

    await waitFor(() => expect(result.current.count).toEqual({ all: 3, active: 2, completed: 1 }))
  })

  test.each`
    todos                    | status           | expectValue
    ${mockTodos}             | ${'uncompleted'} | ${false}
    ${mockAllCompletedTodos} | ${'completed'}   | ${true}
  `('allTodosCompleted return $expectValue given $status list', async ({ todos, expectValue }) => {
    jest.spyOn(Api, 'fetchTodos').mockResolvedValue(todos)
    const { result } = renderHook(() => useTodos('all'), { wrapper })

    await waitFor(() => expect(result.current.allTodosCompleted).toBe(expectValue))
  })

  test('edit a title todo given the setTitle method', async () => {
    const spyPartiallyUpdate = jest.spyOn(Api, 'updatePartiallyTodo').mockResolvedValue(undefined)
    const { result } = renderHook(() => useTodos('all'), { wrapper })

    act(() => {
      result.current.setTitle({ id: '627ccf8e-96cf-4607-80a5-22b01a35c7eb', title: 'goodjob' })
    })

    await waitFor(() => {
      expect(spyPartiallyUpdate).toBeCalledTimes(1)
      expect(spyPartiallyUpdate).toBeCalledWith({
        id: '627ccf8e-96cf-4607-80a5-22b01a35c7eb',
        title: 'goodjob',
      })
    })
  })

  test('edit a completed todo given the setCompleted method', async () => {
    const spyPartiallyUpdate = jest.spyOn(Api, 'updatePartiallyTodo').mockResolvedValue(undefined)
    const { result } = renderHook(() => useTodos('all'), { wrapper })

    act(() => {
      result.current.setCompleted({ id: '627ccf8e-96cf-4607-80a5-22b01a35c7eb', completed: true })
    })

    await waitFor(() => {
      expect(spyPartiallyUpdate).toBeCalledTimes(1)
      expect(spyPartiallyUpdate).toBeCalledWith({
        id: '627ccf8e-96cf-4607-80a5-22b01a35c7eb',
        completed: true,
      })
    })
  })

  test('remove all completed todos of the list given the changeAllCompletedTodo method', async () => {
    const spyDeleteTodos = jest.spyOn(Api, 'deleteTodos').mockResolvedValue(undefined)
    const { result } = renderHook(() => useTodos('all'), { wrapper })

    act(() => {
      result.current.clearCompleted()
    })

    await waitFor(() => {
      expect(spyDeleteTodos).toBeCalledTimes(1)
      expect(spyDeleteTodos).toBeCalledWith(true)
    })
  })

  test.each`
    value    | todos
    ${false} | ${mockAllCompletedTodos}
    ${false} | ${mockAllActiveTodos}
  `(
    'edit all completed status to true of todos given the changeAllCompleted method',
    async ({ value, todos }) => {
      jest.spyOn(Api, 'fetchTodos').mockResolvedValue(todos)
      const spyUpdatePartiallyTodo = jest
        .spyOn(Api, 'updatePartiallyTodo')
        .mockResolvedValue(undefined)

      const { result } = renderHook(() => useTodos('all'), { wrapper })

      act(() => {
        result.current.changeAllCompletedTodo(value)
      })

      await waitFor(() => expect(spyUpdatePartiallyTodo).toBeCalledTimes(3))
    },
  )
})
