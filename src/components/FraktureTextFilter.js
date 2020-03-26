import React,{useState,useEffect} from 'react';
import TextField from '@material-ui/core/TextField';

export default function FraktureTextFilter (props){
	const {
		label,field,
		filterValues,setFilterValue
	}=props;

	const [search,setSearch]=useState((filterValues||{})[field]||'');
	const [timeoutFn,setTimeoutFn]=useState(null);

	useEffect(() => {
		if(!search && filterValues[field]) setSearch(filterValues[field]);
	});

	if(typeof setFilterValue != 'function') throw new Error('setFilterValue must be set');

	console.log('FraktureTextFilter',{filterValues,setFilterValue});

	return <React.Fragment>
		<TextField {...{label:label||field,value: search,	onChange: e => {
			const newValue = e.target.value;
			setSearch(newValue);
			if(timeoutFn) clearTimeout(timeoutFn);
			setTimeoutFn(setTimeout(() => setFilterValue(field,newValue), 1000));
		}}} fullWidth />
	</React.Fragment>;
};
