import warning from 'warning'
import invariant from 'invariant'
import { Component, h } from 'preact'
import PropTypes from 'prop-types'

/**
 * The public API for putting history on context.
 */
class Router extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.node
  }

  static contextTypes = {
    router: PropTypes.object
  }

  static childContextTypes = {
    router: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      router: {
        ...this.context.router,
        history: this.props.history,
        route: {
          location: this.props.history.location,
          match: this.state.match
        }
      }
    }
  }

  state = {
    match: this.computeMatch(this.props.history.location.pathname)
  }

  computeMatch(pathname) {
    return {
      path: '/',
      url: '/',
      params: {},
      isExact: pathname === '/'
    }
  }

  componentWillMount() {
    const { children, history } = this.props

    // FIXME not sure what to do about this one
    // invariant(
    //   children == null || React.Children.count(children) === 1,
    //   'A <Router> may have only one child element'
    // )

    // Do this here so we can setState when a <Redirect> changes the
    // location in componentWillMount. This happens e.g. when doing
    // server rendering using a <StaticRouter>.
    this.unlisten = history.listen(() => {
      this.setState({
        match: this.computeMatch(history.location.pathname)
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    warning(
      this.props.history === nextProps.history,
      'You cannot change <Router history>'
    )
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const { children } = this.props
    // FIXME preact can have multiple children, how shall that be handled?
    return children ? children[0] : null
  }
}

export default Router
