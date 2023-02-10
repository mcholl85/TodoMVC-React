import Filters from '../Filters'

type FooterProps = {
  nbOfActiveTodos: number
  nbOfCompletedTodos: number
  clearCompleted: () => void
}

export default function Footer({
  nbOfActiveTodos,
  nbOfCompletedTodos,
  clearCompleted,
}: FooterProps) {
  return (
    <footer className='footer' data-testid='footer'>
      <span className='todo-count'>
        <strong>{nbOfActiveTodos}</strong> item
        {nbOfActiveTodos === 1 ? '' : 's'} left
      </span>
      <Filters />
      {nbOfCompletedTodos > 0 && (
        <button onClick={clearCompleted} className='clear-completed'>
          Clear completed
        </button>
      )}
    </footer>
  )
}
