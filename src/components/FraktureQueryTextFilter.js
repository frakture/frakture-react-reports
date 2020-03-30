import React from 'react';
import {ReportQuery} from "./Common";
import {HistoryContext} from './HistoryContext';
import queryString from 'query-string';
import Select from 'react-select';


export default function FraktureQueryTextFilter (props){
	if (!props.name) return "No name provided for Text Filter";
	const history=React.useContext(HistoryContext);
	const location=history.location;

	let search=queryString.parse(location.search);
	let {name,warehouse_bot_id:bot_id,table,field,conditions}=props;

	//If there's a filter on this field, remove it, so we can get the full select dropdown, regarless of things
	//that were picked
	let filteredConditions=(conditions||[]).filter(f=>{
		if (f && f.fql && f.fql.indexOf(field)==0){
			return false;
		}
		return true;
	});
	let variables={
		bot_id,
		table,
		fields:[{alias:"field",fql:field},{alias:"count",fql:"count(*)"}],
		group_by:{alias:field,fql:field},
		order_by:{fql:"count(*)",order_by_direction:"DESC"},
		conditions:filteredConditions,
		limit:50
	};
	//return JSON.stringify(variables);
	let searchVal=(search['f.'+field]||"").split(",");

	return <div style={{width:"300px"}}>
		<ReportQuery name={name} variables={variables} width={300} height={50}>{({data}) => {
			let options=data.map(d=>{
				if (d.field=='') return {value:'_blank',label:"(Blank) ("+d.count+")"};
				return {value:d.field,label:d.field+" ("+d.count+")"};
			});
			if (!options.find(v=>v.value=='_blank')){
				options.unshift({
					value:"_blank",
					label:"(Blank)"
				});
			}
			let value=options.filter(o=>{
				return searchVal.find(s=>o.value==s);
			});
			let currentVal=null;
			return <Select
				defaultValue={value}
				onChange={v=>currentVal=v}
				onBlur={(e)=>{
					console.log("On blur called with "+currentVal);
					let val=[].concat(currentVal).filter(Boolean);// eslint-disable-line react/no-this-in-sfc
					search['f.'+field]=val.map(f=>f.value).join(",");

					location.search=queryString.stringify(search);
					history.push(location);
				}}
				options={options}
				isMulti={true}
				closeMenuOnSelect={false}
			/>;
		}}</ReportQuery>
	</div>;
};
