import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Filters from '../../../components/Filters'

const ROUTES = [
  { path: '/', name: 'All' },
  { path: '/active', name: 'Active' },
  { path: '/completed', name: 'Completed' },
]

describe('Component Filters', () => {
  test('Matches DOM Snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/']}>
        <Filters />
      </MemoryRouter>,
    )

    expect(asFragment()).toMatchSnapshot()
  })
  test.each`
    path            | name
    ${'/'}          | ${'All'}
    ${'/active'}    | ${'Active'}
    ${'/completed'} | ${'Completed'}
  `('$name link have only active class on $path route', ({ path, name }) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Filters />
      </MemoryRouter>,
    )
    const unSelectedRoutes = ROUTES.filter((route) => route.name !== name)
    const navLink = screen.getByRole('link', { name: name })

    unSelectedRoutes.forEach((route) => {
      expect(screen.getByRole('link', { name: route.name })).not.toHaveClass('selected')
    })
    expect(navLink).toHaveClass('selected')
  })
})
