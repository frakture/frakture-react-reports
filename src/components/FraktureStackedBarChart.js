// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react';
import {HistoryContext} from './HistoryContext';
import {
	Area,
	Bar,
	ComposedChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,CartesianGrid,
	Line,YAxis,Legend,ReferenceArea
} from "recharts";
import queryString from 'query-string';
import {ReportQuery} from "./Common";
import Typography from '@material-ui/core/Typography';
import {formatValue,relativeDate} from '../formatters';

export default function FraktureBarChart(props){
	let {name,warehouse_bot_id,table,dimension,metrics,conditions,order_by,
		label="",get_color,width,height,qs}=props;
	if (!name) return "Name is required in props";
	let [refAreaLeft,setLeft]=useState();
	let [refAreaRight,setRight]=useState();
	const history=React.useContext(HistoryContext);
	const location=history.location;

	let xAlias=dimension.alias || "col0";
	let xGroup=dimension;
	let xaxis=<XAxis dataKey={xAlias} />;
	let domain=null;

	let group_by=dimension;
	let fields=[].concat(dimension).concat(metrics);
	fields.forEach((d,i)=>d.alias=d.alias || d.label || "col"+i);

	order_by=order_by || xGroup;

	let variables={
		bot_id:warehouse_bot_id,
		table,
		fields,
		group_by,
		conditions,
		order_by
	};


	function formatter(value, name){
		return formatValue(value,metrics[0].format);
	}

	//find the first left format
	let left1=metrics.find(d=>d.yaxis!="right") ||{};
	function yFormatLeft(val){return formatValue(val,left1.format);}

	return <React.Fragment>
		{label && <Typography variant="h6">{label}</Typography>}
		<ReportQuery key="detail" name={name} width={width} height={height} variables={variables}>{({data}) => {
			if (data.length==0) return "No data available";

			let transpose={};
			fields.slice(1).forEach(f=>{
				transpose[f.alias]={name:f.alias};
			});
			let bars={};
			data.forEach(d=>{bars[d[xAlias]]=true;});

			fields.slice(1).forEach(f=>{
				data.forEach(d=>{
					Object.keys(bars).forEach(bar=>{
						if (bar!=d[xAlias]) return;
						transpose[f.alias][bar]=d[f.alias];
					});
				})
			});

			//return <pre>{JSON.stringify(data,null,2)}</pre>;
			//return <pre>{JSON.stringify(Object.values(transpose),null,2)}</pre>;

			data=Object.values(transpose);

			return (
				<ResponsiveContainer>
					<ComposedChart
						width={500}
						height={400}
						data={data}
						margin={{
							top: 20, right: 20, bottom: 20, left: 20,
						}}
					>
						<CartesianGrid stroke="#f5f5f5" />
						<XAxis dataKey="name"/>
						<YAxis tickFormatter={yFormatLeft}/>
						<Tooltip formatter={formatter}/>
						<Legend />
						{Object.keys(bars).map((f,i)=>{
							let color=f.color || get_color(i,f);
							return <Bar key={i} dataKey={f} stackId="a" fill={color}/>;
						})}
					</ComposedChart>
				</ResponsiveContainer>
			);}}
		</ReportQuery>
	</React.Fragment>;
};
