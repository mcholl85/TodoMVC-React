import classNames from 'classnames'
import { useState } from 'react'
import CreateTodo from '../../components/CreateTodo'
import Footer from '../../components/Footer'
import Todo from '../../components/Todo'
import { useTodos } from '../../utils/hooks/useTodos'

type HomeProps = {
  filter: 'all' | 'active' | 'completed'
}

export default function Home({ filter }: HomeProps) {
  const {
    todos,
    count: { all, active, completed },
    allTodosCompleted,
    saveTodo,
    changeAllCompletedTodo,
    setCompleted,
    setTitle,
    removeTodo,
    clearCompleted,
  } = useTodos(filter)
  const [isEditing, setIsEditing] = useState('')

  return (
    <>
      <section className='todoapp'>
        <header className='header'>
          <h1>todos</h1>
          <CreateTodo saveTodo={saveTodo} />
        </header>
        <section className='main'>
          <input
            onChange={(e) => changeAllCompletedTodo(e.target.checked)}
            checked={allTodosCompleted}
            id='toggle-all'
            className='toggle-all'
            type='checkbox'
          />
          <label htmlFor='toggle-all'>Mark all as complete</label>
          <ul className='todo-list'>
            {todos?.map((todo) => (
              <li
                key={todo.id}
                onDoubleClick={() => setIsEditing(todo.id)}
                className={classNames(
                  { completed: todo.completed },
                  { editing: isEditing === todo.id },
                )}
              >
                <Todo
                  key={todo.id}
                  id={todo.id}
                  title={todo.title}
                  completed={todo.completed}
                  setCompleted={setCompleted}
                  setTitle={setTitle}
                  removeTodo={removeTodo}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                />
              </li>
            ))}
          </ul>
        </section>
        {all > 0 ? (
          <Footer
            clearCompleted={clearCompleted}
            nbOfActiveTodos={active}
            nbOfCompletedTodos={completed}
          />
        ) : (
          ''
        )}
      </section>
      <footer className='info'>
        <p>Double-click to edit a todo</p>
        <p>
          Created by <a href='http://todomvc.com'>Matthieu CHOLLET</a>
        </p>
        <p>
          Part of <a href='http://todomvc.com'>TodoMVC</a>
        </p>
      </footer>
    </>
  )
}
