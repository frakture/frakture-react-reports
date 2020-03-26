import React from 'react';

const MarketingTableCell = ({data}) => {
	const {id, name, desc, budget, growth} = data;
	const iconName = growth > 0 ? "up" : "down";
	const statusStyle = growth > 0 ? " text-success" : "text-danger";
	return (
		<tr
			tabIndex={-1}
			key={id}
		>
			<td>
				<div className="user-profile py-2 d-flex flex-row align-items-center">
					<div className="user-detail">
						<h5 className="user-name">{name} </h5>
						<span className="text-light-grey jr-fs-sm">{desc}</span>
					</div>
				</div>
			</td>
			<td>
				<h5 className="mb-0">${budget}</h5>
				<span className="text-light-grey jr-fs-sm">Spent</span>
			</td>
			<td className="text-right">
				<div className={`${statusStyle}`}>
					<i className={`zmdi zmdi-trending-${iconName}`}/> {growth}</div>
				<div className="text-light-grey jr-fs-sm text-capitalize">{iconName}</div>
			</td>
		</tr>

	);
};


export default function MessageList({data}){

	return <div className="jr-card jr-full-card overflow-hiden">
		<div className="jr-card-header d-flex align-items-start pb-2"><div className="mr-auto"><h3 className="card-heading">
			<span>Messages</span></h3></div>
		<button className="MuiButtonBase-root MuiIconButton-root icon-btn text-dark" tabindex="0" type="button"><span className="MuiIconButton-label"><i className="zmdi zmdi-chevron-down"></i></span><span className="MuiTouchRipple-root"></span></button>
		</div>
		<div className="jr-comments">
			{[0,1,2,3].map((d,i)=>{return(
				<div key={i} className="media media-list"><img title="" alt="" className="rounded-circle avatar size-60 mr-3" src="https://via.placeholder.com/150x150"/>
					<div className="media-body"><h5 className="mt-0">John Smith commented on 4 keys to make your business unique</h5>
						<p className="card-text">Thank you for posting such a wonderful content. The writing was outstanding. Subscribed to latest from you as well :)</p>
						<div className="comment-footer">
							<button className="MuiButtonBase-root MuiButton-root mr-4 MuiButton-contained MuiButton-containedPrimary MuiButton-sizeSmall" tabindex="0" type="button">
								<span className="MuiButton-label">APPROVE</span><span 			className="MuiTouchRipple-root"></span>
							</button>
							<button className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedSecondary MuiButton-sizeSmall" tabindex="0" type="button"><span className="MuiButton-label">DENY</span>
								<span className="MuiTouchRipple-root"></span></button>
						</div></div>
					<button className="MuiButtonBase-root MuiIconButton-root icon-btn p-1 ml-2" tabindex="0" type="button"><span className="MuiIconButton-label"><i className="zmdi zmdi-close"></i></span><span className="MuiTouchRipple-root"></span></button>
				</div>);}
			)}
		</div>
	</div>;

	return (
		<div className="table-responsive-material markt-table">
			<table className="table default-table table-sm full-table remove-table-border table-hover mb-0">
				<tbody>
					{(data||[]).map(data => {
						return (
							<MarketingTableCell key={data.id} data={data}/>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
