import React, {Component} from 'react'
import {render} from 'react-dom'
import {report,data} from './demo';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {HelloWorld,ReportDisplay} from '../../src'

function executeDataQuery(props){
	let {name='n/a',variables}=props;
	console.log("executeDataQuery got ",Object.keys(variables));
	console.log("Getting data for name",name," from ",Object.keys(data));
	if (!name) return {error:"No name provided in "+Object.keys(props)};
	if (!data[name]) return {error:"Name "+name+" not found in sample data "+Object.keys(data)};
	return {data:data[name]}
}

export default class Demo extends Component {
  render() {
    return <div>
			<Router>
	      <h1>frakture-react-reports Demo</h1>
				<HelloWorld/>
				<ReportDisplay {...{executeDataQuery,report}}/>
			</Router>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
