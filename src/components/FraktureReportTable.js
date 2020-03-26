import React,{useState} from 'react';
import {formatValue} from '../formatters';
import FraktureTable from './FraktureTable';
import Typography from '@material-ui/core/Typography';
import {ReportQuery} from "./Common";

export default function FraktureReportTable(props){
	let {name,warehouse_bot_id:bot_id,table,dimensions,metrics,order_by:default_order_by,label,width,height,conditions}=props;

	const [sort, setSort] = useState(null);
	const [sortDirection, setSortDirection] = useState('asc');

	let fields=(dimensions||[]).map(d=>{return {alias:d.label || d.fql,fql:d.fql,format:d.format,description:d.description};})
		.concat(metrics.map(d=>{return {alias:d.label||d.fql,fql:d.fql,format:d.format,description:d.description};}));

	let order_by=[];
	let s=fields.find(f=>f.alias==sort);
	if (s){
		order_by=[{
			fql: s.fql,
			order_by_direction: sortDirection=="desc"?"DESC":"ASC"
		}];
	}else{
		order_by=default_order_by;
	}

	let variables={
		name,
		bot_id,
		table,
		fields,
		group_by:(dimensions||[]).map(d=>{return {alias:d.label || d.fql,fql:d.fql};}),
		order_by,
		conditions,
		limit:50
	};

	return <React.Fragment>
		{label && <Typography variant="h6">{label}</Typography>}
		<ReportQuery variables={variables} width={width} height={height}>{({data}) => {
			let columns = fields.map(x=>({
				format:(!x.format)?null:typeof x.format=='function'?x.format:f=>formatValue(f,x.format),
				field: x.alias,
				title: x.alias,
				description:x.description}));

			let rowsPerPage=Math.floor((height-80)/25);
			if (rowsPerPage<3) rowsPerPage=3;
			return <div style={{height:"100%",overflow:"auto",zoom:"0.8"}}>
				<MaterialTable
					key="table"
					rows={data}
					columns={columns}
					includePagination={true}
					includeColumnPicker={false}
					rowsPerPage={rowsPerPage}
					sort={sort}
					sortDirection={sortDirection}
					onSort={(field,dir)=>{console.log("Called setSort",field);setSort(field);setSortDirection(dir);}}
					padding="none"
				/></div>;
		}}</ReportQuery></React.Fragment>;
};
