import React, {Component} from 'react'
import {render} from 'react-dom'
import {report,data} from './demo';
import {BrowserRouter as Router,useHistory} from "react-router-dom";
import {ReportDisplay} from '../../src'

function executeDataQuery({name,variables}){
	console.log("executeDataQuery got ",Object.keys(variables));
	console.log("Getting data for name",name," from ",Object.keys(data));
	if (!name) return {error:"No name provided in "+Object.keys(props)};
	if (!data[name]) return {error:"Name "+name+" not found in sample data "+Object.keys(data)};
	return {data:data[name],error:null,loading:null}
}

function History(props){
	const history=useHistory();
	return <ReportDisplay {...{executeDataQuery,report,history}}/>;
}

function Demo(props){
  return <Router><History/></Router>;
}

render(<Demo/>, document.querySelector('#demo'))
