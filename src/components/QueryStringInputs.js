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
import {HistoryContext} from './HistoryContext';
import { useForm,Controller } from "react-hook-form";
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateUtils from '@date-io/dayjs';




function QueryStringForm(props){
	const history=React.useContext(HistoryContext);
	const location=history.location;

	let qs=queryString.parse(location.search || "");
	const { control,handleSubmit, register, errors } = useForm({mode:"onBlur",defaultValues:qs});

  const onSubmit = values => {
		let l=Object.assign({},location,{search:queryString.stringify(values)});
		history.push(l);
    console.log(values);
  };
	return <form onSubmit={handleSubmit(onSubmit)}>
		<input name="sample_text" ref={register}/>
		<TextFieldInput
			name="email"
			register={register}
		/>

		<button type="submit">Submit</button>
  </form>
}

function TextFieldInput(props){
		return (<FormControl component="fieldset">
			<TextField
				name={props.name}
				inputRef={props.register}
				label={props.label}
				style={props.style}
				placeholder={props.placeholder}
				defaultValue={props.defaultValue}
			/>
		</FormControl>);
}


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

function FraktureDatePicker(props){
		const {control,value,name,error,rules}=props;
		return <Controller
    as={
        <KeyboardDatePicker
            clearable
            autoOk
            format="MMMM Do, YYYY"
            views={["year", "month", "date"]}
            inputVariant="outlined"
            margin="dense"
            InputAdornmentProps={{ position: "start" }}
            error={error}
        />
    }
    name={name}
    defaultValue={value}
    rules={rules}
    control={control}
  />;
}


function QuickDateRange(props){
	const history=React.useContext(HistoryContext);
	const location=history.location;

	let qs=queryString.parse(location.search || "");

	function handleChange(event){
		let value=event.target.value;
		qs.start=value.split("~")[0] ||"";
		qs.end=value.split("~")[1] ||"";
		history.push(Object.assign({},location,{search:queryString.stringify(qs)}));
	}

	let {start:queryStart,end:queryEnd } = qs;
	if (!queryStart) queryStart=props.start || "-3M";
	if (!queryEnd) queryEnd=props.end||"";
	// let {start,end}=this.props;
	let value=(queryStart||"")+"~"+(queryEnd||"");

	return (
		<MuiPickersUtilsProvider utils={DateUtils}>
		<FormControl>
			<InputLabel htmlFor="quick-date-range">Date Range</InputLabel>
				<Select
					native
					value={value}
					onChange={e=>handleChange(e)}
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
						<option value={"-1M.start.month~-1M.end.month"}>Last Month</option>
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
		</MuiPickersUtilsProvider>
	);
};


export {FraktureDatePicker,QuickDateRange,ToggleSwitch, TextFieldInput, QueryStringForm};
