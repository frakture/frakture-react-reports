import React from 'react';
const HistoryContext = React.createContext();

function HistoryProvider(props) {
	if (!props.history) return "A history object is required for navigation";
	return (
		<HistoryContext.Provider value={props.history}>
			{props.children}
		</HistoryContext.Provider>
	);
}
export { HistoryContext, HistoryProvider };
