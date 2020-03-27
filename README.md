# frakture-react-reports

## Introduction

Frakture React Reports is a React component to add Frakture charting to your application.  It is designed for use with a Frakture data endpoint.

## Installation

### npm

NPM is the easiest and fastest way to get started using Frakture React Reports. It is also the recommended installation method when building single-page applications (SPAs). It pairs nicely with a CommonJS module bundler such as Webpack.


```sh
# latest stable
$ npm install frakture-react-reports
```

## Sample usage
Frakture React Reports requires:

1) A wrapping router for dynamic URL navigation

2) An executeDataQuery React hook of the following structure

```
function executeDataQuery({name,variables}){
	return {data:<resulting data array>,error:null,loading:null}
}
```

3) A 'report' parameter that has includes the report configuration, including at least 'components' and 'layouts'

For example:


```
import {BrowserRouter as Router} from "react-router-dom";
import {ReportDisplay} from '../../src'

function executeDataQuery({name,variables}){
	return {data:sampleData,error:null,loading:null}
}

function Demo(props){
    return <Router>
					<ReportDisplay {...{executeDataQuery,report}}/>
			</Router>;
}
```


### development build

```sh
$ git clone https://github.com/frakture/frakture-react-reports
$ cd frakture-react-reports
$ npm install
$ npm run build
```

## Development Demo

To examine the demos in your local build, execute:

```sh
$ npm run start
```

and then browse to http://localhost:3000.

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package
