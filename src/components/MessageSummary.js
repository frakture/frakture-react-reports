import React from 'react';


export default function MessageSummary(){
	return (
		<div className="jr-card">
			<div className="jr-card-header d-flex align-items-center">
				<h3 className="mb-0">Email Performance</h3>
			</div>
			<div className="row mb-3">
				<div className="col-6 col-sm-4 col-md-3 col-lg-2">
					<span className="d-flex align-items-center mb-2">
						<i className="zmdi zmdi-calendar-check text-muted chart-f20"/>
						<span className="ml-3 text-dark">48548</span>
					</span>
					<p className="text-muted">Emails Sent</p>
				</div>
				<div className="col-6 col-sm-4 col-md-3 col-lg-2">
					<span className="d-flex align-items-center mb-2">
						<i className="zmdi zmdi-calendar-note text-muted chart-f20"/>
						<span className="ml-3 text-dark">6,875</span>
					</span>
					<p className="text-muted">Orders Weekly</p>
				</div>
				<div className="col-6 col-sm-4 col-md-3 col-lg-2">
					<span className="d-flex align-items-center mb-2">
						<i className="zmdi zmdi-money-box text-muted chart-f20"/>
						<span className="ml-3 text-dark">$210,213</span>
					</span>
					<p className="text-muted">Average Revenue</p>

				</div>
				<div className="col-6 col-sm-4 col-md-3 col-lg-2">
					<span className="d-flex align-items-center mb-2">
						<i className="zmdi zmdi-money-box text-muted chart-f20"/>
						<span className="ml-3 text-dark">$692,874</span>
					</span>
					<p className="text-muted">Total Revenue</p>
				</div>
				<div className="col-6 col-sm-4 col-md-3 col-lg-2">
					<span className="d-flex align-items-center mb-2">
						<i className="zmdi zmdi-calendar text-muted chart-f20"/>
						<span className="ml-3 text-dark">9,223</span>
					</span>
					<p className="text-muted">Total Orders</p>
				</div>
				<div className="col-6 col-sm-4 col-md-3 col-lg-2">
					<span className="d-flex align-items-center mb-2">
						<i className="zmdi zmdi-calendar-alt text-muted chart-f20"/>
						<span className="ml-3 text-dark">8,543</span>
					</span>
					<p className="text-muted">Past Orders</p>
				</div>
			</div>
		</div>
	);
};
