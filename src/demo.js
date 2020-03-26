import React from 'react';
import ReportDisplay from './index';
import {executeDataQuery} from '../index'; //temporary

const report={
	_id: '5e7b8294cfefd5b0592a7256',
	label: 'Email Performance Demo',
	slug: 'email',
	version: '2.6',
	layouts: {
		lg: [
			{
				w: 2,
				h: 2,
				x: 0,
				y: 0,
				i: 'el_messages',
				moved: false,
				static: false
			},
			{
				w: 2,
				h: 2,
				x: 2,
				y: 0,
				i: 'el_sent',
				moved: false,
				static: false
			},
			{
				w: 2,
				h: 2,
				x: 4,
				y: 0,
				i: 'el_opened',
				moved: false,
				static: false
			},
			{
				w: 2,
				h: 2,
				x: 6,
				y: 0,
				i: 'el_open_rate',
				moved: false,
				static: false
			},
			{
				w: 2,
				h: 2,
				x: 8,
				y: 0,
				i: 'el_clicked',
				moved: false,
				static: false
			},
			{
				w: 2,
				h: 2,
				x: 10,
				y: 0,
				i: 'el_click_rate',
				moved: false,
				static: false
			},
			{
				w: 12,
				h: 6,
				x: 0,
				y: 2,
				i: 'el0',
				moved: false,
				static: false
			},
			{
				w: 12,
				h: 4,
				x: 0,
				y: 8,
				i: 'el_rates',
				moved: false,
				static: false
			},
			{
				w: 12,
				h: 8,
				x: 0,
				y: 12,
				i: 'el1',
				moved: false,
				static: false
			}
		]
	},
	include_date: null,
	data_sources_array: [
		{
			alias: 'default',
			warehouse_bot_id: 'frakturedb_b',
			table: 'stub_e_email_summary',
			bot_path: 'channelbots.StubBot.Email',
			method: 'getEmailTable',
			status_codes: null,
			date_field: 'publish_date',
			use_filter_params: null,
			filters: null,
			conditions: null,
			bot: { path: 'channelbots.StubBot.Email', method: 'getEmailTable' }
		}
	],
	components: {
		el_messages: {
			component: 'FraktureScorecard',
			label: 'Messages',
			metric: { fql: 'count(distinct message_id)' }
		},
		el_sent: {
			component: 'FraktureScorecard',
			label: 'Sent',
			metric: { fql: 'sum(email_sent)' }
		},
		el_opened: {
			component: 'FraktureScorecard',
			label: 'Opened',
			metric: { fql: 'sum(email_opened)' }
		},
		el_open_rate: {
			component: 'FraktureScorecard',
			label: 'Open Rate',
			metric: { fql: 'sum(email_opened)/sum(email_sent)', format: 'percent' }
		},
		el_clicked: {
			component: 'FraktureScorecard',
			label: 'Clicked',
			metric: { fql: 'sum(email_clicked)' }
		},
		el_click_rate: {
			component: 'FraktureScorecard',
			label: 'Click Rate',
			metric: { fql: 'sum(email_clicked)/sum(email_sent)', format: 'percent' }
		},
		el0: {
			component: 'FraktureBarChart',
			is_date: true,
			dimension: { fql: 'publish_date' },
			metrics: [
				{ label: 'Sent', fql: 'sum(email_sent)' },
				{ label: 'Opened', fql: 'sum(email_opened)' },
				{ label: 'Clicked', fql: 'sum(email_clicked)' }
			],
			sort: { fql: 'publish_date' }
		},
		el_rates: {
			component: 'FraktureBarChart',
			is_date: true,
			dimension: { fql: 'publish_date' },
			metrics: [
				{
					label: 'Open Rate',
					fql: 'sum(email_opened)/sum(email_sent)',
					format: 'percent'
				},
				{
					label: 'Click Rate',
					fql: 'sum(email_clicked)/sum(email_sent)',
					format: 'percent',
					yaxis: 'right'
				}
			],
			sort: { fql: 'publish_date' }
		},
		el1: {
			component: 'FraktureReportTable',
			dimensions: [
				{ label: 'Label', fql: 'label' },
				{ label: 'Subject', fql: 'subject' },
				{ label: 'Campaign', fql: 'campaign_name' },
				{ label: 'Send Date', fql: 'publish_date' },
				{ label: 'Source Code', fql: 'primary_source_code' }
			],
			metrics: [
				{ label: 'Sent', fql: 'sum(email_sent)' },
				{ label: 'Opened', fql: 'sum(email_opened)' },
				{
					label: 'Open Rate',
					fql: 'sum(email_opened)/sum(email_sent)',
					format: 'percent'
				},
				{ label: 'Clicked', fql: 'sum(email_clicked)' },
				{
					label: 'Click Rate',
					fql: 'sum(email_clicked)/sum(email_sent)',
					format: 'percent'
				},
				{ label: 'Unsubscribed', fql: 'sum(email_unsubscribes)' },
				{
					label: 'Unsub Rate',
					fql: 'sum(email_unsubscribes)/sum(email_sent)',
					format: 'percent'
				},
				{
					label: 'Bounces',
					fql: 'sum(email_soft_bounces+email_hard_bounces)'
				},
				{
					label: 'Bounce Rate',
					fql: 'sum(email_soft_bounces+email_hard_bounces)/sum(email_sent)',
					format: 'percent'
				}
			],
			order_by: { fql: 'publish_date', order_by_direction: 'DESC' }
		}
	},
	categories: [ 'Messaging' ],
	tags: []
};

export default function DemoReport(){
	return <ReportDisplay {...{report,executeDataQuery}}/>;
}
