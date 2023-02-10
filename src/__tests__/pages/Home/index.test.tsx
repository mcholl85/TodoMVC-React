/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import Home from '../../../pages/Home'
import { useTodos } from '../../../utils/hooks/useTodos'
import { mockCompletedTodo, mockTodos, mockActiveTodo } from '../../../utils/mocks/todos'

jest.mock('../../../utils/hooks/useTodos', () => {
  return {
    ...jest.requireActual('../../../utils/hooks/useTodos'),
    useTodos: jest.fn(),
  }
})

const mockUseTodos = useTodos as jest.Mock

describe('Page Home', () => {
  test('Matches DOM Snapshot', () => {
    mockUseTodos.mockImplementation(() => ({
      todos: [],
      count: { all: 0 },
      getFilteredTodos: jest.fn(),
    }))

    const { asFragment } = render(<Home filter='all' />)

    expect(asFragment()).toMatchSnapshot()
  })

  test('select all todos', () => {
    const mockChangeAllCompletedTodo = jest.fn()
    mockUseTodos.mockImplementation(() => ({
      todos: [],
      count: { all: 0 },
      changeAllCompletedTodo: mockChangeAllCompletedTodo,
      getFilteredTodos: jest.fn(),
    }))

    render(<Home filter='all' />)
    const checkbox = screen.getByRole('checkbox', { name: /Mark all as complete/i })

    expect(checkbox).not.toBeChecked()

    userEvent.click(checkbox)

    expect(mockChangeAllCompletedTodo).toHaveBeenCalledTimes(1)
    expect(mockChangeAllCompletedTodo).toHaveBeenNthCalledWith(1, true)
  })

  test('unselect all todos', () => {
    const mockChangeAllCompletedTodo = jest.fn()
    mockUseTodos.mockImplementation(() => ({
      todos: [],
      count: { all: 0 },
      allTodosCompleted: true,
      changeAllCompletedTodo: mockChangeAllCompletedTodo,
      getFilteredTodos: jest.fn(),
    }))

    render(<Home filter='all' />)
    const checkbox = screen.getByRole('checkbox', { name: /Mark all as complete/i })

    expect(checkbox).toBeChecked()

    userEvent.click(checkbox)

    expect(mockChangeAllCompletedTodo).toHaveBeenCalledTimes(1)
    expect(mockChangeAllCompletedTodo).toHaveBeenNthCalledWith(1, false)
  })

  test('display footer and todolist when there are todos', () => {
    mockUseTodos.mockImplementation(() => ({
      todos: mockTodos,
      count: { all: mockTodos.length },
      allTodosCompleted: true,
      getFilteredTodos: jest.fn(),
    }))

    render(
      <MemoryRouter initialEntries={['/']}>
        <Home filter='all' />
      </MemoryRouter>,
    )

    const footer = screen.queryByTestId('footer')

    expect(footer).toBeInTheDocument()
  })

  test('not display footer nor todolist where there are no todos', () => {
    mockUseTodos.mockImplementation(() => ({
      todos: [],
      count: { all: 0 },
      allTodosCompleted: true,
      getFilteredTodos: jest.fn(),
    }))

    render(
      <MemoryRouter initialEntries={['/']}>
        <Home filter='all' />
      </MemoryRouter>,
    )

    const footer = screen.queryByTestId('footer')

    expect(footer).not.toBeInTheDocument()
  })

  test('render a li element with the class complete given a completed todo', () => {
    mockUseTodos.mockImplementation(() => ({
      todos: [mockCompletedTodo],
      count: { all: 1 },
      allTodosCompleted: true,
      getFilteredTodos: () => {},
    }))

    render(
      <MemoryRouter initialEntries={['/']}>
        <Home filter='all' />
      </MemoryRouter>,
    )

    const li = screen.getByTestId(`list-${mockCompletedTodo.id}`)

    expect(li).toHaveClass('completed')
  })

  test('render a li element without the class complete given a completed todo', () => {
    mockUseTodos.mockImplementation(() => ({
      todos: [mockActiveTodo],
      count: { all: 1 },
      allTodosCompleted: true,
      getFilteredTodos: () => {},
    }))

    render(
      <MemoryRouter initialEntries={['/']}>
        <Home filter='all' />
      </MemoryRouter>,
    )

    const li = screen.getByTestId(`list-${mockActiveTodo.id}`)

    expect(li).not.toHaveClass('completed')
  })

  test('render a li element with the class editing given a double click on list element', () => {
    mockUseTodos.mockImplementation(() => ({
      todos: [mockActiveTodo],
      count: { all: 1 },
      allTodosCompleted: true,
      getFilteredTodos: () => {},
    }))

    render(
      <MemoryRouter initialEntries={['/']}>
        <Home filter='all' />
      </MemoryRouter>,
    )

    const li = screen.getByTestId(`list-${mockActiveTodo.id}`)

    expect(li).not.toHaveClass('editing')

    userEvent.dblClick(li)

    expect(li).toHaveClass('editing')
  })
})
