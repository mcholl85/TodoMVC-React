import { NavLink } from 'react-router-dom'

export default function Filters() {
  const activeClassName = 'selected'

  return (
    <ul className='filters'>
      <li>
        <NavLink className={({ isActive }) => (isActive ? activeClassName : undefined)} to='/'>
          All
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? activeClassName : undefined)}
          to='/active'
        >
          Active
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => (isActive ? activeClassName : undefined)}
          to='/completed'
        >
          Completed
        </NavLink>
      </li>
    </ul>
  )
}
