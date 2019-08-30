import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

// Component
import List from './List'

class ListContainer extends PureComponent {
  state = {
    list: []
  }

  static defaultProps = {
    list: []
  }

  loadCharactersList = (nameStartsWith = null) => {
    this.props.find({ nameStartsWith })
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    let state = {}

    if (prevState.list !== nextProps.list) {
      state.list = nextProps.list
    }

    return state
  }

  componentDidMount () {
    this.loadCharactersList()
  }

  render () {
    const { list } = this.state

    return (
      <>
        <List characters={list} onSearch={this.loadCharactersList} />
      </>
    )
  }
}

const mapState = state => ({
  list: state.character.list
})

const mapDispatch = ({ character: { find } }) => ({
  find
})

export default connect(mapState, mapDispatch)(ListContainer)
