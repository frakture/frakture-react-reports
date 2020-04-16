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
	let {name,warehouse_bot_id,table,dimension,metrics,breakdown:_breakdown,conditions,order_by,
		is_date,label="",get_color,width,height,qs}=props;
	if (!name) return "Name is required in props";
	let breakdown=[].concat(_breakdown).filter(Boolean);
	if (breakdown.length>1) throw new Error("Only one breakdown field allowed");
	breakdown=breakdown[0];
	let [refAreaLeft,setLeft]=useState();
	let [refAreaRight,setRight]=useState();
	const history=React.useContext(HistoryContext);
	const location=history.location;

	function xFormat(val){
		//console.log("Formatting ",val);
		let v=is_date?formatValue(val,"utcdate"):val;
		//console.log("Formatted ",v);
		return v;
	}
	let xAlias=dimension.alias || "col0";
	let xGroup=dimension;
	let xaxis=<XAxis dataKey={xAlias} tickFormatter={xFormat} />;
	let domain=null;
	if (is_date){
		let days=360; //default to about a year
		domain=[relativeDate("-3M").getTime(),relativeDate("now").getTime()];
		if (qs.start && qs.end){
			let start=relativeDate(qs.start).getTime();
			let end=relativeDate(qs.end).getTime();
			days=(end-start)/(24*60*60*1000);
			if (start<0){
				start="auto";
			}else{
				domain=[start,end];
			}
		}

		if (days>1200){
			xGroup={alias:xAlias,fql:"YEAR("+dimension.fql+")"};
		}else if (days>365){
			xGroup={alias:xAlias,fql:"MONTH("+dimension.fql+")"};
		}else if (days>180){
			xGroup={alias:xAlias,fql:"WEEK("+dimension.fql+")"};
		}else{
			xGroup={alias:xAlias,fql:"DAY("+dimension.fql+")"};
		}
		console.log('Start/end:',qs.start,qs.end,domain,days,xGroup);

		xaxis=<XAxis
			dataKey={xAlias}
			domain={domain}
			scale='time'
			type='number'
			padding={{ left: 10,right:10 }}
			tickFormatter={xFormat}
		/>;
	}


	let group_by=[xGroup,breakdown].filter(Boolean);
	let fields=[xGroup,breakdown].filter(Boolean).concat(metrics);
	fields.forEach((d,i)=>d.alias=d.alias || d.label || "col"+i);
	if (breakdown) breakdown.alias=breakdown.alias || breakdown.label || "_breakdown";

	order_by=order_by || xGroup;

	let variables={
		bot_id:warehouse_bot_id,
		table,
		fields,
		group_by,
		conditions,
		order_by
	};


	let formattersByName={};
	metrics.forEach(f=>{
		formattersByName[f.alias]=(val)=>formatValue(val,f.format);
	});

	let rightAxis=null;
	if (metrics.find(d=>d.yaxis=="right")){
		let r1=metrics.find(d=>d.yaxis=="right");
		function yFormatRight(val){
			return formatValue(val,r1.format);
		}
		rightAxis=<YAxis yAxisId="right" orientation='right' tickFormatter={yFormatRight}/>;
	}
	//find the first left format
	let left1=metrics.find(d=>d.yaxis!="right") ||{};
	function yFormatLeft(val){return formatValue(val,left1.format);}

	return <React.Fragment>
		{label && <Typography variant="h6">{label}</Typography>}
		<ReportQuery key="detail" name={name} width={width} height={height} variables={variables}>{({data}) => {
			//const width = 500;
			if (data.length==0) return "No data available";
			data=data.map(d=>{
				if (!is_date) return d;
				if (String(d[xAlias]).length==4){
					d[xAlias]=new Date(String(d[xAlias])+"-01-01").getTime(); // fix for year functions that don't return full date format
				}else{
					d[xAlias]=new Date(d[xAlias]).getTime();
				}
				if (domain && d[xAlias]<domain[0]){
					console.log("Ignoring ",d[xAlias], new Date(d[xAlias])," as before ",domain[0],new Date(domain[0]));
					return false;
				}
				if (domain && d[xAlias]>domain[1]) return false;
				return d;
			}).filter(Boolean);

			if (breakdown){
				let distinctBreakdown=Object.keys(data.reduce((a,d)=>{a[d[breakdown.alias]]=(a[d[breakdown.alias]]||0)+1; return a;},{}));
				let newData={};
				data.forEach(d=>{
					newData[d[xAlias]]=newData[d[xAlias]]||{};
					newData[d[xAlias]][xAlias]=d[xAlias];
					newData[d[xAlias]][d[breakdown.alias]]=d[metrics[0].alias];
				});
				data=Object.values(newData);
				fields=[{dummy:1}].concat(distinctBreakdown.map(d=>{
					formattersByName[d]=(val)=>formatValue(val,metrics[0].format);
					return {alias:d,yAxis:breakdown.yAxis,type:"bar",stackId:"stackA"};}));
			}
			function zoom(){
				if (refAreaLeft === refAreaRight || refAreaRight === '') {
					setLeft('');
					setRight('');
					return;
				}

				// xAxis domain
				if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];


				let query=queryString.parse(location.search) || {};
				query.start=refAreaLeft;
				query.end=refAreaRight;
				history.push({location:location.pathname,search:queryString.stringify(query)});

				setLeft(null);
				setRight(null);
				//alert(refAreaLeft+","+refAreaRight);
			}

			if (is_date){
				data.sort((a,b)=>{return a[xAlias]<b[xAlias]?-1:1});
			}

			return (
				<ResponsiveContainer>
					<ComposedChart
						width={500}
						height={400}
						data={data}
						margin={{
							top: 20, right: 20, bottom: 20, left: 20,
						}}
						onMouseDown={is_date?e => {setLeft(e.activeLabel);}:null}
						onMouseMove={is_date?e => refAreaLeft && setRight(e.activeLabel):null}
						onMouseUp={is_date?e=>zoom():null}
					>
						<CartesianGrid stroke="#f5f5f5" />
						{xaxis}
						<YAxis yAxisId="left" tickFormatter={yFormatLeft}/>
						{rightAxis}
						<Tooltip labelFormatter={(value) => is_date?formatValue(value,'utcdate'):value} formatter={
							(value, name)=>{
								return formattersByName[name](value);
							}
						}/>
						<Legend />
						{fields.map((f,i)=>{
							let color=f.color || get_color(i,f.alias);
							if (i==0) return ""; //this is the group by
							switch(f.type){
							case "bar": return <Bar key={i} yAxisId={f.yaxis||"left"} dataKey={f.alias} stackId={f.stackId||null} fill={color}/>;
							case "area":return <Area key={i} yAxisId={f.yaxis||"left"} type="monotone" dataKey={f.alias} fill={color} stroke={color} />;
							default: return <Line dot={false} connectNulls={false} key={i} yAxisId={f.yaxis||"left"} type="monotone" dataKey={f.alias} stroke={color} />;
							}
						})}
						{
							(refAreaLeft && refAreaRight) ? (
								<ReferenceArea yAxisId="left" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />) : null
						}
					</ComposedChart>
				</ResponsiveContainer>
			);}}
		</ReportQuery>
	</React.Fragment>;
};
