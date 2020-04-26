// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import {DataQueryContext} from "./DataQueryContext";


/*
Raw warehouse query:
{
  operationName: 'whQuery',
  variables: {
    query: {
      fields: [Array],
      conditions: [Array],
      group_by: [],
      order_by: [],
      limit: 2
    },
    _v0_name: 'stub_e_email_summary'
  },
  query: 'query whQuery($query: WarehouseQueryInput!, $_v0_name: String) {\n' +
    '  table(name: $_v0_name) {\n' +
    '    query(query: $query) {\n' +
    '      values\n' +
    '      __typename\n' +
    '    }\n' +
    '    __typename\n' +
    '    id\n' +
    '  }\n' +
    '}\n'
}
*/


//Takes a field, and returns back a correctly formatted alias+FQL item
//Accepts <field_name> || {alias,fql} || {name,fql} || {name,aggregate}
export function parseField(field){
	if (typeof field=='string') return {alias:field,fql:field};
	let alias=field.alias || field.name;
	if (!alias){
		let e={type:"invalid",message:"Invalid field -- a name or alias is required, not found in:"+Object.keys(field)};
		throw new Error(e.message);
	}
	let fql=field.fql || (field.aggregate?field.aggregate+"("+alias+")":alias);
	return {alias,fql};
}


function toArray(x) { return Array.isArray(x) ? x : [x]; }
export function buildQueryVariables(rawQuery) {
	if(!rawQuery) return null;

	const{table,fields={},group_by=[],conditions=[],order_by=group_by,limit=1000}=rawQuery; //limit to 1000
	if (!table){
		console.error("No table specified in query:",rawQuery);
		throw new Error("Could not find a table in :"+Object.keys(rawQuery));
	}

	if(limit != null && parseInt(limit) != limit) throw new Error('limit must be int');
	if(!Object.keys(fields).length &&
		!group_by.length &&
		!conditions.length &&
		!order_by.length &&
		!group_by.length) return null;

	const{bot_id}=rawQuery;

	return {
		table,
		bot_id,
		query: {
			fields: Array.isArray(fields)?fields.map(parseField):Object.keys(fields).map(alias => {
				const fql=fields[alias];
				if(typeof fql == 'string') return {alias, fql};
				return {alias,fql:alias};
			}),
			group_by: toArray(group_by).map(fql => (fql.fql?fql:{fql})),
			conditions: toArray(conditions).map(fql => (fql.fql?fql:{fql})),
			order_by: toArray(order_by).map(fql => (fql.fql?fql:{fql})),
			limit
		}
	};
};

/*
urql useQuery has a slightly different signature

const [result, reexecuteQuery] = useQuery({
	query: tableDataQuery,
});
const { data, fetching, error } = result;
if (fetching) return <p>Loading...</p>;
if (error) return <p>Oh no... {error.message}</p>;
*/


export function ReportQuery(props) {
	const {name,children,variables:_variables,width,height}=props;
	const executeDataQuery=React.useContext(DataQueryContext);
	if(typeof children != 'function') throw new Error('children must be function');
	if (!name) return "ReportQuery requires a name property";

	let variables=null;
	try{
		variables=JSON.parse(JSON.stringify(buildQueryVariables(_variables)));
	}catch(e){
		console.error(e);
		return "Error building variables";
	}

	if(!variables) throw new Error("No built variables for variables: " +JSON.stringify(variables));

	const {data,error,loading}=executeDataQuery({name,variables});
	if (error){
		console.error("Loading error:",error);
		return "There was an error loading data";
	}
	if(loading){
		if (width && height){
			return <React.Fragment>
				<Skeleton variant="rect" width={width} height={height} />
			</React.Fragment>;
		};
		return <i className='zmdi zmdi-hc-3x zmdi-spinner zmdi-hc-spin' style={{position:"relative",margin:"auto"}}/>;
	}
	return children({data});
};
