import React from 'react';
import {ReportQuery} from "./Common";
import {formatValue} from '../formatters';
import Typography from '@material-ui/core/Typography';


export default function FraktureScorecard(props){
	let {name,warehouse_bot_id,table,metric,width,height,conditions,include_previous=false,previous_conditions,label,size="md"}=props;

	const variables={
		bot_id:warehouse_bot_id,
		table,
		fields:[{alias:"value",fql:metric.fql}],
		conditions
	};

	return <ReportQuery name={name} variables={variables} width={width} height={height}>{({data}) => {
		if (data.length>1){return "Invalid query, more than one result";}
		let val=data[0].value;
		return (
			<div className="scorecard" style={{textAlign:"center"}}>
				{label && <Typography fontWeight="fontWeightBold" variant={variants[0]}>{label}</Typography>}
				<Typography variant={variants[1]}>{formatValue(val,metric.format)}</Typography>
				{include_previous && <ReportQuery name={name+"_prev"} variables={previousVariables}>{({data:prevData}) => {
					if (!prevData[0].value || prevData[0].value==0) return "";

					let diff=val-prevData[0].value;
					if (diff==0){
						console.log("No diff with conditions:",variables.conditions,previousVariables.conditions);
					}
					let prevPercent=prevData[0].value?formatValue(diff/prevData[0].value,'percent'):"N/A";
					return (diff>=0?
						(diff==0?"No change":
							<span className="text-success"> +{prevPercent} ({formatValue(diff,metric.format)})</span>)
						:
						<span className="text-danger"> {prevPercent} ({formatValue(diff,metric.format)})</span>);
				}}
				</ReportQuery>
				}

			</div>
		);}}
	</ReportQuery>;
};
