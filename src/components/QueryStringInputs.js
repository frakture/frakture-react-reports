import React from 'react';
import {KeyboardDatePicker} from '@material-ui/pickers';
import queryString from 'query-string';
import {withRouter} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import {relativeDate} from "../formatters.js";

class _QueryStringForm extends React.Component {
	constructor(props) {
		super(props);
		this.state=queryString.parse((this.props.location||{}).search || "") || {};
		// Bind the method to the component context
		console.log("QueryStringInput constructor called, state=",this.state);

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount(){
		this.state = queryString.parse((this.props.location||{}).search) || {};
	}

	handleChange(event,values) {

		let o=values ||{};
		if (event && event.target && event.target.name){
			o[event.target.name]=[event.target.value];
		}
		this.setState(o);
	}

	handleSubmit() {
		console.log("Submitted form");
		this.props.history.push({location:this.props.location.pathname,search:queryString.stringify(this.state)});
		event.preventDefault();
	}

	render() {

		return (
			<form onSubmit={this.handleSubmit}>
				<button type="submit" style={{display:"none"}}/>{/* Required to submit it?  Weird*/}
				{this.props.children({onChange:this.handleChange,values:this.state,submit:this.handleSubmit})}
			</form>
		);
	}
}


class TextFieldInput extends React.Component {
	render() {
		return (<FormControl component="fieldset">
			<TextField
				name={this.props.name}
				label={this.props.label}
				style={this.props.style}
				onChange={this.props.onChange}
				value={this.props.value}
				placeholder={this.props.placeholder}
			/>
		</FormControl>);
	}
};

class ToggleSwitch extends React.Component {
	render() {

		const checked=(this.props.value=="true");

		return (
			<FormControl component="fieldset">
				<FormLabel component="legend">{this.props.label}</FormLabel>
				<FormGroup>
					<Switch
						name={this.props.name}
						checked={checked}
						onChange={this.props.onChange}
						value="true"
					/>
				</FormGroup>
			</FormControl>
		);
	}
};

class FraktureDatePicker extends React.Component {
	render(){
		let value=relativeDate(this.props.value);
		let name=this.props.name;
		return <KeyboardDatePicker format="MMMM Do, YYYY" value={value} name={name} onChange={value=>this.props.onChange({target:{name,value:value.toISOString()}})}/>;
	}

}


class _QuickDateRange extends React.Component {

handleChange = () => event=>{
	let value=event.target.value;
	let query=queryString.parse(this.props.location.search) || {};
	query.start=value.split("~")[0] ||"";
	query.end=value.split("~")[1] ||"";
	this.props.history.push({location:this.props.location.pathname,search:queryString.stringify(query)});
}

render() {
	const query=queryString.parse(this.props.location.search) ||{};
	let {start:queryStart,end:queryEnd } = query;
	if (!queryStart) queryStart=this.props.start || "";
	if (!queryEnd) queryEnd=this.props.end||"";
	// let {start,end}=this.props;
	let value=(queryStart||"")+"~"+(queryEnd||"");

	return (
		<FormControl>
			<InputLabel htmlFor="quick-date-range">Date Range</InputLabel>
			<Select
				native
				value={value}
				onChange={this.handleChange()}
				inputProps={{
					id: 'quick-date-range',
				}}
			>
				<option value="" />
				<optgroup label="Through Today">
					<option value={"-1h~"}>Last hour</option>
					<option value={"-3h~"}>Last 3 hours</option>
					<option value={"-6h~"}>Last 6 hours</option>
					<option value={"-12h~"}>Last 12 hours</option>
					<option value={"-1d~"}>Last 24 hours</option>
					<option value={"-2d~"}>Last 2 days</option>
					<option value={"-3d~"}>Last 3 days</option>
					<option value={"-7d~"}>Last 7 days</option>
					<option value={"-14d~"}>Last 14 days</option>
					<option value={"-30d~"}>Last 30 days</option>
					<option value={"-3M~"}>Last 3 months</option>
					<option value={"-6M~"}>Last 6 months</option>
					<option value={"-1y~"}>Last 12 months</option>
					<option value={"-2y~"}>Last 24 months</option>
					<option value={"-0y.start.y~"}>YTD</option>
					<option value={"-100y~"}>All time</option>
				</optgroup>
				<optgroup label="Historical">
					<option value={"-1y.start.y~-1y.end.y"}>Last Year</option>
					<option value={"-1y.start.y~-0y.end.y"}>This Year</option>
					<option value={"~-1h"}>1+ Hour Ago</option>
					<option value={"~-3h"}>3+ Hours Ago</option>
					<option value={"~-6h"}>6+ Hours Ago</option>
					<option value={"~-12h"}>12+ Hours Ago</option>
					<option value={"~-1h"}>1+ Days Ago</option>
					<option value={"~-1d"}>1+ Days Ago</option>
					<option value={"~-2d"}>2+ Days Ago</option>
					<option value={"~-3d"}>3+ Days Ago</option>
					<option value={"~-7d"}>7+ Days Ago</option>
				</optgroup>
			</Select>
		</FormControl>
	);
}
};



class _CheckboxGroup extends React.Component {
handleChange = value => event => {
	const {name}=this.props;
	let query=queryString.parse(this.props.location.search) || {};
	let curValue=(query[name]||"").split(",").filter(Boolean).reduce((a,b)=>{a[b]=true;return a;},{});

	if (event.target.checked){
		curValue[value]=true;
	}else{
		delete curValue[value];
	}
	query[name]=Object.keys(curValue).join(",");
	this.props.history.push({location:this.props.location.pathname,search:queryString.stringify(query)});
}

render() {
	const {name,label,options=[]}=this.props;
	if (!name) return "name is required for checkbox group";

	const query=queryString.parse(this.props.location.search) ||{};
	let queryStringValue = (query[name] || "").split(",").map(d=>d.trim());

	return <FormControl component="fieldset">
		<FormLabel component="legend">{label}</FormLabel>
		<FormGroup>
			{options.map(({label,value})=>{
				return <FormControlLabel
					key={value}
					control={
						<Checkbox checked={queryStringValue.findIndex(q=>q==value)>=0} onChange={this.handleChange(value)} value={value} />
					}
					label={label || value}
				/>;
			})}
		</FormGroup>
	</FormControl>;
}
};

let nextQueryString, nextFn;
function withQueryString(Wrapped) {
	return withRouter(class extends React.Component {
		render() {
			const query=queryString.parse(this.props.location.search) ||{};
			const set_query_param = (name,value) => {
				if(!nextQueryString) nextQueryString = Object.assign({},query);
				nextQueryString[name]=value;

				console.log('set_query_param',name,value);

				if(!nextFn) {
					nextFn = () => {
						this.props.history.push({location:this.props.location.pathname,search:queryString.stringify(nextQueryString)});
						nextQueryString = null;
						nextFn = null;
					};
					setTimeout(nextFn, 0);
				}
				//this.props.history.push({location:this.props.location.pathname,search:queryString.stringify(query)});
			};
			return <Wrapped {...this.props} query={query} query_string={this.props.location.search} set_query_param={set_query_param}/>;
		}
	});
};

const QueryStringCheckbox = withQueryString(class _Checkbox extends React.Component {
	render() {
		const{name,label,value,query,set_query_param}=this.props;
		if(!name) return "name is required for checkbox group";
		const queryStringValue=(query[name]||'').split(',').map(x=>x.trim()).filter(x=>!!x);
		const checked = !!queryStringValue.find(q=>q==value);

		const checkbox=<Checkbox
			checked={checked}
			onChange={() => {
				let newValue;
				if(checked) newValue = queryStringValue.filter(x=>x!=value).join(',');
				else newValue=queryStringValue.concat(value).join(',');
				set_query_param(name,newValue);
				if(this.props.onChange) this.props.onChange(checked);
			}}
			value={value} />;

		return <FormControlLabel control={checkbox} label={label || value}/>;
	}
});

const CheckboxGroup=withQueryString(_CheckboxGroup);
const QuickDateRange=withRouter(_QuickDateRange);
const QueryStringForm=withQueryString(_QueryStringForm);

export {FraktureDatePicker,QuickDateRange,CheckboxGroup,ToggleSwitch, QueryStringCheckbox,TextFieldInput, QueryStringForm,withQueryString};
