import React from 'react';

import queryString from 'query-string';
import {relativeDate} from "./formatters.js";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './styles.css';

import {Responsive,WidthProvider} from 'react-grid-layout';
import GridLayout from 'react-grid-layout';
import {getColorFunc} from './components/colors.js';
import {QuickDateRange} from './components/QueryStringInputs';
import Typography from '@material-ui/core/Typography';
import {DataQueryProvider} from './components/DataQueryContext';
import {HistoryProvider,HistoryContext} from './components/HistoryContext';

import FrakturePieChart from './components/FrakturePieChart';
import FraktureScorecard from './components/FraktureScorecard';
import FraktureBarChart from './components/FraktureBarChart';
import FraktureBubbleChart from './components/FraktureBubbleChart';
import FraktureStackedBarChart from './components/FraktureStackedBarChart';
import FraktureReportTable from './components/FraktureReportTable';
import FraktureWarehouseTable from './components/FraktureWarehouseTable';
import FraktureTextFilter from './components/FraktureTextFilter';
import FraktureQueryTextFilter from './components/FraktureQueryTextFilter';


const ResponsiveGridLayout = WidthProvider(Responsive);


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


const componentMap={
	FrakturePieChart,
	FraktureScorecard,
	FraktureReportTable,
	FraktureBarChart,
	FraktureBubbleChart,
	FraktureStackedBarChart,
	FraktureWarehouseTable,
	FraktureTextFilter
};

function ReportHeader(props){
	let {report,logo="https://frakturecdn.s3.amazonaws.com/accounts/frakture/frakture-icon-lg.png",menu,editing_tools}=props;
	let include_date=report.include_date || true;

	if (report.include_date===false) include_date=false;
	let {label,data_sources_array}=report;
	let filters=[];

	data_sources_array.forEach(ds=>{
		filters=filters.concat((ds.filters || []).map(f=>Object.assign({},ds,{field:f})));
	});
	let menuWrapper=[];

	if (logo){
		if (typeof logo=='string'){
			menuWrapper.push(<img src={logo} width="64" alt={label}/>);
		}else{
			menuWrapper.push(logo);
		}
	}
	if (menu){
		menuWrapper.push(menu);
	}else{
		console.log("No menu found in report");
	}

	return <div className="frakture-report-header">
		{menuWrapper.length && <div className="frakture-report-header-menu">{menuWrapper.map((d,i)=><span key={i}>{d}</span>)}</div>}
		{label && <Typography variant="h3" className="title">{label}</Typography>}
		{filters && filters.length>0 && <div>
			{filters.map((f,i)=><FraktureQueryTextFilter key={i} name={"filter"+i} {...f}/>) }
		</div>
		}
		<div>
			{include_date?<QuickDateRange/>
				:""
			}
			<div className="d-none d-md-block">
				{editing_tools}
			</div>
		</div>
	</div>;
}

function useUrlParamFilters() {
	const history=React.useContext(HistoryContext);
	const location=history.location;

	const rawQS=queryString.parse(location.search);
	const filters = {};
	Object.entries(rawQS)
		.filter(([k]) => k.indexOf('f.')==0)
		.forEach(([k,v]) => filters[k.split('f.')[1]]=v);
	return [filters, (filter,value) => {
		const realTimeQS = queryString.parse(location.search);
		realTimeQS['f.'+filter]=value||'';
		console.log('realTimeQS',realTimeQS);
		location.search = queryString.stringify(realTimeQS);
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
	if (!component) return "Component prop must be specified";
	delete props.component;

	let c=componentMap[component.component];
	if (!c){
		console.error("Could not find component for:",c);
		return <span>Component {component.component || '(not specified)'} not available</span>;
	}
	component.width=parseInt(style.width);
	component.height=parseInt(style.height);

	const [filterValues,setFilterValue]=useUrlParamFilters();
	component.filterValues=filterValues;
	component.setFilterValue=setFilterValue;
	if (!component.name) return "Could not find a name in the component";

	let element=null;
	let err=(<span>{component.label?<h4>{component.label}</h4>:""}Could not render</span>);

	if (editing){ //go ahead and use the element until we know we don't have to
		element=(<span>{component.label?<h4>{component.label}</h4>:""}{component.component}</span>);
	}else{
		try{
			element=React.createElement(c,component);
		}catch(e){
			console.error(e);
			return "Error with "+component.component;
		}
	}
	//delete props.component;
	return <div {...props}><ReportError contents={err}>{element}</ReportError>{children}</div>;
}

function assignContext({report:reportConfig}){
	let report=JSON.parse(JSON.stringify(reportConfig));

	const qs=queryString.parse(location.search);
	qs.start=relativeDate(qs.start || "-3M").toISOString();
	qs.end=relativeDate(qs.end|| "now").toISOString();
	if (report.include_date===false){delete qs.start; delete qs.end;}


	//Pre-fill in data sources, etc
	report.data_sources_array.forEach(data_source=>{
		data_source.conditions=data_source.conditions||[];
		if((data_source.filters && data_source.filters.length>0) || data_source.use_filter_params) {
			for (let i in qs){
				let s=i.split(".");
				if (s[0]=='f' && s[1] && qs[i]){
					let arr=qs[i].split(",").map(v=>v=="_blank"?"":v);
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
			if (qs.start){data_source.conditions.push({fql:data_source.date_field+">='"+qs.start+"'"});}
			if (qs.end){
				data_source.conditions.push({fql:data_source.date_field+"<'"+qs.end+"'"});
			}
			if (qs.start && qs.end){
				let s=new Date(qs.start).getTime();
				let e=new Date(qs.end).getTime();
				let previous_end=new Date(s).toISOString();
				let previous_start=new Date(s-(e-s)).toISOString();
				//This is for components that calculate data from the previous period
				data_source.previous_conditions.push({fql:data_source.date_field+">='"+previous_start+"'"});
				data_source.previous_conditions.push({fql:data_source.date_field+"<'"+previous_end+"'"});
			}
		}
	});

	for (let name in report.components){
		let c=report.components[name];
		c.name=name;
		c.qs=qs;
		let data_source=report.data_sources_array.find(ds=>ds.alias==c.data_source)
								|| report.data_sources_array.find(ds=>ds.alias=="default");
		if(c.data_source && c.data_source != data_source.alias) throw new Error('No data_source with alias: '+c.data_source);
		if (data_source){
			c.table=data_source.table;
			c.warehouse_bot_id=data_source.warehouse_bot_id;
			c.conditions=(c.conditions || []).concat(data_source.conditions ||[]);
			c.previous_conditions=(c.previous_conditions || []).concat(data_source.previous_conditions ||[]);
		}
	}
	return report;
}

export function DemoGrid(){
	// layout is an array of objects, see the demo for more complete usage
	const layout = [
		{i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
		{i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
		{i: 'c', x: 4, y: 0, w: 1, h: 2}
	];
	return (
		<GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
			<div key="a">a</div>
			<div key="b">b</div>
			<div key="c">c</div>
		</GridLayout>
	);
}
export function ReportDisplayContext(props){
	let {report:_report,
		editing=false,
		editing_tools,
		onLayoutChange,
		logo,
		menu}=props;

	let report=null;
	try{
		report=assignContext({report:_report});
	}catch(e){
		console.error("Invalid report:",_report);
		return e.message || e.toString();
	}


	//Try just the lg
	let layouts={lg:(report.layouts||{}).lg};


	let arr=Object.keys(report.components||{}).map(name=>{
		let config=report.components[name];

		if (!config.component){
			console.error("Could not find a component with keys:",Object.keys(config));
			return null;
		}
		config.name=name;
		return config;
	}).filter(Boolean);
	if (arr.length==0){
		console.log(report);
		return "No components in this report";
	};

	let get_color=getColorFunc("dcMetroColors");
	//let currentLayoutName="lg";
	console.log("Rendering Frakture reporting with editing=",editing);

	return <div className={`frakture-report${editing?"frakture-report-editing":""}`>
		<ReportHeader menu={menu} logo={logo} report={report} editing_tools={editing_tools}/>
		<ResponsiveGridLayout
			isDraggable={editing}
			isResizable={editing}
			layouts={layouts}
			layout={layouts.lg}
			cols={{xl:12,lg:12,md:12,sm:1,xs:1}}
			rowHeight={50}
			onLayoutChange={onLayoutChange}
		>{arr.map((a)=>{
				a.get_color=get_color;
				return <ComponentWrapper key={a.name} component={a} editing={editing?true:undefined}/>;
			}).filter(Boolean)}
		</ResponsiveGridLayout>
	</div>;
};


export function ReportDisplay(props){
	let {
		executeDataQuery,
		ExecuteDataQuery,
		history
	}=props;
	if (!history) return "You must provide a history object";
	executeDataQuery=executeDataQuery || ExecuteDataQuery;
	if (!executeDataQuery) return "You must provide an ExecuteDataQuery hook";

	return <HistoryProvider history={history}>
		<DataQueryProvider executeDataQuery={executeDataQuery}>
			<ReportDisplayContext {...props}/>
		</DataQueryProvider>
	</HistoryProvider>;
};
