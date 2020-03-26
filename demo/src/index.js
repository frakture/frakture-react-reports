import React, {Component} from 'react'
import {render} from 'react-dom'

import {HelloWorld,ReportDisplay} from '../../src'

export default class Demo extends Component {
  render() {
    return <div>
      <h1>frakture-react-reports Demo</h1>
			<HelloWorld/>
			<ReportDisplay/>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
