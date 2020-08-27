import React from 'react';
const DataQueryContext = React.createContext();

function DataQueryProvider(props) {
	let exec=props.useDataQuery || props.executeDataQuery;
	return (
		<DataQueryContext.Provider value={exec}>
			{props.children}
		</DataQueryContext.Provider>
	);
}
export { DataQueryContext, DataQueryProvider };
