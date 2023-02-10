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
      />,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  test('Focus the title input, change the list style given a double click on the list', () => {
    render(
      <Todo
        id={'1'}
        title={'a'}
        completed={false}
        setCompleted={() => {}}
        setTitle={() => {}}
        removeTodo={() => {}}
      />,
    )
    const liEl: HTMLLIElement = screen.getByRole('listitem')

    userEvent.dblClick(liEl)
    expect(screen.getByRole('textbox')).toHaveFocus()
    expect(liEl).toHaveClass('editing')
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
      />,
    )
    const checkboxEl: HTMLInputElement = screen.getByRole('checkbox')

    userEvent.click(checkboxEl)

    expect(mockSetCompleted).toBeCalledTimes(1)
    expect(mockSetCompleted).toBeCalledWith('1', !value)
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
      />,
    )
    const inputEl = screen.getByRole('textbox')

    userEvent.type(inputEl, 'test{enter}')

    expect(inputEl).toHaveValue('atest')
    expect(mockSetTitle).toHaveBeenCalledWith('1', 'atest')
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
      />,
    )
    const inputEl = screen.getByRole('textbox')

    userEvent.type(inputEl, '{Backspace}{enter}')

    expect(mockRemoveTodo).toHaveBeenCalledTimes(1)
    expect(mockRemoveTodo).toHaveBeenCalledWith('1')
  })
  test('render a list with the class completed when todo is checked', () => {
    render(
      <Todo
        id={'1'}
        title={'a'}
        completed={true}
        setCompleted={() => {}}
        setTitle={() => {}}
        removeTodo={() => {}}
      />,
    )

    const liEl: HTMLLIElement = screen.getByRole('listitem')
    const checkboxEl: HTMLInputElement = screen.getByRole('checkbox')

    expect(checkboxEl).toBeChecked()
    expect(liEl).toHaveClass('completed')
  })
  test('do not render a list with the class completed when todo is not checked', () => {
    render(
      <Todo
        id={'1'}
        title={'a'}
        completed={false}
        setCompleted={() => {}}
        setTitle={() => {}}
        removeTodo={() => {}}
      />,
    )

    const liEl: HTMLLIElement = screen.getByRole('listitem')
    const checkboxEl: HTMLInputElement = screen.getByRole('checkbox')

    expect(checkboxEl).not.toBeChecked()
    expect(liEl).not.toHaveClass('completed')
  })
})
