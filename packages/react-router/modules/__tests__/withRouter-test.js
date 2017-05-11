import expect from 'expect'
import { h, render } from 'preact'

import MemoryRouter from '../MemoryRouter'
import StaticRouter from '../StaticRouter'
import Route from '../Route'
import withRouter from '../withRouter'

const Noop = () => null

describe('withRouter', () => {
  const node = document.createElement('div')

  afterEach(() => {
    // TODO https://github.com/developit/preact/issues/53
    render(<Noop />, document.body, node)
  })

  it('provides { match, location, history } props', () => {
    const PropsChecker = withRouter(props => {
      expect(props.match).toBeAn('object')
      expect(props.location).toBeAn('object')
      expect(props.history).toBeAn('object')
      return null
    })

    render((
      <MemoryRouter initialEntries={[ '/bubblegum' ]}>
        <Route path="/bubblegum" render={() => (
          <PropsChecker/>
        )}/>
      </MemoryRouter>
    ), node)
  })

  it('provides the parent match as a prop to the wrapped component', () => {
    let parentMatch
    const PropsChecker = withRouter(props => {
      expect(props.match).toEqual(parentMatch)
      return null
    })

    render((
      <MemoryRouter initialEntries={[ '/bubblegum' ]}>
        <Route path="/:flavor" render={({ match }) => {
          parentMatch = match
          return <PropsChecker/>
        }}/>
      </MemoryRouter>
    ), node)
  })

  describe('inside a <StaticRouter>', () => {
    it('provides the staticContext prop', () => {
      const PropsChecker = withRouter(props => {
        expect(props.staticContext).toBeAn('object')
        expect(props.staticContext).toBe(context)
        return null
      })

      const context = {}

      render((
        <StaticRouter context={context}>
          <Route component={PropsChecker}/>
        </StaticRouter>
      ), node)
    })
  })

  it('exposes the wrapped component as WrappedComponent', () => {
    const Component = () => <div/>
    const decorated = withRouter(Component)
    expect(decorated.WrappedComponent).toBe(Component)
  })

  it('exposes the instance of the wrapped component via wrappedComponentRef', () => {
    class WrappedComponent extends Component {
      render() {
        return null
      }
    }
    const Component = withRouter(WrappedComponent)

    let ref
    render((
      <MemoryRouter initialEntries={[ '/bubblegum' ]}>
        <Route path="/bubblegum" render={() => (
          <Component wrappedComponentRef={r => ref = r}/>
        )}/>
      </MemoryRouter>
    ), node)

    expect(ref).toBeA(WrappedComponent)
  })

  it('hoists non-react statics from the wrapped component', () => {
    class Component extends Component {
      static foo() {
        return 'bar'
      }

      render() {
        return null
      }
    }
    Component.hello = 'world'

    const decorated = withRouter(Component)

    expect(decorated.hello).toBe('world')
    expect(decorated.foo).toBeA('function')
    expect(decorated.foo()).toBe('bar')
  })
})
