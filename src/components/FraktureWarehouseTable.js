import React,{useState} from 'react';
// import {formatValue} from '../formatters';
import FraktureTable from './FraktureTable';
import Typography from '@material-ui/core/Typography';
import {ReportQuery} from "./Common";

export default function FraktureWarehouseTable(props){
	let {key,warehouse_bot_id:bot_id,table,label,width,height,conditions}=props;

	const [sort, setSort] = useState(null);
	const [sortDirection, setSortDirection] = useState('asc');

	let order_by=[];
	if (sort){
		order_by=[{
			fql: sort,
			order_by_direction: sortDirection=="desc"?"DESC":"ASC"
		}];
	}

	let variables={
		key,
		bot_id,
		table,
		conditions,
		order_by,
		limit:50
	};

	return <React.Fragment>
		{label && <Typography variant="h6">{label}</Typography>}
		<ReportQuery variables={variables} width={width} height={height}>{({data}) => {
			let rowsPerPage=Math.floor((height-80)/25);
			if (rowsPerPage<3) rowsPerPage=3;
			return <div style={{height:"100%",overflow:"auto",zoom:"1.0"}}>
				<FraktureTable
					key="table"
					rows={data}
					includePagination={true}
					includeColumnPicker={true}
					rowsPerPage={rowsPerPage}
					sort={sort}
					sortDirection={sortDirection}
					onSort={(field,dir)=>{console.log("Called setSort",field);setSort(field);setSortDirection(dir);}}
					padding="none"
				/></div>;
		}}</ReportQuery></React.Fragment>;
};
