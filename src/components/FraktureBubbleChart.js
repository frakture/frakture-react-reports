// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react';
import {
	Area,
	Bar,
	Scatter,ScatterChart,
	ResponsiveContainer,
	Tooltip,
	Cell,
	LabelList,
	XAxis,CartesianGrid,
	Line,YAxis,ZAxis,Legend,ReferenceArea
} from "recharts";
import queryString from 'query-string';
import {ReportQuery} from "./Common";
import Typography from '@material-ui/core/Typography';
import {formatValue,relativeDate} from '../formatters';

export default function FraktureBarChart(props){
	let {name,warehouse_bot_id,table,dimension,metrics,conditions,order_by,
		label="",get_color,width,height,qs}=props;
	if (!name) return "Name is required in props";

	let group_by=dimension;
	let fields=[].concat(dimension).concat(metrics);
	fields.forEach((d,i)=>d.alias=d.alias || d.label || "col"+i);

	let xAlias=metrics[0].alias;
	let yAlias=metrics[1].alias;
	let zAlias=metrics[2].alias;

	let domain=null;

	let variables={
		bot_id:warehouse_bot_id,
		table,
		fields,
		group_by,
		conditions,
		order_by
	};


	function xFormat(val){return formatValue(val,metrics[0].format);}
	function yFormat(val){return formatValue(val,metrics[1].format);}
	function formatter(value, name){
		return formatValue(value,metrics[0].format);
	}

	return <React.Fragment>
		{label && <Typography variant="h6">{label}</Typography>}
		<ReportQuery key="detail" name={name} width={width} height={height} variables={variables}>{({data}) => {
			if (data.length==0) return "No data available";
			data.forEach((d,i)=>{
				d.color=get_color(i,d[fields[0].alias]);
				d.label=d[fields[0].alias];
			});

			return (
				<ResponsiveContainer>
					<ScatterChart
						width={500}
						height={400}
						margin={{top: 20, right: 20, bottom: 20, left: 20}}
					>
						<CartesianGrid stroke="#f5f5f5" />
						<XAxis type="number" dataKey={xAlias} label={xAlias} tickFormatter={xFormat}
								padding={{ left: 60,right:10 }}
						/>
						<YAxis type="number" dataKey={yAlias} label={yAlias} tickFormatter={yFormat}
							padding={{bottom:60 }}
						/>
						<ZAxis type="number" dataKey={zAlias} name={zAlias} range={[200, 2000]} />
						<Tooltip cursor={{strokeDasharray: '3 3'}}/>
						<Legend />
						<Scatter name={zAlias} data={data} fill="#8884d8">
						<LabelList dataKey="label" style={{pointerEvents: 'none',fontWeight:"bold",fontSize:"18px",color:"#111",fill: "rgba(0, 0, 0, 0.87)"}}/>
						{data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}

		        </Scatter>
					</ScatterChart>
				</ResponsiveContainer>
			);}}
		</ReportQuery>
	</React.Fragment>;
};
