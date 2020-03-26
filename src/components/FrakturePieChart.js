// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react';
import {Pie,PieChart,Legend,Cell,Tooltip} from "recharts";
import {ResponsiveContainer} from 'recharts';
import {ReportQuery} from "./Common";
import Typography from '@material-ui/core/Typography';
import {formatValue} from '../formatters';

export default function FrakturePieChart(props){
	let {key,warehouse_bot_id,table,dimension,metric,width,height,conditions,order_by,label="",get_color,limit=10}=props;

	let group_by=[dimension.fql];
	let pieFields=[
		{alias:"name",fql:dimension.fql},
		{alias:"value",fql:metric.fql}
	];
	order_by=order_by || {fql:dimension.fql,order_by_direction:"DESC"};
	let format=metric.format|| "";


	let variables={
		key,
		bot_id:warehouse_bot_id,
		table,
		fields:pieFields,
		group_by,
		conditions,
		order_by,
		limit
	};

	return <React.Fragment>
		{label && <Typography variant="h6">{label}</Typography>}
		<ReportQuery key="detail" width={width} height={height} variables={variables}>{({data}) => {
			if (data.length==0) return "No data available";
			if (data[0].name=="undefined"){
				throw new Error("Invalid data, no name");
			}
			return (
				<ResponsiveContainer>

					<PieChart width={width} height={(width / 2) + 30}>
						<Pie
							dataKey="value"
							data={data}
							startAngle={450} endAngle={90}
						>
							{
								data.map((entry, index) => <Cell key={`cell-${index}`} fill={get_color(index,entry.name)} />)
							}
						</Pie>
						<Tooltip formatter={
							(value, name)=>{
								return formatValue(value,format);
							}
						}/>
						<Legend layout='vertical' verticalAlign="middle" align="right"/>
					</PieChart>
				</ResponsiveContainer>
			);}}
		</ReportQuery>
	</React.Fragment>;
};
