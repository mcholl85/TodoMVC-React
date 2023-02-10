/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Todo from '../../../components/Todo'

describe('Component Todo', () => {
  test('Matches DOM Snapshot', () => {
    const { asFragment } = render(
      <Todo
        id={'1'}
        title={'a'}
        completed={false}
        setCompleted={() => {}}
        setTitle={() => {}}
        removeTodo={() => {}}
        isEditing={''}
        setIsEditing={() => {}}
      />,
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test.each`
    value
    ${true}
    ${false}
  `('Change the completed property given a click on checkbox', ({ value }) => {
    const mockSetCompleted = jest.fn()

    render(
      <Todo
        id={'1'}
        title={'a'}
        completed={value}
        setCompleted={mockSetCompleted}
        setTitle={() => {}}
        removeTodo={() => {}}
        isEditing={''}
        setIsEditing={() => {}}
      />,
    )
    const checkboxEl: HTMLInputElement = screen.getByRole('checkbox')

    userEvent.click(checkboxEl)

    expect(mockSetCompleted).toBeCalledTimes(1)
    expect(mockSetCompleted).toBeCalledWith({ id: '1', completed: !value })
  })
  test('Remove the todo given a click on destroy button', () => {
    const mockRemoveTodo = jest.fn()
    render(
      <Todo
        id={'1'}
        title={'a'}
        completed={false}
        setCompleted={() => {}}
        setTitle={() => {}}
        removeTodo={mockRemoveTodo}
        isEditing={''}
        setIsEditing={() => {}}
      />,
    )
    const button: HTMLButtonElement = screen.getByRole('button')

    userEvent.click(button)

    expect(mockRemoveTodo).toHaveBeenCalledTimes(1)
  })
  test('edit the todo title after typing value and valid with enter', () => {
    const mockSetTitle = jest.fn()
    render(
      <Todo
        id={'1'}
        title={'a'}
        completed={false}
        setCompleted={() => {}}
        setTitle={mockSetTitle}
        removeTodo={() => {}}
        isEditing={''}
        setIsEditing={() => {}}
      />,
    )
    const inputEl = screen.getByRole('textbox')

    userEvent.type(inputEl, 'test{enter}')

    expect(inputEl).toHaveValue('atest')
    expect(mockSetTitle).toHaveBeenCalledWith({ id: '1', title: 'atest' })
    expect(mockSetTitle).toHaveBeenCalledTimes(1)
  })
  test('remove the editing todo title after typing value and invalid with espace', () => {
    const mockSetTitle = jest.fn()
    render(
      <Todo
        id={'1'}
        title={'a'}
        completed={false}
        setCompleted={() => {}}
        setTitle={mockSetTitle}
        removeTodo={() => {}}
        isEditing={''}
        setIsEditing={() => {}}
      />,
    )
    const inputEl = screen.getByRole('textbox')

    userEvent.type(inputEl, 'test{escape}')

    expect(inputEl).toHaveValue('a')
    expect(mockSetTitle).not.toBeCalled()
  })
  test('cancel the value after typing value then escape', () => {
    const mockSetTitle = jest.fn()
    render(
      <Todo
        id={'1'}
        title={'a'}
        completed={false}
        setCompleted={() => {}}
        setTitle={mockSetTitle}
        removeTodo={() => {}}
        isEditing={''}
        setIsEditing={() => {}}
      />,
    )
    const inputEl = screen.getByRole('textbox')

    userEvent.type(inputEl, 'test{escape}')

    expect(inputEl).toHaveValue('a')
    expect(mockSetTitle).not.toHaveBeenCalled()
  })
  test('remove the spaces from the end of the todo title', () => {
    render(
      <Todo
        id={'1'}
        title={'a'}
        completed={false}
        setCompleted={() => {}}
        setTitle={() => {}}
        removeTodo={() => {}}
        isEditing={''}
        setIsEditing={() => {}}
      />,
    )
    const inputEl = screen.getByRole('textbox')

    userEvent.type(inputEl, '  {enter}')
    expect(inputEl).toHaveValue('a')

    userEvent.type(inputEl, '  {escape}')
    expect(inputEl).toHaveValue('a')
  })
  test('remove the todo when edited todo has an empty string', () => {
    const mockRemoveTodo = jest.fn()
    render(
      <Todo
        id={'1'}
        title={'a'}
        completed={false}
        setCompleted={() => {}}
        setTitle={() => {}}
        removeTodo={mockRemoveTodo}
        isEditing={''}
        setIsEditing={() => {}}
      />,
    )
    const inputEl = screen.getByRole('textbox')

    userEvent.type(inputEl, '{Backspace}{enter}')

    expect(mockRemoveTodo).toHaveBeenCalledTimes(1)
    expect(mockRemoveTodo).toHaveBeenCalledWith('1')
  })
})
