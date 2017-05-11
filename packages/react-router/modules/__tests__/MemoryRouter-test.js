import expect from 'expect'
import { h, render } from 'preact'
import PropTypes from 'prop-types'

import MemoryRouter from '../MemoryRouter'

describe('A <MemoryRouter>', () => {
  it('puts history on context.router', () => {
    let history
    const ContextChecker = (props, context) => {
      history = context.router.history
      return null
    }

    ContextChecker.contextTypes = {
      router: PropTypes.object.isRequired
    }

    const node = document.createElement('div')

    render((
      <MemoryRouter>
        <ContextChecker/>
      </MemoryRouter>
    ), node)

    expect(history).toBeAn('object')
  })
})
