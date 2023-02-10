/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Footer from '../../../components/Footer'

describe('Component Footer', () => {
  test('render the component into the screen given a todo list', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Footer nbOfActiveTodos={4} nbOfCompletedTodos={2} clearCompleted={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
  test('render the todos counter', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Footer nbOfActiveTodos={4} nbOfCompletedTodos={2} clearCompleted={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('contentinfo')).toHaveTextContent('4')
  })
  test.each`
    count | expectedValue
    ${1}  | ${'item'}
    ${0}  | ${'items'}
    ${2}  | ${'items'}
  `(
    'return $expectedValue given the $selectedTodos nbOfSelectedTodos',
    ({ expectedValue, count }) => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Footer nbOfActiveTodos={count} nbOfCompletedTodos={2} clearCompleted={() => {}} />
        </MemoryRouter>,
      )
      const span = screen.queryByText(`${expectedValue} left`)

      expect(span).toHaveTextContent(`${count} ${expectedValue} left`)
    },
  )
  test('remove completed todos after a click on the button clear completed', () => {
    const mockClearCompletedFn = jest.fn()

    render(
      <MemoryRouter initialEntries={['/']}>
        <Footer nbOfActiveTodos={4} nbOfCompletedTodos={2} clearCompleted={mockClearCompletedFn} />
      </MemoryRouter>,
    )

    userEvent.click(screen.getByRole('button', { name: /clear completed/i }))
    expect(mockClearCompletedFn).toBeCalledTimes(1)
  })
  test('render the "clear completed" button given a number of completed todos greater than 0', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Footer nbOfActiveTodos={4} nbOfCompletedTodos={2} clearCompleted={() => {}} />
      </MemoryRouter>,
    )
    const button = screen.getByRole('button', { name: /clear completed/i })

    expect(button).toBeInTheDocument()
  })
  test('do not render the "clear completed" button given a number of completed equal to 0', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Footer nbOfActiveTodos={4} nbOfCompletedTodos={0} clearCompleted={() => {}} />
      </MemoryRouter>,
    )
    const button = screen.queryByRole('button', { name: /clear completed/i })

    expect(button).not.toBeInTheDocument()
  })
})
