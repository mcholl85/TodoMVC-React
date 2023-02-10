import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PropsWithChildren } from 'react'
import CreateTodo from '../../../components/CreateTodo'
import { useTodos } from '../../../utils/hooks/useTodos'

const queryClient = new QueryClient()
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('Component CreateTodo', () => {
  test('Matches DOM Snapshot', () => {
    const { asFragment } = render(<CreateTodo saveTodo={() => []} />)

    expect(asFragment()).toMatchSnapshot()
  })
  test('change value of new todo input and create a todo after press enter', () => {
    const mockSaveTodo = jest.fn()
    render(<CreateTodo saveTodo={mockSaveTodo} />)

    const inputEl: HTMLInputElement = screen.getByRole('textbox')

    userEvent.type(inputEl, 'test')
    expect(inputEl).toHaveValue('test')

    userEvent.type(inputEl, '{enter}')
    expect(mockSaveTodo).toBeCalledWith('test')
    expect(inputEl).toHaveValue('')
  })
  test('do not create a todo given a empty input', () => {
    const { result } = renderHook(() => useTodos('all'), { wrapper })

    render(<CreateTodo saveTodo={result.current.saveTodo} />)

    const inputEl: HTMLInputElement = screen.getByRole('textbox')

    userEvent.type(inputEl, '{enter}')

    expect(result.current.todos).toEqual([])
  })
})
