import React from 'react';

import queryString from 'query-string';
import {relativeDate} from "./formatters.js";
import 'react-grid-layout/css/styles.css';
import {Responsive,WidthProvider} from 'react-grid-layout';
import Paper from '@material-ui/core/Paper';
import {getColorFunc} from './components/colors.js';
import {QuickDateRange,QueryStringForm} from './components/QueryStringInputs';
import Typography from '@material-ui/core/Typography';
import {DataQueryProvider} from './components/DataQueryContext';

import FrakturePieChart from './components/FrakturePieChart';
import FraktureScorecard from './components/FraktureScorecard';
import FraktureBarChart from './components/FraktureBarChart';
import FraktureReportTable from './components/FraktureReportTable';
import FraktureWarehouseTable from './components/FraktureWarehouseTable';
import FraktureTextFilter from './components/FraktureTextFilter';
import FraktureQueryTextFilter from './components/FraktureQueryTextFilter';

import {useHistory,useLocation} from 'react-router-dom';

const ResponsiveGridLayout = WidthProvider(Responsive);

function ReportError(){
	return null;
}

/*
//This struggles in certain compiling environments
class ReportError extends React.Component {

	constructor(props) {
		super(props);
		this.state = { hasError: false,error:null };
	}

	componentDidCatch(error) {
		console.error("Caught an error at the top level",error);
		this.setState({ hasError: true,error:error });
		// You can also log the error to an error reporting service
		//logErrorToMyService(error, info);
	}

	render(props) {
		if (this.state.hasError) {
			let content=(props||{}).content;
			if (!content) content=(<div>Could not render</div>);
			return content;
		}

		return this.props.children;
	}
}
*/




const componentMap={
	FrakturePieChart,
	FraktureScorecard,
	FraktureReportTable,
	FraktureBarChart,
	FraktureWarehouseTable,
	FraktureTextFilter
};

function ReportHeader(props){
	let {report,editing_tools}=props;
	let include_date=report.include_date || true;

	if (report.include_date===false) include_date=false;
	let {label,logo="https://frakturecdn.s3.amazonaws.com/accounts/frakture/frakture-icon-lg.png",agency_logo,data_sources_array}=report;
	let filters=[];
	data_sources_array.forEach(ds=>{
		filters=filters.concat((ds.filters || []).map(f=>Object.assign({},ds,{field:f})));
	});

	return <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
		<img className="d-none d-md-block" src={logo} width="64" alt={report.account_id}/>
		<Typography variant="h3" className="title">{label}</Typography>
		{filters && filters.length>0 && <div>
			{filters.map((f,i)=><FraktureQueryTextFilter key={i} {...f}/>) }
		</div>
		}
		<div>
			{agency_logo && <img src={agency_logo} width="64"/>}
			{include_date?
				<QueryStringForm>
					{ ({onChange,values}) => {

						return (<div className="mb-0" style={{"justifyContent":"flex-end"}}>
							<QuickDateRange
								start={values.start || "-3M"}
								end={values.end}
								onChange={onChange}/>
						</div>);}
					}</QueryStringForm>
				:""
			}
			<div className="d-none d-md-block">
				{editing_tools}
			</div>
		</div>
	</div>;
}

function useUrlParamFilters() {
	const history=useHistory();
	const location=useLocation();

	const rawParams=queryString.parse(location.search);
	const filters = {};
	Object.entries(rawParams)
		.filter(([k]) => k.indexOf('f.')==0)
		.forEach(([k,v]) => filters[k.split('f.')[1]]=v);
	return [filters, (filter,value) => {
		const realTimeParams = queryString.parse(location.search);
		realTimeParams['f.'+filter]=value||'';
		console.log('realTimeParams',realTimeParams);
		location.search = queryString.stringify(realTimeParams);
		console.log(location);
		setTimeout(()=>history.push(location),0);
	}];
}

/*
styles, classNames, and some click/drag functions are added by ResponsiveGrid, so wrap to provide them directly
as width/height to child elements
*/
function ComponentWrapper(_props){
	let props=Object.assign({},_props);
	const {component,editing,style,children}=props;
	delete props.component;

	let c=componentMap[component.component];
	if (!c){
		console.error("Could not find component for:",c);
		return <span>Component {component.component || '(not specified)'} not available</span>;
	}
	component.width=parseInt(style.width);
	component.height=parseInt(style.height);
	if (editing) style.border="1px solid #AAA";

	const [filterValues,setFilterValue]=useUrlParamFilters();
	component.filterValues=filterValues;
	component.setFilterValue=setFilterValue;

	let element=null;
	let err=(<span>{component.label?<h4>{component.label}</h4>:""}Could not render</span>);
	if (editing){ //go ahead and use the element until we know we don't have to
		element=(<span>{component.label?<h4>{component.label}</h4>:""}{component.component}</span>);
	}else{
		element=React.createElement(c,component);
	}
	//delete props.component;
	return <div {...props}><ReportError contents={err}>{element}</ReportError>{children}</div>;
}

function assignContext({report:reportConfig}){
	let report=JSON.parse(JSON.stringify(reportConfig));
	let location=useLocation();

	const params=queryString.parse(location.search);
	params.start=relativeDate(params.start || "-3M").toISOString();
	params.end=relativeDate(params.end|| "now").toISOString();
	if (report.include_date===false){delete params.start; delete params.end;}

	// if (document.location.href.indexOf("local.frakture.com")>=0){
	// 	let local=require("./config/"+report.slug+".js");
	// 	if (!local) return "Local config could not find "+report.slug+".js";
	// 	report=extend(true,report,local);
	// 	//return JSON.stringify(report);
	// }

	//Pre-fill in data sources, etc
	report.data_sources_array.forEach(data_source=>{
		data_source.conditions=data_source.conditions||[];
		if((data_source.filters && data_source.filters.length>0) || data_source.use_filter_params) {
			for (let i in params){
				let s=i.split(".");
				if (s[0]=='f' && s[1] && params[i]){
					let arr=params[i].split(",").map(v=>v=="_blank"?"":v);
					if (arr.length==1){
						data_source.conditions.push({fql:s[1]+"="+`"${arr[0]}"`});
					}else{
						data_source.conditions.push({fql:s[1]+" IN ("+arr.map(v=>'"'+v+'"').join(",")+")"});
					}
				}
			}
		}

		if (data_source.date_field){
			data_source.previous_conditions=JSON.parse(JSON.stringify(data_source.conditions));
			if (params.start){data_source.conditions.push({fql:data_source.date_field+">='"+params.start+"'"});}
			if (params.end){
				data_source.conditions.push({fql:data_source.date_field+"<'"+params.end+"'"});
			}
			if (params.start && params.end){
				let s=new Date(params.start).getTime();
				let e=new Date(params.end).getTime();
				let previous_end=new Date(s).toISOString();
				let previous_start=new Date(s-(e-s)).toISOString();
				//This is for components that calculate data from the previous period
				data_source.previous_conditions.push({fql:data_source.date_field+">='"+previous_start+"'"});
				data_source.previous_conditions.push({fql:data_source.date_field+"<'"+previous_end+"'"});
			}
		}
	});

	for (let key in report.components){
		let c=report.components[key];
		c.key=key;
		c.params=params;
		let data_source=report.data_sources_array.find(ds=>ds.alias==c.data_source)
								|| report.data_sources_array.find(ds=>ds.alias=="default");
		if(c.data_source && c.data_source != data_source.alias) throw new Error('No data_source with alias: '+c.data_source);
		if (data_source){
			console.log("Using data source:",data_source);
			c.table=data_source.table;
			c.warehouse_bot_id=data_source.warehouse_bot_id;
			c.conditions=(c.conditions || []).concat(data_source.conditions ||[]);
			c.previous_conditions=(c.previous_conditions || []).concat(data_source.previous_conditions ||[]);
		}
	}
	return report;
}

export function ReportDisplay(props){
	let {report:_report,
		editing=false,
		editing_tools,
		onLayoutChange,
		executeDataQuery}=props;
	if (!executeDataQuery) return "You must provide an executeDataQuery function";

	let report=assignContext({report:_report});
	//Try just the lg
	let layouts={lg:(report.layouts||{}).lg};

	let arr=Object.keys(report.components||{}).map(key=>{
		let config=report.components[key];
		if (!config.component){
			console.error("Could not find a component for key "+key+" with keys:",Object.keys(config));
			return null;
		}
		return Object.assign(config,{key});
	}).filter(Boolean);
	if (arr.length==0){
		console.log(report);
		return "No components in this report";
	};

	let get_color=getColorFunc("dcMetroColors");
	//let currentLayoutName="lg";

	return <DataQueryProvider executeDataQuery={executeDataQuery}>
		<Paper className="report">
			<ReportHeader report={report} editing_tools={editing_tools}/>
			<ResponsiveGridLayout
				isDraggable={editing}
				isResizable={editing}
				layouts={layouts}
				cols={{xl:12,lg: 12, md: 12, sm: 12, xs: 1,xxs:1}}
				rowHeight={50}
				onLayoutChange={onLayoutChange}
			>{arr.map((a)=>{
					a.get_color=get_color;
					try{
						return (<ComponentWrapper component={a} editing={editing?true:undefined} key={a.key}/>);
					}catch(e){
						console.error("Error creating element:",e);
					}
				}).filter(Boolean)}
			</ResponsiveGridLayout>
		</Paper>
	</DataQueryProvider>;
};
