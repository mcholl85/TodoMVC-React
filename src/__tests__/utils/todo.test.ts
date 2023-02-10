import { hasSpaceToLastChar, removeEndSpaces } from '../../utils/todo'

describe('hasSpaceToLastChar', () => {
  it.each`
    input            | expectedValue
    ${'welcome'}     | ${false}
    ${'welcome '}    | ${true}
    ${'welcome   '}  | ${true}
    ${'welcome   e'} | ${false}
  `('return $expectedValue given the value "$input"', ({ input, expectedValue }) => {
    expect(hasSpaceToLastChar(input)).toBe(expectedValue)
  })
})

describe('removeLastChar', () => {
  it.each`
    input             | expectedValue
    ${'welcome  e'}   | ${'welcome  e'}
    ${'welcome '}     | ${'welcome'}
    ${'welcome     '} | ${'welcome'}
    ${''}             | ${''}
  `('return "$expectedValue" given the value "$input"', ({ input, expectedValue }) => {
    expect(removeEndSpaces(input)).toBe(expectedValue)
  })
})
