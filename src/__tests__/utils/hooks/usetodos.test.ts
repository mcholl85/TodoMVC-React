import { act, renderHook } from '@testing-library/react'
import { useTodos } from '../../../utils/hooks/useTodos'

const mockAllTodos = [
  {
    id: '627ccf8e-96cf-4607-80a5-22b01a35c7eb',
    title: 'test',
    completed: false,
  },
  {
    id: 'a4ffab12-209b-4007-acc5-9b21119d858d',
    title: 'hello',
    completed: true,
  },
  {
    id: '543aa59f-ed63-49d4-9d83-dbf38586ff46',
    title: 'world',
    completed: false,
  },
]

const mockAllCompletedTodos = [
  {
    id: '627ccf8e-96cf-4607-80a5-22b01a35c7eb',
    title: 'test',
    completed: true,
  },
  {
    id: 'a4ffab12-209b-4007-acc5-9b21119d858d',
    title: 'hello',
    completed: true,
  },
  {
    id: '543aa59f-ed63-49d4-9d83-dbf38586ff46',
    title: 'world',
    completed: true,
  },
]

const mockAllUncompletedTodos = [
  {
    id: '627ccf8e-96cf-4607-80a5-22b01a35c7eb',
    title: 'test',
    completed: false,
  },
  {
    id: 'a4ffab12-209b-4007-acc5-9b21119d858d',
    title: 'hello',
    completed: false,
  },
  {
    id: '543aa59f-ed63-49d4-9d83-dbf38586ff46',
    title: 'world',
    completed: false,
  },
]

const mockCompletedTodos = [
  {
    id: 'a4ffab12-209b-4007-acc5-9b21119d858d',
    title: 'hello',
    completed: true,
  },
]

const mockActiveTodos = [
  {
    id: '627ccf8e-96cf-4607-80a5-22b01a35c7eb',
    title: 'test',
    completed: false,
  },
  {
    id: '543aa59f-ed63-49d4-9d83-dbf38586ff46',
    title: 'world',
    completed: false,
  },
]

describe('Custom Hook useTodos should', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  test('have an empty array as initial value of todos', () => {
    const { result } = renderHook(() => useTodos('all'))

    expect(result.current.todos).toEqual([])
  })

  test.each`
    title
    ${'test'}
    ${'hello'}
    ${'world'}
  `('save a todo with $title title into todos', ({ title }) => {
    const { result } = renderHook(() => useTodos('all'))

    act(() => {
      result.current.saveTodo(title)
    })

    expect(result.current.todos).toEqual([{ id: expect.any(String), title, completed: false }])
  })

  test('remove a todo with the id', () => {
    localStorage.setItem('todos-[react]', JSON.stringify(mockAllTodos))
    const { result } = renderHook(() => useTodos('all'))

    act(() => {
      result.current.removeTodo('627ccf8e-96cf-4607-80a5-22b01a35c7eb')
    })

    expect(result.current.todos).toEqual([
      {
        id: 'a4ffab12-209b-4007-acc5-9b21119d858d',
        title: 'hello',
        completed: true,
      },
      {
        id: '543aa59f-ed63-49d4-9d83-dbf38586ff46',
        title: 'world',
        completed: false,
      },
    ])
  })
  test.each`
    filter         | todos
    ${'all'}       | ${mockAllTodos}
    ${'active'}    | ${mockActiveTodos}
    ${'completed'} | ${mockCompletedTodos}
  `('return expected todos given the filter $filter', ({ filter, todos }) => {
    localStorage.setItem('todos-[react]', JSON.stringify(todos))
    const { result } = renderHook(() => useTodos(filter))

    expect(result.current.todos).toEqual(todos)
  })
  test('return an object with the counts of 3 types of todos', () => {
    localStorage.setItem('todos-[react]', JSON.stringify(mockAllTodos))
    const { result } = renderHook(() => useTodos('all'))

    expect(result.current.count).toEqual({ all: 3, active: 2, completed: 1 })
  })
  test.each`
    todos                    | status           | expectValue
    ${mockAllTodos}          | ${'uncompleted'} | ${false}
    ${mockAllCompletedTodos} | ${'completed'}   | ${true}
  `('allTodosCompleted return $expectValue given $status list', ({ todos, expectValue }) => {
    localStorage.setItem('todos-[react]', JSON.stringify(todos))
    const { result } = renderHook(() => useTodos('all'))

    expect(result.current.allTodosCompleted).toBe(expectValue)
  })
  test('edit a title todo given the setTitle method', () => {
    localStorage.setItem('todos-[react]', JSON.stringify(mockAllTodos))
    const { result } = renderHook(() => useTodos('all'))

    act(() => {
      result.current.setTitle('627ccf8e-96cf-4607-80a5-22b01a35c7eb', 'goodjob')
    })

    expect(result.current.todos[0].title).toBe('goodjob')
  })
  test('edit a completed todo given the setCompleted method', () => {
    localStorage.setItem('todos-[react]', JSON.stringify(mockAllTodos))
    const { result } = renderHook(() => useTodos('all'))

    act(() => {
      result.current.setCompleted('627ccf8e-96cf-4607-80a5-22b01a35c7eb', true)
    })

    expect(result.current.todos[0].completed).toBe(true)
  })
  test('remove all completed todos of the list given the changeAllCompletedTodo method', () => {
    localStorage.setItem('todos-[react]', JSON.stringify(mockAllTodos))
    const { result } = renderHook(() => useTodos('all'))

    act(() => {
      result.current.clearCompleted()
    })

    expect(result.current.todos).toEqual(mockActiveTodos)
  })
  test.each`
    value    | expectedValue
    ${true}  | ${mockAllCompletedTodos}
    ${false} | ${mockAllUncompletedTodos}
  `(
    'edit all completed status to $value of todos given the changeAllCompleted method',
    ({ value, expectedValue }) => {
      localStorage.setItem('todos-[react]', JSON.stringify(mockAllTodos))
      const { result } = renderHook(() => useTodos('all'))

      act(() => {
        result.current.changeAllCompletedTodo(value)
      })

      expect(result.current.todos).toEqual(expectedValue)
    },
  )
})
