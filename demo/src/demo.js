const report={
  _id: '5e443372855b3d4f38832e8c',
	logo:"https://frakturecdn.s3.amazonaws.com/accounts/frakture/frakture-icon-lg.png",
  label: 'Frakture React Charts Sample',
  slug: 'source_code_channel',
  version: '2.6',
  layouts: {
  lg: [
		{
      w: 8,
      h: 5,
      x: 0,
      y: 0,
      i: 'revenue_chart',
      moved: false,
      static: false
    },
    {
      w: 4,
      h: 5,
      x: 8,
      y: 0,
      i: 'revenue_pie',
      moved: false,
      static: false
    },
		/*
    { w: 2, h: 2, x: 0, y: 0, i: 'el0', moved: false, static: false },
    {
      w: 2,
      h: 2,
      x: 4,
      y: 0,
      i: 'elspend',
      moved: false,
      static: false
    },
    {
      w: 2,
      h: 2,
      x: 2,
      y: 0,
      i: 'eltrans',
      moved: false,
      static: false
    },
    { w: 2, h: 2, x: 8, y: 0, i: 'elroi', moved: false, static: false },
    { w: 2, h: 2, x: 6, y: 0, i: 'el1', moved: false, static: false },
    {
      w: 2,
      h: 2,
      x: 10,
      y: 0,
      i: 't_originated',
      moved: false,
      static: false
    },
    {
      w: 8,
      h: 4,
      x: 0,
      y: 11,
      i: 'imp_chart',
      moved: false,
      static: false
    },
    {
      w: 4,
      h: 4,
      x: 8,
      y: 11,
      i: 'imp_pie',
      moved: false,
      static: false
    },
    {
      w: 8,
      h: 4,
      x: 0,
      y: 15,
      i: 'click_chart',
      moved: false,
      static: false
    },
    {
      w: 4,
      h: 4,
      x: 8,
      y: 15,
      i: 'click_pie',
      moved: false,
      static: false
    },
    {
      w: 8,
      h: 4,
      x: 0,
      y: 7,
      i: 'spend_chart',
      moved: false,
      static: false
    },
    {
      w: 4,
      h: 4,
      x: 8,
      y: 7,
      i: 'spend_pie',
      moved: false,
      static: false
    },

    {
      w: 8,
      h: 5,
      x: 0,
      y: 19,
      i: 'origin_revenue_chart',
      moved: false,
      static: false
    },
    {
      w: 4,
      h: 5,
      x: 8,
      y: 19,
      i: 'origin_revenue_pie',
      moved: false,
      static: false
    },
    {
      w: 12,
      h: 4,
      x: 0,
      y: 24,
      i: 'sheet_by_channel',
      moved: false,
      static: false
    },
    { w: 12, h: 9, x: 0, y: 28, i: 'el5', moved: false, static: false }
		*/
  ]
},
  include_date: true,
  data_sources_array: [
    {
      alias: 'default',
      warehouse_bot_id: 'mysql_ezh',
      table: 'source_code_summary_by_date',
      bot_path: 'channelbots.ActBlueBot.Transactions',
      method: 'getSourceCodeSummaryByDateTable',
      status_codes: null,
      date_field: 'date',
      //use_filter_params: true,
      //filters: [Array],
      conditions: null,
      __typename: 'ReportDataSource'
    }
  ],
	 components: {
		 revenue_chart: {
 	    label: 'Revenue',
 	    component: 'FraktureBarChart',
 	    is_date: true,
 	    dimension: { fql: 'date' },
 	    breakdown: {
 	      fql: "case when source_code_channel='' or source_code_channel is null then 'N/A' else source_code_channel end"
 	    },
 	    metrics: [
 	      {
 	        label: 'Direct Transactions',
 	        fql: 'sum(revenue)',
 	        type: 'bar',
 	        format: 'currency'
 	      }
 	    ]
 	  },
 	  revenue_pie: {
 	    component: 'FrakturePieChart',
 	    label: 'Revenue Breakdown',
 	    dimension: {
 	      fql: "case when source_code_channel='' or source_code_channel is null then 'N/A' else source_code_channel end"
 	    },
 	    metric: { fql: 'sum(revenue)', format: 'currency' }
 	  }
	},
	components_other:{
	  el0: {
	    component: 'FraktureScorecard',
	    label: 'Amount',
	    metric: { fql: 'sum(revenue)', format: 'currency' }
	  },
	  elspend: {
	    component: 'FraktureScorecard',
	    label: 'Spent',
	    metric: { fql: 'sum(spend)', format: 'currency' }
	  },
	  eltrans: {
	    component: 'FraktureScorecard',
	    label: 'Transactions',
	    metric: { fql: 'count(*)' }
	  },
	  elroi: {
	    component: 'FraktureScorecard',
	    label: 'ROI',
	    metric: { fql: 'sum(revenue)/sum(spend)', format: 'percent' }
	  },
	  el1: {
	    component: 'FraktureScorecard',
	    label: 'Average',
	    metric: { fql: 'avg(revenue)', format: 'currency' }
	  },
	  t_originated: {
	    component: 'FraktureScorecard',
	    label: 'Total from newly acquired people',
	    metric: { fql: 'sum(origin_transaction_revenue)', format: 'currency' }
	  },
	  imp_chart: {
	    label: 'Impressions',
	    component: 'FraktureBarChart',
	    is_date: true,
	    dimension: { fql: 'date' },
	    breakdown: {
	      fql: "case when source_code_channel='' or source_code_channel is null then 'N/A' else source_code_channel end"
	    },
	    metrics: [ { label: 'Impressions', fql: 'sum(impressions)', type: 'bar' } ],
	    conditions: [ { fql: 'spend>0' } ]
	  },
	  imp_pie: {
	    component: 'FrakturePieChart',
	    label: 'Impressions',
	    dimension: {
	      fql: "case when source_code_channel='' or source_code_channel is null then 'N/A' else source_code_channel end"
	    },
	    metric: { fql: 'sum(impressions)' }
	  },
	  click_chart: {
	    label: 'Clicks',
	    component: 'FraktureBarChart',
	    is_date: true,
	    dimension: { fql: 'date' },
	    breakdown: {
	      fql: "case when source_code_channel='' or source_code_channel is null then 'N/A' else source_code_channel end"
	    },
	    metrics: [ { label: 'Clicks', fql: 'sum(clicks)', type: 'bar' } ]
	  },
	  click_pie: {
	    component: 'FrakturePieChart',
	    label: 'Clicks',
	    dimension: {
	      fql: "case when source_code_channel='' or source_code_channel is null then 'N/A' else source_code_channel end"
	    },
	    metric: { fql: 'sum(clicks)' }
	  },
	  spend_chart: {
	    label: 'Spend',
	    component: 'FraktureBarChart',
	    is_date: true,
	    dimension: { fql: 'date' },
	    breakdown: {
	      fql: "case when source_code_channel='' or source_code_channel is null then 'N/A' else source_code_channel end"
	    },
	    metrics: [
	      {
	        label: 'Total Amount',
	        fql: 'sum(spend)',
	        type: 'bar',
	        format: 'currency'
	      }
	    ]
	  },
	  spend_pie: {
	    component: 'FrakturePieChart',
	    label: 'Spend',
	    dimension: {
	      fql: "case when source_code_channel='' or source_code_channel is null then 'N/A' else source_code_channel end"
	    },
	    metric: { fql: 'sum(spend)', format: 'currency' }
	  },
	  origin_revenue_chart: {
	    label: 'Revenue By Original Source',
	    component: 'FraktureBarChart',
	    is_date: true,
	    dimension: { fql: 'date' },
	    breakdown: {
	      fql: "case when source_code_channel='' or source_code_channel is null then 'N/A' else source_code_channel end"
	    },
	    metrics: [
	      {
	        label: 'Origin transaction',
	        fql: 'sum(origin_transaction_revenue)',
	        type: 'bar',
	        format: 'currency'
	      }
	    ]
	  },
	  origin_revenue_pie: {
	    component: 'FrakturePieChart',
	    label: 'Revenue By Origin',
	    dimension: {
	      fql: "case when source_code_channel='' or source_code_channel is null then 'N/A' else source_code_channel end"
	    },
	    metric: { fql: 'sum(origin_transaction_revenue)', format: 'currency' }
	  },
	  sheet_by_channel: {
	    component: 'FraktureReportTable',
	    label: 'By Channel',
	    dimensions: [
	      {
	        label: 'Source Code Channel',
	        fql: "case when source_code_channel='' or source_code_channel is null then 'N/A' else source_code_channel end"
	      }
	    ],
	    metrics: [
	      {
	        label: 'Impressions',
	        fql: 'sum(impressions)',
	        description: ''
	      },
	      { label: 'Clicks', fql: 'sum(clicks)', description: '' },
	      {
	        label: 'Spend',
	        fql: 'sum(spend)',
	        format: 'currency',
	        description: ''
	      },
	      {
	        label: 'Acquisition Cost',
	        fql: 'sum(acquisition_cost)',
	        description: ''
	      },
	      {
	        label: 'Last Click Transactions',
	        fql: 'sum(transactions)',
	        format: '',
	        description: 'One-time and recurring transactions with this source code'
	      },
	      {
	        label: 'Last Click Revenue',
	        fql: 'sum(revenue)',
	        format: 'currency',
	        description: 'One-time and recurring transaction amount with this source code'
	      },
	      {
	        label: 'Last Click Average',
	        fql: 'sum(revenue)/sum(transactions)',
	        format: 'currency'
	      },
	      {
	        label: 'Acquired People',
	        fql: 'sum(origin_person_count)',
	        description: 'People whose first interaction has this source code'
	      },
	      {
	        label: 'Acquired Transactions',
	        fql: 'sum(origin_transaction_count)',
	        description: 'All transactions from people whose first interaction has this source code'
	      },
	      {
	        label: 'Acquired Revenue',
	        fql: 'sum(origin_transaction_revenue)',
	        format: 'currency',
	        description: 'All transaction revenue from people whose first interaction has this source code'
	      }
	    ],
	    order_by: {
	      fql: "case when source_code_channel='' or source_code_channel is null then 'N/A' else source_code_channel end"
	    }
	  },
	  el5: {
	    component: 'FraktureReportTable',
	    label: 'Top Source Codes',
	    dimensions: [ { label: 'Source Code', fql: 'source_code' } ],
	    metrics: [
	      {
	        label: 'First Transaction',
	        fql: 'min(first_transaction_date)',
	        format: 'date',
	        description: ''
	      },
	      {
	        label: 'Last Transaction',
	        fql: 'max(last_transaction_date)',
	        format: 'date',
	        description: ''
	      },
	      {
	        label: 'Last Click Transactions',
	        fql: 'sum(transactions)',
	        format: '',
	        description: 'One-time and recurring transactions with this source code'
	      },
	      {
	        label: 'Last Click Revenue',
	        fql: 'sum(revenue)',
	        format: 'currency',
	        description: 'One-time and recurring transaction amount with this source code'
	      },
	      {
	        label: 'Last Click Average',
	        fql: 'sum(revenue)/sum(transactions)',
	        format: 'currency'
	      },
	      {
	        label: 'Acquired People',
	        fql: 'sum(origin_person_count)',
	        description: 'People whose first interaction has this source code'
	      },
	      {
	        label: 'Acquired Transactions',
	        fql: 'sum(origin_transaction_count)',
	        description: 'All transactions from people whose first interaction has this source code'
	      },
	      {
	        label: 'Acquired Revenue',
	        fql: 'sum(origin_transaction_revenue)',
	        format: 'currency',
	        description: 'All transaction revenue from people whose first interaction has this source code'
	      }
	    ],
	    order_by: { fql: 'revenue', order_by_direction: 'DESC' }
	  }
	}
}

const data={
	revenue_chart:[
  { col0: '2019-12-27', col1: 'EM', 'Direct Transactions': 1773.83 },
  {
    col0: '2019-12-27',
    col1: 'Facebook',
    'Direct Transactions': 625.2
  },
  { col0: '2019-12-27', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2019-12-27', col1: 'N/A', 'Direct Transactions': 1220.1 },
  { col0: '2019-12-27', col1: 'Other', 'Direct Transactions': 0 },
  { col0: '2019-12-27', col1: 'TW', 'Direct Transactions': 70 },
  { col0: '2019-12-27', col1: 'WEB', 'Direct Transactions': 930 },
  { col0: '2019-12-28', col1: 'EM', 'Direct Transactions': 2059.01 },
  { col0: '2019-12-28', col1: 'Facebook', 'Direct Transactions': 567 },
  { col0: '2019-12-28', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2019-12-28', col1: 'N/A', 'Direct Transactions': 1140 },
  { col0: '2019-12-28', col1: 'Other', 'Direct Transactions': 0 },
  { col0: '2019-12-28', col1: 'TW', 'Direct Transactions': 135 },
  { col0: '2019-12-28', col1: 'WEB', 'Direct Transactions': 480 },
  { col0: '2019-12-29', col1: 'EM', 'Direct Transactions': 928.99 },
  { col0: '2019-12-29', col1: 'Facebook', 'Direct Transactions': 517 },
  { col0: '2019-12-29', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2019-12-29', col1: 'N/A', 'Direct Transactions': 300 },
  { col0: '2019-12-29', col1: 'Other', 'Direct Transactions': 0 },
  { col0: '2019-12-29', col1: 'TW', 'Direct Transactions': 75 },
  { col0: '2019-12-29', col1: 'WEB', 'Direct Transactions': 1100 },
  { col0: '2019-12-30', col1: 'EM', 'Direct Transactions': 1525.23 },
  {
    col0: '2019-12-30',
    col1: 'Facebook',
    'Direct Transactions': 337.61
  },
  { col0: '2019-12-30', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2019-12-30', col1: 'N/A', 'Direct Transactions': 1322.5 },
  { col0: '2019-12-30', col1: 'Other', 'Direct Transactions': 0 },
  { col0: '2019-12-30', col1: 'TW', 'Direct Transactions': 210 },
  { col0: '2019-12-30', col1: 'WEB', 'Direct Transactions': 1130 },
  { col0: '2019-12-31', col1: 'EM', 'Direct Transactions': 4450.92 },
  { col0: '2019-12-31', col1: 'Facebook', 'Direct Transactions': 395 },
  { col0: '2019-12-31', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2019-12-31', col1: 'N/A', 'Direct Transactions': 4381 },
  { col0: '2019-12-31', col1: 'Other', 'Direct Transactions': 0 },
  { col0: '2019-12-31', col1: 'TW', 'Direct Transactions': 1598 },
  { col0: '2019-12-31', col1: 'WEB', 'Direct Transactions': 945.2 },
  { col0: '2020-01-01', col1: 'EM', 'Direct Transactions': 2289 },
  { col0: '2020-01-01', col1: 'Facebook', 'Direct Transactions': 57.7 },
  { col0: '2020-01-01', col1: 'N/A', 'Direct Transactions': 3708 },
  { col0: '2020-01-01', col1: 'TW', 'Direct Transactions': 730 },
  { col0: '2020-01-01', col1: 'WEB', 'Direct Transactions': 1585.2 },
  { col0: '2020-01-02', col1: 'EM', 'Direct Transactions': 527 },
  { col0: '2020-01-02', col1: 'Facebook', 'Direct Transactions': 20 },
  { col0: '2020-01-02', col1: 'N/A', 'Direct Transactions': 798.5 },
  { col0: '2020-01-02', col1: 'TW', 'Direct Transactions': 220 },
  { col0: '2020-01-02', col1: 'WEB', 'Direct Transactions': 1198 },
  { col0: '2020-01-03', col1: 'EM', 'Direct Transactions': 1014 },
  { col0: '2020-01-03', col1: 'Facebook', 'Direct Transactions': 45 },
  { col0: '2020-01-03', col1: 'N/A', 'Direct Transactions': 129 },
  { col0: '2020-01-03', col1: 'TW', 'Direct Transactions': 412.2 },
  { col0: '2020-01-03', col1: 'WEB', 'Direct Transactions': 75 },
  { col0: '2020-01-04', col1: 'EM', 'Direct Transactions': 383 },
  { col0: '2020-01-04', col1: 'Facebook', 'Direct Transactions': 10 },
  { col0: '2020-01-04', col1: 'N/A', 'Direct Transactions': 1075 },
  { col0: '2020-01-04', col1: 'TW', 'Direct Transactions': 221 },
  { col0: '2020-01-04', col1: 'WEB', 'Direct Transactions': 210.2 },
  { col0: '2020-01-05', col1: 'EM', 'Direct Transactions': 271.1 },
  { col0: '2020-01-05', col1: 'Facebook', 'Direct Transactions': 53 },
  { col0: '2020-01-05', col1: 'N/A', 'Direct Transactions': 38 },
  { col0: '2020-01-05', col1: 'TEXT', 'Direct Transactions': 7.5 },
  { col0: '2020-01-05', col1: 'TW', 'Direct Transactions': 30 },
  { col0: '2020-01-05', col1: 'WEB', 'Direct Transactions': 185 },
  { col0: '2020-01-06', col1: 'EM', 'Direct Transactions': 883 },
  { col0: '2020-01-06', col1: 'Facebook', 'Direct Transactions': 61 },
  { col0: '2020-01-06', col1: 'N/A', 'Direct Transactions': 902 },
  { col0: '2020-01-06', col1: 'TW', 'Direct Transactions': 895 },
  { col0: '2020-01-06', col1: 'WEB', 'Direct Transactions': 290 },
  { col0: '2020-01-07', col1: 'EM', 'Direct Transactions': 207 },
  { col0: '2020-01-07', col1: 'Facebook', 'Direct Transactions': 135 },
  { col0: '2020-01-07', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-07', col1: 'N/A', 'Direct Transactions': 1513 },
  { col0: '2020-01-07', col1: 'TW', 'Direct Transactions': 270 },
  { col0: '2020-01-07', col1: 'WEB', 'Direct Transactions': 410.55 },
  { col0: '2020-01-08', col1: 'EM', 'Direct Transactions': 830 },
  { col0: '2020-01-08', col1: 'Facebook', 'Direct Transactions': 80 },
  { col0: '2020-01-08', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-08', col1: 'N/A', 'Direct Transactions': 2599 },
  { col0: '2020-01-08', col1: 'TW', 'Direct Transactions': 805 },
  { col0: '2020-01-08', col1: 'WEB', 'Direct Transactions': 1195 },
  { col0: '2020-01-09', col1: 'EM', 'Direct Transactions': 209.5 },
  { col0: '2020-01-09', col1: 'Facebook', 'Direct Transactions': 133 },
  { col0: '2020-01-09', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-09', col1: 'N/A', 'Direct Transactions': 2619 },
  { col0: '2020-01-09', col1: 'TW', 'Direct Transactions': 55 },
  { col0: '2020-01-09', col1: 'WEB', 'Direct Transactions': 830 },
  { col0: '2020-01-10', col1: 'EM', 'Direct Transactions': 2579.5 },
  { col0: '2020-01-10', col1: 'Facebook', 'Direct Transactions': 73 },
  { col0: '2020-01-10', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-10', col1: 'N/A', 'Direct Transactions': 52.5 },
  { col0: '2020-01-10', col1: 'TW', 'Direct Transactions': 40 },
  { col0: '2020-01-10', col1: 'WEB', 'Direct Transactions': 1751 },
  { col0: '2020-01-11', col1: 'EM', 'Direct Transactions': 854.41 },
  { col0: '2020-01-11', col1: 'Facebook', 'Direct Transactions': 185 },
  { col0: '2020-01-11', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-11', col1: 'N/A', 'Direct Transactions': 162.5 },
  { col0: '2020-01-11', col1: 'OTHER', 'Direct Transactions': 5 },
  { col0: '2020-01-11', col1: 'TW', 'Direct Transactions': 25 },
  { col0: '2020-01-11', col1: 'WEB', 'Direct Transactions': 203 },
  { col0: '2020-01-12', col1: 'EM', 'Direct Transactions': 621.2 },
  { col0: '2020-01-12', col1: 'Facebook', 'Direct Transactions': 25 },
  { col0: '2020-01-12', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-12', col1: 'N/A', 'Direct Transactions': 25 },
  { col0: '2020-01-12', col1: 'WEB', 'Direct Transactions': 140 },
  { col0: '2020-01-13', col1: 'EM', 'Direct Transactions': 2382.1 },
  { col0: '2020-01-13', col1: 'Facebook', 'Direct Transactions': 75 },
  { col0: '2020-01-13', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-13', col1: 'N/A', 'Direct Transactions': 256 },
  { col0: '2020-01-13', col1: 'TW', 'Direct Transactions': 320 },
  { col0: '2020-01-13', col1: 'WEB', 'Direct Transactions': 1177 },
  { col0: '2020-01-14', col1: 'EM', 'Direct Transactions': 1444.2 },
  { col0: '2020-01-14', col1: 'Facebook', 'Direct Transactions': 55 },
  { col0: '2020-01-14', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-14', col1: 'N/A', 'Direct Transactions': 837.5 },
  { col0: '2020-01-14', col1: 'TW', 'Direct Transactions': 145 },
  { col0: '2020-01-14', col1: 'WEB', 'Direct Transactions': 2194 },
  { col0: '2020-01-15', col1: 'EM', 'Direct Transactions': 3137 },
  { col0: '2020-01-15', col1: 'Facebook', 'Direct Transactions': 90 },
  { col0: '2020-01-15', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-15', col1: 'N/A', 'Direct Transactions': 1571.5 },
  { col0: '2020-01-15', col1: 'TW', 'Direct Transactions': 648.73 },
  { col0: '2020-01-15', col1: 'WEB', 'Direct Transactions': 990 },
  { col0: '2020-01-16', col1: 'EM', 'Direct Transactions': 3381.1 },
  {
    col0: '2020-01-16',
    col1: 'Facebook',
    'Direct Transactions': 526.5
  },
  { col0: '2020-01-16', col1: 'N/A', 'Direct Transactions': 7919.3 },
  { col0: '2020-01-16', col1: 'TW', 'Direct Transactions': 5621.6 },
  { col0: '2020-01-16', col1: 'WEB', 'Direct Transactions': 1718 },
  { col0: '2020-01-17', col1: 'EM', 'Direct Transactions': 2674 },
  {
    col0: '2020-01-17',
    col1: 'Facebook',
    'Direct Transactions': 1402.4
  },
  { col0: '2020-01-17', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-17', col1: 'N/A', 'Direct Transactions': 3517.99 },
  { col0: '2020-01-17', col1: 'OTHER', 'Direct Transactions': 5 },
  { col0: '2020-01-17', col1: 'TEXT', 'Direct Transactions': 7.5 },
  { col0: '2020-01-17', col1: 'TW', 'Direct Transactions': 980 },
  { col0: '2020-01-17', col1: 'WEB', 'Direct Transactions': 4947.44 },
  { col0: '2020-01-18', col1: 'EM', 'Direct Transactions': 3657.43 },
  { col0: '2020-01-18', col1: 'Facebook', 'Direct Transactions': 911 },
  { col0: '2020-01-18', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-18', col1: 'N/A', 'Direct Transactions': 5246.13 },
  { col0: '2020-01-18', col1: 'TEXT', 'Direct Transactions': 15 },
  { col0: '2020-01-18', col1: 'TW', 'Direct Transactions': 6458.78 },
  { col0: '2020-01-18', col1: 'WEB', 'Direct Transactions': 3955 },
  { col0: '2020-01-19', col1: 'EM', 'Direct Transactions': 4943 },
  { col0: '2020-01-19', col1: 'Facebook', 'Direct Transactions': 1235 },
  { col0: '2020-01-19', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-19', col1: 'N/A', 'Direct Transactions': 1349 },
  { col0: '2020-01-19', col1: 'TW', 'Direct Transactions': 3237 },
  { col0: '2020-01-19', col1: 'WEB', 'Direct Transactions': 1073.2 },
  { col0: '2020-01-20', col1: 'EM', 'Direct Transactions': 1542.2 },
  { col0: '2020-01-20', col1: 'Facebook', 'Direct Transactions': 780 },
  { col0: '2020-01-20', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-20', col1: 'N/A', 'Direct Transactions': 1002.59 },
  { col0: '2020-01-20', col1: 'TW', 'Direct Transactions': 1160 },
  { col0: '2020-01-20', col1: 'WEB', 'Direct Transactions': 6278 },
  { col0: '2020-01-21', col1: 'EM', 'Direct Transactions': 2400 },
  {
    col0: '2020-01-21',
    col1: 'Facebook',
    'Direct Transactions': 1066.5
  },
  { col0: '2020-01-21', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-21', col1: 'N/A', 'Direct Transactions': 862.5 },
  { col0: '2020-01-21', col1: 'TW', 'Direct Transactions': 650 },
  { col0: '2020-01-21', col1: 'WEB', 'Direct Transactions': 2274.5 },
  { col0: '2020-01-22', col1: 'EM', 'Direct Transactions': 2620.5 },
  {
    col0: '2020-01-22',
    col1: 'Facebook',
    'Direct Transactions': 1510.2
  },
  { col0: '2020-01-22', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-22', col1: 'N/A', 'Direct Transactions': 1995 },
  { col0: '2020-01-22', col1: 'TW', 'Direct Transactions': 515 },
  { col0: '2020-01-22', col1: 'WEB', 'Direct Transactions': 2018 },
  { col0: '2020-01-23', col1: 'EM', 'Direct Transactions': 2035.64 },
  {
    col0: '2020-01-23',
    col1: 'Facebook',
    'Direct Transactions': 886.6
  },
  { col0: '2020-01-23', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-23', col1: 'N/A', 'Direct Transactions': 995 },
  { col0: '2020-01-23', col1: 'TW', 'Direct Transactions': 1026 },
  { col0: '2020-01-23', col1: 'WEB', 'Direct Transactions': 1045 },
  { col0: '2020-01-24', col1: 'EM', 'Direct Transactions': 350 },
  { col0: '2020-01-24', col1: 'Facebook', 'Direct Transactions': 808 },
  { col0: '2020-01-24', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-24', col1: 'N/A', 'Direct Transactions': 635.2 },
  { col0: '2020-01-24', col1: 'TW', 'Direct Transactions': 445.2 },
  { col0: '2020-01-24', col1: 'WEB', 'Direct Transactions': 2106.55 },
  { col0: '2020-01-25', col1: 'EM', 'Direct Transactions': 2849.7 },
  {
    col0: '2020-01-25',
    col1: 'Facebook',
    'Direct Transactions': 175.2
  },
  { col0: '2020-01-25', col1: 'N/A', 'Direct Transactions': 860.5 },
  { col0: '2020-01-25', col1: 'TW', 'Direct Transactions': 140 },
  { col0: '2020-01-25', col1: 'WEB', 'Direct Transactions': 930 },
  { col0: '2020-01-26', col1: 'EM', 'Direct Transactions': 1379.37 },
  { col0: '2020-01-26', col1: 'Facebook', 'Direct Transactions': 80.2 },
  { col0: '2020-01-26', col1: 'N/A', 'Direct Transactions': 195 },
  { col0: '2020-01-26', col1: 'TW', 'Direct Transactions': 105 },
  { col0: '2020-01-26', col1: 'WEB', 'Direct Transactions': 660 },
  { col0: '2020-01-27', col1: 'EM', 'Direct Transactions': 1785.83 },
  {
    col0: '2020-01-27',
    col1: 'Facebook',
    'Direct Transactions': 655.2
  },
  { col0: '2020-01-27', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-27', col1: 'N/A', 'Direct Transactions': 197.1 },
  { col0: '2020-01-27', col1: 'TW', 'Direct Transactions': 320 },
  { col0: '2020-01-27', col1: 'WEB', 'Direct Transactions': 870 },
  { col0: '2020-01-28', col1: 'EM', 'Direct Transactions': 2090.19 },
  { col0: '2020-01-28', col1: 'Facebook', 'Direct Transactions': 810 },
  { col0: '2020-01-28', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-28', col1: 'N/A', 'Direct Transactions': 835 },
  { col0: '2020-01-28', col1: 'TW', 'Direct Transactions': 275 },
  { col0: '2020-01-28', col1: 'WEB', 'Direct Transactions': 416 },
  { col0: '2020-01-29', col1: 'EM', 'Direct Transactions': 2925 },
  { col0: '2020-01-29', col1: 'Facebook', 'Direct Transactions': 1084 },
  { col0: '2020-01-29', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-29', col1: 'N/A', 'Direct Transactions': 1061 },
  { col0: '2020-01-29', col1: 'TW', 'Direct Transactions': 484 },
  { col0: '2020-01-29', col1: 'WEB', 'Direct Transactions': 1551 },
  { col0: '2020-01-30', col1: 'EM', 'Direct Transactions': 3081.34 },
  {
    col0: '2020-01-30',
    col1: 'Facebook',
    'Direct Transactions': 1031.71
  },
  { col0: '2020-01-30', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-30', col1: 'N/A', 'Direct Transactions': 121 },
  { col0: '2020-01-30', col1: 'TW', 'Direct Transactions': 1040.2 },
  { col0: '2020-01-30', col1: 'WEB', 'Direct Transactions': 1580 },
  { col0: '2020-01-31', col1: 'EM', 'Direct Transactions': 2891.5 },
  {
    col0: '2020-01-31',
    col1: 'Facebook',
    'Direct Transactions': 1383.5
  },
  { col0: '2020-01-31', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-01-31', col1: 'N/A', 'Direct Transactions': 991.2 },
  { col0: '2020-01-31', col1: 'TW', 'Direct Transactions': 280 },
  { col0: '2020-01-31', col1: 'WEB', 'Direct Transactions': 613 },
  { col0: '2020-02-01', col1: 'EM', 'Direct Transactions': 2183.5 },
  {
    col0: '2020-02-01',
    col1: 'Facebook',
    'Direct Transactions': 717.7
  },
  { col0: '2020-02-01', col1: 'N/A', 'Direct Transactions': 537.2 },
  { col0: '2020-02-01', col1: 'TW', 'Direct Transactions': 810 },
  { col0: '2020-02-01', col1: 'WEB', 'Direct Transactions': 2095 },
  { col0: '2020-02-02', col1: 'EM', 'Direct Transactions': 1147 },
  { col0: '2020-02-02', col1: 'Facebook', 'Direct Transactions': 50 },
  { col0: '2020-02-02', col1: 'N/A', 'Direct Transactions': 338.5 },
  { col0: '2020-02-02', col1: 'TW', 'Direct Transactions': 190 },
  { col0: '2020-02-02', col1: 'WEB', 'Direct Transactions': 903 },
  { col0: '2020-02-03', col1: 'EM', 'Direct Transactions': 714 },
  { col0: '2020-02-03', col1: 'Facebook', 'Direct Transactions': 10 },
  { col0: '2020-02-03', col1: 'N/A', 'Direct Transactions': 1296 },
  { col0: '2020-02-03', col1: 'TW', 'Direct Transactions': 652.2 },
  { col0: '2020-02-03', col1: 'WEB', 'Direct Transactions': 584 },
  { col0: '2020-02-04', col1: 'EM', 'Direct Transactions': 2442.93 },
  { col0: '2020-02-04', col1: 'Facebook', 'Direct Transactions': 10 },
  { col0: '2020-02-04', col1: 'N/A', 'Direct Transactions': 1337.5 },
  { col0: '2020-02-04', col1: 'TW', 'Direct Transactions': 196 },
  { col0: '2020-02-04', col1: 'WEB', 'Direct Transactions': 2814.53 },
  { col0: '2020-02-05', col1: 'EM', 'Direct Transactions': 1034.6 },
  { col0: '2020-02-05', col1: 'Facebook', 'Direct Transactions': 53 },
  { col0: '2020-02-05', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-02-05', col1: 'N/A', 'Direct Transactions': 403.5 },
  { col0: '2020-02-05', col1: 'TEXT', 'Direct Transactions': 7.5 },
  { col0: '2020-02-05', col1: 'TW', 'Direct Transactions': 45 },
  { col0: '2020-02-05', col1: 'WEB', 'Direct Transactions': 1223 },
  { col0: '2020-02-06', col1: 'EM', 'Direct Transactions': 2930.77 },
  { col0: '2020-02-06', col1: 'Facebook', 'Direct Transactions': 46 },
  { col0: '2020-02-06', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-02-06', col1: 'N/A', 'Direct Transactions': 1347 },
  { col0: '2020-02-06', col1: 'TW', 'Direct Transactions': 1208 },
  { col0: '2020-02-06', col1: 'WEB', 'Direct Transactions': 5028.33 },
  { col0: '2020-02-07', col1: 'EM', 'Direct Transactions': 2095 },
  {
    col0: '2020-02-07',
    col1: 'Facebook',
    'Direct Transactions': 814.61
  },
  { col0: '2020-02-07', col1: 'N/A', 'Direct Transactions': 1305 },
  { col0: '2020-02-07', col1: 'TW', 'Direct Transactions': 2572.7 },
  { col0: '2020-02-07', col1: 'WEB', 'Direct Transactions': 4956.55 },
  { col0: '2020-02-08', col1: 'EM', 'Direct Transactions': 1093 },
  {
    col0: '2020-02-08',
    col1: 'Facebook',
    'Direct Transactions': 759.1
  },
  { col0: '2020-02-08', col1: 'N/A', 'Direct Transactions': 1754.2 },
  { col0: '2020-02-08', col1: 'TW', 'Direct Transactions': 720 },
  { col0: '2020-02-08', col1: 'WEB', 'Direct Transactions': 1325 },
  { col0: '2020-02-09', col1: 'EM', 'Direct Transactions': 1370.5 },
  {
    col0: '2020-02-09',
    col1: 'Facebook',
    'Direct Transactions': 687.6
  },
  { col0: '2020-02-09', col1: 'N/A', 'Direct Transactions': 404 },
  { col0: '2020-02-09', col1: 'TW', 'Direct Transactions': 50 },
  { col0: '2020-02-09', col1: 'WEB', 'Direct Transactions': 1099 },
  { col0: '2020-02-10', col1: 'EM', 'Direct Transactions': 966.5 },
  {
    col0: '2020-02-10',
    col1: 'Facebook',
    'Direct Transactions': 534.2
  },
  { col0: '2020-02-10', col1: 'N/A', 'Direct Transactions': 290.2 },
  { col0: '2020-02-10', col1: 'TW', 'Direct Transactions': 45 },
  { col0: '2020-02-10', col1: 'WEB', 'Direct Transactions': 6260 },
  { col0: '2020-02-11', col1: 'EM', 'Direct Transactions': 3295.91 },
  { col0: '2020-02-11', col1: 'Facebook', 'Direct Transactions': 160 },
  { col0: '2020-02-11', col1: 'N/A', 'Direct Transactions': 1184 },
  { col0: '2020-02-11', col1: 'OTHER', 'Direct Transactions': 5 },
  { col0: '2020-02-11', col1: 'TW', 'Direct Transactions': 460 },
  { col0: '2020-02-11', col1: 'WEB', 'Direct Transactions': 322.2 },
  { col0: '2020-02-12', col1: 'EM', 'Direct Transactions': 2056.4 },
  {
    col0: '2020-02-12',
    col1: 'Facebook',
    'Direct Transactions': 658.6
  },
  { col0: '2020-02-12', col1: 'N/A', 'Direct Transactions': 275 },
  { col0: '2020-02-12', col1: 'WEB', 'Direct Transactions': 1750 },
  { col0: '2020-02-13', col1: 'EM', 'Direct Transactions': 1727.04 },
  {
    col0: '2020-02-13',
    col1: 'Facebook',
    'Direct Transactions': 1586.8
  },
  { col0: '2020-02-13', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-02-13', col1: 'N/A', 'Direct Transactions': 346 },
  { col0: '2020-02-13', col1: 'TW', 'Direct Transactions': 198 },
  { col0: '2020-02-13', col1: 'WEB', 'Direct Transactions': 922 },
  { col0: '2020-02-14', col1: 'EM', 'Direct Transactions': 1333.7 },
  {
    col0: '2020-02-14',
    col1: 'Facebook',
    'Direct Transactions': 1690.89
  },
  { col0: '2020-02-14', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-02-14', col1: 'N/A', 'Direct Transactions': 301.4 },
  { col0: '2020-02-14', col1: 'TW', 'Direct Transactions': 80 },
  { col0: '2020-02-14', col1: 'WEB', 'Direct Transactions': 417 },
  { col0: '2020-02-15', col1: 'EM', 'Direct Transactions': 3416.5 },
  {
    col0: '2020-02-15',
    col1: 'Facebook',
    'Direct Transactions': 195.4
  },
  { col0: '2020-02-15', col1: 'N/A', 'Direct Transactions': 160.5 },
  { col0: '2020-02-15', col1: 'TW', 'Direct Transactions': 884 },
  { col0: '2020-02-15', col1: 'WEB', 'Direct Transactions': 1640 },
  { col0: '2020-02-16', col1: 'EM', 'Direct Transactions': 4411.22 },
  { col0: '2020-02-16', col1: 'Facebook', 'Direct Transactions': 3 },
  { col0: '2020-02-16', col1: 'N/A', 'Direct Transactions': 180 },
  { col0: '2020-02-16', col1: 'TW', 'Direct Transactions': 363.4 },
  { col0: '2020-02-16', col1: 'WEB', 'Direct Transactions': 1080 },
  { col0: '2020-02-17', col1: 'EM', 'Direct Transactions': 3446 },
  { col0: '2020-02-17', col1: 'Facebook', 'Direct Transactions': 5 },
  { col0: '2020-02-17', col1: 'N/A', 'Direct Transactions': 162.13 },
  { col0: '2020-02-17', col1: 'OTHER', 'Direct Transactions': 5 },
  { col0: '2020-02-17', col1: 'TEXT', 'Direct Transactions': 7.5 },
  { col0: '2020-02-17', col1: 'TW', 'Direct Transactions': 476 },
  { col0: '2020-02-17', col1: 'WEB', 'Direct Transactions': 1076 },
  { col0: '2020-02-18', col1: 'EM', 'Direct Transactions': 2095 },
  { col0: '2020-02-18', col1: 'Facebook', 'Direct Transactions': 35 },
  { col0: '2020-02-18', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-02-18', col1: 'N/A', 'Direct Transactions': 458 },
  { col0: '2020-02-18', col1: 'TW', 'Direct Transactions': 1265 },
  { col0: '2020-02-18', col1: 'WEB', 'Direct Transactions': 371 },
  { col0: '2020-02-19', col1: 'EM', 'Direct Transactions': 2906 },
  { col0: '2020-02-19', col1: 'Facebook', 'Direct Transactions': 112 },
  { col0: '2020-02-19', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-02-19', col1: 'N/A', 'Direct Transactions': 5554.2 },
  { col0: '2020-02-19', col1: 'TW', 'Direct Transactions': 1762.73 },
  { col0: '2020-02-19', col1: 'WEB', 'Direct Transactions': 704 },
  { col0: '2020-02-20', col1: 'EM', 'Direct Transactions': 4755.7 },
  { col0: '2020-02-20', col1: 'Facebook', 'Direct Transactions': 225 },
  { col0: '2020-02-20', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-02-20', col1: 'N/A', 'Direct Transactions': 431.5 },
  { col0: '2020-02-20', col1: 'TW', 'Direct Transactions': 789 },
  { col0: '2020-02-20', col1: 'WEB', 'Direct Transactions': 1709 },
  { col0: '2020-02-21', col1: 'EM', 'Direct Transactions': 4413.5 },
  { col0: '2020-02-21', col1: 'Facebook', 'Direct Transactions': 88 },
  { col0: '2020-02-21', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-02-21', col1: 'N/A', 'Direct Transactions': 2290.75 },
  { col0: '2020-02-21', col1: 'TW', 'Direct Transactions': 333 },
  { col0: '2020-02-21', col1: 'WEB', 'Direct Transactions': 3486 },
  { col0: '2020-02-22', col1: 'EM', 'Direct Transactions': 1716.5 },
  {
    col0: '2020-02-22',
    col1: 'Facebook',
    'Direct Transactions': 148.2
  },
  { col0: '2020-02-22', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-02-22', col1: 'N/A', 'Direct Transactions': 606 },
  { col0: '2020-02-22', col1: 'TW', 'Direct Transactions': 470 },
  { col0: '2020-02-22', col1: 'WEB', 'Direct Transactions': 2308 },
  { col0: '2020-02-23', col1: 'EM', 'Direct Transactions': 2097.5 },
  {
    col0: '2020-02-23',
    col1: 'Facebook',
    'Direct Transactions': 130.4
  },
  { col0: '2020-02-23', col1: 'N/A', 'Direct Transactions': 151 },
  { col0: '2020-02-23', col1: 'TW', 'Direct Transactions': 768 },
  { col0: '2020-02-23', col1: 'WEB', 'Direct Transactions': 454 },
  { col0: '2020-02-24', col1: 'EM', 'Direct Transactions': 693.38 },
  { col0: '2020-02-24', col1: 'Facebook', 'Direct Transactions': 20 },
  { col0: '2020-02-24', col1: 'N/A', 'Direct Transactions': 2985.2 },
  { col0: '2020-02-24', col1: 'TW', 'Direct Transactions': 133.2 },
  { col0: '2020-02-24', col1: 'WEB', 'Direct Transactions': 829.55 },
  { col0: '2020-02-25', col1: 'EM', 'Direct Transactions': 638 },
  { col0: '2020-02-25', col1: 'Facebook', 'Direct Transactions': 40.2 },
  { col0: '2020-02-25', col1: 'N/A', 'Direct Transactions': 1067.5 },
  { col0: '2020-02-25', col1: 'TW', 'Direct Transactions': 105 },
  { col0: '2020-02-25', col1: 'WEB', 'Direct Transactions': 450 },
  { col0: '2020-02-26', col1: 'EM', 'Direct Transactions': 3595.2 },
  { col0: '2020-02-26', col1: 'Facebook', 'Direct Transactions': 70.2 },
  { col0: '2020-02-26', col1: 'GS', 'Direct Transactions': 0 },
  { col0: '2020-02-26', col1: 'N/A', 'Direct Transactions': 198 },
  { col0: '2020-02-26', col1: 'TW', 'Direct Transactions': 55 },
  { col0: '2020-02-26', col1: 'WEB', 'Direct Transactions': 1145 },
  { col0: '2020-02-27', col1: 'EM', 'Direct Transactions': 1316.83 },
  { col0: '2020-02-27', col1: 'Facebook', 'Direct Transactions': 35.2 },
  { col0: '2020-02-27', col1: 'N/A', 'Direct Transactions': 105.1 },
  { col0: '2020-02-27', col1: 'TW', 'Direct Transactions': 40 },
  { col0: '2020-02-27', col1: 'WEB', 'Direct Transactions': 1340 },
  { col0: '2020-02-28', col1: 'EM', 'Direct Transactions': 2391.93 },
  { col0: '2020-02-28', col1: 'Facebook', 'Direct Transactions': 801 },
  { col0: '2020-02-28', col1: 'N/A', 'Direct Transactions': 470 },
  { col0: '2020-02-28', col1: 'Other', 'Direct Transactions': 262 },
  { col0: '2020-02-28', col1: 'TW', 'Direct Transactions': 120.1 },
  { col0: '2020-02-28', col1: 'WEB', 'Direct Transactions': 3436 },
  { col0: '2020-02-29', col1: 'EM', 'Direct Transactions': 3397 },
  {
    col0: '2020-02-29',
    col1: 'Facebook',
    'Direct Transactions': 1173.49
  },
  { col0: '2020-02-29', col1: 'N/A', 'Direct Transactions': 305.5 },
  { col0: '2020-02-29', col1: 'Other', 'Direct Transactions': 100 },
  { col0: '2020-02-29', col1: 'TW', 'Direct Transactions': 313 },
  { col0: '2020-02-29', col1: 'WEB', 'Direct Transactions': 1645 },
  { col0: '2020-03-01', col1: 'EM', 'Direct Transactions': 2965.2 },
  {
    col0: '2020-03-01',
    col1: 'Facebook',
    'Direct Transactions': 196.8
  },
  { col0: '2020-03-01', col1: 'N/A', 'Direct Transactions': 634 },
  { col0: '2020-03-01', col1: 'Other', 'Direct Transactions': 12.5 },
  { col0: '2020-03-01', col1: 'TW', 'Direct Transactions': 265 },
  { col0: '2020-03-01', col1: 'WEB', 'Direct Transactions': 608 },
  { col0: '2020-03-02', col1: 'EM', 'Direct Transactions': 2331.5 },
  { col0: '2020-03-02', col1: 'Facebook', 'Direct Transactions': 20 },
  { col0: '2020-03-02', col1: 'N/A', 'Direct Transactions': 469 },
  { col0: '2020-03-02', col1: 'TW', 'Direct Transactions': 165 },
  { col0: '2020-03-02', col1: 'WEB', 'Direct Transactions': 875 },
  { col0: '2020-03-03', col1: 'EM', 'Direct Transactions': 959.5 },
  {
    col0: '2020-03-03',
    col1: 'Facebook',
    'Direct Transactions': 1183.2
  },
  { col0: '2020-03-03', col1: 'N/A', 'Direct Transactions': 656 },
  { col0: '2020-03-03', col1: 'TW', 'Direct Transactions': 242.2 },
  { col0: '2020-03-03', col1: 'WEB', 'Direct Transactions': 194 },
  { col0: '2020-03-04', col1: 'EM', 'Direct Transactions': 586.5 },
  {
    col0: '2020-03-04',
    col1: 'Facebook',
    'Direct Transactions': 746.2
  },
  { col0: '2020-03-04', col1: 'N/A', 'Direct Transactions': 980.5 },
  { col0: '2020-03-04', col1: 'Other', 'Direct Transactions': 5 },
  { col0: '2020-03-04', col1: 'TW', 'Direct Transactions': 106 },
  { col0: '2020-03-04', col1: 'WEB', 'Direct Transactions': 1037.37 },
  { col0: '2020-03-05', col1: 'EM', 'Direct Transactions': 1108.1 },
  {
    col0: '2020-03-05',
    col1: 'Facebook',
    'Direct Transactions': 214.4
  },
  { col0: '2020-03-05', col1: 'N/A', 'Direct Transactions': 858.77 },
  { col0: '2020-03-05', col1: 'TW', 'Direct Transactions': 30 },
  { col0: '2020-03-05', col1: 'WEB', 'Direct Transactions': 3092.02 },
  { col0: '2020-03-06', col1: 'EM', 'Direct Transactions': 2952 },
  {
    col0: '2020-03-06',
    col1: 'Facebook',
    'Direct Transactions': 266.4
  },
  { col0: '2020-03-06', col1: 'N/A', 'Direct Transactions': 883.2 },
  { col0: '2020-03-06', col1: 'Other', 'Direct Transactions': 1 },
  { col0: '2020-03-06', col1: 'TW', 'Direct Transactions': 372 },
  { col0: '2020-03-06', col1: 'WEB', 'Direct Transactions': 1635 },
  { col0: '2020-03-07', col1: 'EM', 'Direct Transactions': 1043.7 },
  { col0: '2020-03-07', col1: 'Facebook', 'Direct Transactions': 100 },
  { col0: '2020-03-07', col1: 'N/A', 'Direct Transactions': 368.66 },
  { col0: '2020-03-07', col1: 'TW', 'Direct Transactions': 375 },
  { col0: '2020-03-07', col1: 'WEB', 'Direct Transactions': 1638.55 },
  { col0: '2020-03-08', col1: 'EM', 'Direct Transactions': 477.5 },
  { col0: '2020-03-08', col1: 'Facebook', 'Direct Transactions': 75 },
  { col0: '2020-03-08', col1: 'N/A', 'Direct Transactions': 679.2 },
  { col0: '2020-03-08', col1: 'TW', 'Direct Transactions': 512 },
  { col0: '2020-03-08', col1: 'WEB', 'Direct Transactions': 1572 },
  { col0: '2020-03-09', col1: 'EM', 'Direct Transactions': 1546.5 },
  { col0: '2020-03-09', col1: 'Facebook', 'Direct Transactions': 83 },
  { col0: '2020-03-09', col1: 'N/A', 'Direct Transactions': 155 },
  { col0: '2020-03-09', col1: 'TW', 'Direct Transactions': 80 },
  { col0: '2020-03-09', col1: 'WEB', 'Direct Transactions': 1240 },
  { col0: '2020-03-10', col1: 'EM', 'Direct Transactions': 432 },
  { col0: '2020-03-10', col1: 'Facebook', 'Direct Transactions': 48 },
  { col0: '2020-03-10', col1: 'N/A', 'Direct Transactions': 3890 },
  { col0: '2020-03-10', col1: 'TW', 'Direct Transactions': 125 },
  { col0: '2020-03-10', col1: 'WEB', 'Direct Transactions': 847 },
  { col0: '2020-03-11', col1: 'EM', 'Direct Transactions': 1130.61 },
  { col0: '2020-03-11', col1: 'Facebook', 'Direct Transactions': 130 },
  { col0: '2020-03-11', col1: 'N/A', 'Direct Transactions': 560 },
  { col0: '2020-03-11', col1: 'OTHER', 'Direct Transactions': 5 },
  { col0: '2020-03-11', col1: 'TW', 'Direct Transactions': 25 },
  { col0: '2020-03-11', col1: 'WEB', 'Direct Transactions': 3334 },
  { col0: '2020-03-12', col1: 'EM', 'Direct Transactions': 671.2 },
  { col0: '2020-03-12', col1: 'Facebook', 'Direct Transactions': 45 },
  { col0: '2020-03-12', col1: 'N/A', 'Direct Transactions': 1241 },
  { col0: '2020-03-12', col1: 'WEB', 'Direct Transactions': 2985 },
  { col0: '2020-03-13', col1: 'EM', 'Direct Transactions': 1254.35 },
  { col0: '2020-03-13', col1: 'Facebook', 'Direct Transactions': 55 },
  { col0: '2020-03-13', col1: 'N/A', 'Direct Transactions': 3266 },
  { col0: '2020-03-13', col1: 'Other', 'Direct Transactions': 1 },
  { col0: '2020-03-13', col1: 'TW', 'Direct Transactions': 70 },
  { col0: '2020-03-13', col1: 'WEB', 'Direct Transactions': 2262 },
  { col0: '2020-03-14', col1: 'EM', 'Direct Transactions': 2555.7 },
  { col0: '2020-03-14', col1: 'Facebook', 'Direct Transactions': 105 },
  { col0: '2020-03-14', col1: 'N/A', 'Direct Transactions': 742.5 },
  { col0: '2020-03-14', col1: 'TW', 'Direct Transactions': 30 },
  { col0: '2020-03-14', col1: 'WEB', 'Direct Transactions': 2852 },
  { col0: '2020-03-15', col1: 'EM', 'Direct Transactions': 3115.6 },
  { col0: '2020-03-15', col1: 'Facebook', 'Direct Transactions': 85 },
  { col0: '2020-03-15', col1: 'N/A', 'Direct Transactions': 796 },
  { col0: '2020-03-15', col1: 'Other', 'Direct Transactions': 20 },
  { col0: '2020-03-15', col1: 'TW', 'Direct Transactions': 859 },
  { col0: '2020-03-15', col1: 'WEB', 'Direct Transactions': 6280 },
  { col0: '2020-03-16', col1: 'EM', 'Direct Transactions': 2442 },
  { col0: '2020-03-16', col1: 'Facebook', 'Direct Transactions': 3 },
  { col0: '2020-03-16', col1: 'N/A', 'Direct Transactions': 1515 },
  { col0: '2020-03-16', col1: 'Other', 'Direct Transactions': 250 },
  { col0: '2020-03-16', col1: 'TW', 'Direct Transactions': 185.2 },
  { col0: '2020-03-16', col1: 'WEB', 'Direct Transactions': 6088 },
  { col0: '2020-03-17', col1: 'EM', 'Direct Transactions': 944 },
  { col0: '2020-03-17', col1: 'Facebook', 'Direct Transactions': 5 },
  { col0: '2020-03-17', col1: 'N/A', 'Direct Transactions': 457.13 },
  { col0: '2020-03-17', col1: 'OTHER', 'Direct Transactions': 5 },
  { col0: '2020-03-17', col1: 'TEXT', 'Direct Transactions': 7.5 },
  { col0: '2020-03-17', col1: 'TW', 'Direct Transactions': 462.73 },
  { col0: '2020-03-17', col1: 'WEB', 'Direct Transactions': 8220 },
  { col0: '2020-03-18', col1: 'EM', 'Direct Transactions': 2530.59 },
  { col0: '2020-03-18', col1: 'Facebook', 'Direct Transactions': 45 },
  { col0: '2020-03-18', col1: 'N/A', 'Direct Transactions': 942 },
  { col0: '2020-03-18', col1: 'TW', 'Direct Transactions': 1135 },
  { col0: '2020-03-18', col1: 'WEB', 'Direct Transactions': 3325 },
  { col0: '2020-03-19', col1: 'EM', 'Direct Transactions': 2318 },
  { col0: '2020-03-19', col1: 'Facebook', 'Direct Transactions': 115 },
  { col0: '2020-03-19', col1: 'N/A', 'Direct Transactions': 1001 },
  { col0: '2020-03-19', col1: 'TW', 'Direct Transactions': 1346 },
  { col0: '2020-03-19', col1: 'WEB', 'Direct Transactions': 1277 },
  { col0: '2020-03-20', col1: 'EM', 'Direct Transactions': 2744.2 },
  { col0: '2020-03-20', col1: 'Facebook', 'Direct Transactions': 230 },
  { col0: '2020-03-20', col1: 'N/A', 'Direct Transactions': 210 },
  { col0: '2020-03-20', col1: 'Other', 'Direct Transactions': 1 },
  { col0: '2020-03-20', col1: 'TW', 'Direct Transactions': 604 },
  { col0: '2020-03-20', col1: 'WEB', 'Direct Transactions': 2124 },
  { col0: '2020-03-21', col1: 'EM', 'Direct Transactions': 1408 },
  {
    col0: '2020-03-21',
    col1: 'Facebook',
    'Direct Transactions': 100.5
  },
  { col0: '2020-03-21', col1: 'N/A', 'Direct Transactions': 463 },
  { col0: '2020-03-21', col1: 'TW', 'Direct Transactions': 268 },
  { col0: '2020-03-21', col1: 'WEB', 'Direct Transactions': 5085 },
  { col0: '2020-03-22', col1: 'EM', 'Direct Transactions': 1231 },
  {
    col0: '2020-03-22',
    col1: 'Facebook',
    'Direct Transactions': 178.2
  },
  { col0: '2020-03-22', col1: 'N/A', 'Direct Transactions': 1019.5 },
  { col0: '2020-03-22', col1: 'TW', 'Direct Transactions': 325 },
  { col0: '2020-03-22', col1: 'WEB', 'Direct Transactions': 489 },
  { col0: '2020-03-23', col1: 'EM', 'Direct Transactions': 445.5 },
  {
    col0: '2020-03-23',
    col1: 'Facebook',
    'Direct Transactions': 252.9
  },
  { col0: '2020-03-23', col1: 'N/A', 'Direct Transactions': 93 },
  { col0: '2020-03-23', col1: 'TW', 'Direct Transactions': 552 },
  { col0: '2020-03-23', col1: 'WEB', 'Direct Transactions': 327 },
  { col0: '2020-03-24', col1: 'EM', 'Direct Transactions': 300.21 },
  {
    col0: '2020-03-24',
    col1: 'Facebook',
    'Direct Transactions': 996.2
  },
  { col0: '2020-03-24', col1: 'N/A', 'Direct Transactions': 3774.2 },
  { col0: '2020-03-24', col1: 'TW', 'Direct Transactions': 98.2 },
  { col0: '2020-03-24', col1: 'WEB', 'Direct Transactions': 2321.55 },
  { col0: '2020-03-25', col1: 'EM', 'Direct Transactions': 672.5 },
  {
    col0: '2020-03-25',
    col1: 'Facebook',
    'Direct Transactions': 167.89
  },
  { col0: '2020-03-25', col1: 'N/A', 'Direct Transactions': 2143.5 },
  { col0: '2020-03-25', col1: 'TW', 'Direct Transactions': 30 },
  { col0: '2020-03-25', col1: 'WEB', 'Direct Transactions': 1425 },
  { col0: '2020-03-26', col1: 'EM', 'Direct Transactions': 231.5 },
  {
    col0: '2020-03-26',
    col1: 'Facebook',
    'Direct Transactions': 151.5
  },
  { col0: '2020-03-26', col1: 'N/A', 'Direct Transactions': 405 },
  { col0: '2020-03-26', col1: 'TW', 'Direct Transactions': 55 },
  { col0: '2020-03-26', col1: 'WEB', 'Direct Transactions': 1900 }
]
	,
	revenue_pie:[
		  { name: 'WEB', value: 163461.49 },
		  { name: 'TW', value: 53064.37 },
		  { name: 'TEXT', value: 52.5 },
		  { name: 'Other', value: 682.5 },
		  { name: 'N/A', value: 106881.65 },
		  { name: 'GS', value: 0 },
		  { name: 'Facebook', value: 34344.3 },
		  { name: 'EM', value: 173055.36 }
	]
}

export {report,data};
