import React from 'react';
const DataQueryContext = React.createContext();

function DataQueryProvider(props) {
	return (
		<DataQueryContext.Provider value={props.executeDataQuery}>
			{props.children}
		</DataQueryContext.Provider>
	);
}
export { DataQueryContext, DataQueryProvider };
