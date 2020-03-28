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


## Local Development resolution

When developing locally using npm link, your application may incorrectly view the react and/or react-dom libraries in frakture-react-reports as non peer dependencies, and throw a Invalid Hooks error.  Here is the text from Facebook on how to resolve that issue:

https://reactjs.org/warnings/invalid-hook-call-warning.html


"This problem can also come up when you use npm link or an equivalent. In that case, your bundler might “see” two Reacts — one in application folder and one in your library folder. Assuming myapp and mylib are sibling folders, one possible fix is to run npm link ../myapp/node_modules/react from mylib. This should make the library use the application’s React copy."




[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package
