import React,{useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/List';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

function ColumnPicker({columns,columnIndexes,setColumnIndexes}){
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	function toggle(i,include){
		let newCols=columnIndexes.slice(0);
		if (include && newCols.indexOf(i)<0){
			newCols.push(i);
		}
		if (!include){
			newCols=newCols.filter(v=>v!=i);
		}
		newCols.sort();
		setColumnIndexes(newCols);
	}

	//let indexes=columns.map((d,i)=>i).filter(()=>Math.floor(Math.random()*2));
	return <div>
		<IconButton onClick={handleClick}><MenuIcon/></IconButton>
		<Popover
			id={id}
			open={open}
			anchorEl={anchorEl}
			onClose={handleClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}>
			<Box className="p-2">
				<FormControl component="fieldset">
					<FormLabel component="legend">Pick Columns</FormLabel>
					<FormGroup>
						{columns.map((col,i)=>{
							return <FormControlLabel
								key={i}
								control={<Checkbox checked={columnIndexes.indexOf(i)>=0} value={i} onChange={e=>toggle(i,e.target.checked)}/>}
								label={col.title}
							/>;
						})}
					</FormGroup>
				</FormControl>
			</Box>
		</Popover>
	</div>;
}

export default function FraktureTable({columns,rows,renderRow,onSelectedChange,onRowClick,onRowChange,
	onRowDelete,
	getRowClass,
	includeSelectBox=false,
	includeEditing=false,
	includeColumnPicker=true,
	includeGroupBy=false,
	includePagination=true,
	sort:defaultSort="",
	sortDirection:defaultSortDirection="asc",
	onSort,
	rowsPerPage:startingRowsPerPage=100,
	padding="default"
}){
	const [sort, setSort] = useState(defaultSort);
	const [sortDirection, setSortDirection] = useState(defaultSortDirection);
	const [groupBy, setGroupBy] = useState("");
	const [groupByDisplay, setGroupByDisplay] = useState(null);
	const [editing, setEditing] = useState(false);
	const [selected, setInternalSelected] = useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(startingRowsPerPage));

	//which columns to show, default the first 15
	const [columnIndexes,setColumnIndexes] = useState([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);

	const _columns=(columns || Object.keys(rows[0]||{"No Data":1}).map(k=>{return {title:k,field:k};})).map(c=>{
		c.format=c.format|| (f=>f);
		return c;
	});

	let sortedRows=rows;
	if (sort){
		let desc=sortDirection=="desc"?1:-1;
		sortedRows=rows.slice(0).sort((a,b)=>a[sort]<b[sort]?desc:-desc);
	}
	rows.forEach((r,i)=>{
		r.id=r.id || i;
	});

	//Set the state, and then optionally pass up the chain
	function setSelected(s){
		//filter out rows the may have been removed
		s=s.filter(selectedRow=>rows.find(r=>r.id==selectedRow));
		setInternalSelected(s);
		if (typeof onSelectedChange=='function') onSelectedChange(s);
	}

	let finalRows=null;
	if (includeGroupBy && groupBy){
		const values={};
		sortedRows.forEach(r=>{
			values[r[groupBy]]=(values[r[groupBy]]||[]).concat(r);
		});
		finalRows=[];
		let grouped=Object.keys(values).map(v=>{
			return {value:v,rows:values[v],count:values[v].length};
		}).sort((a,b)=>a.count<b.count?1:-1);
		grouped.forEach(v=>{
			finalRows.push({component:<TableRow onClick={e=>setGroupByDisplay(groupByDisplay==v.value?null:v.value)}>
				<TableCell colSpan={_columns.length+1}>
					<h4>{(_columns.find(col=>col.field==groupBy)||{title:groupBy}).title+" ("+v.rows.length+" records) : "+v.value}</h4>
				</TableCell>
			</TableRow>
			});
			if (groupByDisplay!=null && groupByDisplay==v.value){
				finalRows=finalRows.concat(v.rows);
			}
		});
	}else{
		finalRows=sortedRows;
	}

	function handlePaste(e){
		console.log(e.clipboardData.getData('Text'));
		console.log(e.clipboardData.getData('text/plain'));
		console.log(e.clipboardData.getData('text/html'));
		console.log(e.clipboardData.getData('text/rtf'));

		console.log(e.clipboardData.getData('Url'));
		console.log(e.clipboardData.getData('text/uri-list'));
		console.log(e.clipboardData.getData('text/x-moz-url'));
	}

	function handleSelectAllClick(event) {
		let displayedRows=finalRows.map(n => n.id).filter(d=>d!=undefined);
		if (event.target.checked && selected.length!=displayedRows.length) {
			const newSelecteds = displayedRows;
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	}

	function handleSelectClick(event, id) {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}
		setSelected(newSelected);
	}

	function handleCellChange(row,event){
		if (row[event.target.name]!=event.target.value){
			row[event.target.name]=event.target.value;
			if (onRowChange) onRowChange(row);
		}
	}
	function rowClass(row,i){
		if (getRowClass) return getRowClass(row,i);
		else return "";
	}

	const _renderRow=renderRow || function(row,i){
		let newValues={};
		return <React.Fragment key={i}>{row.component || <TableRow
			selected={selected.indexOf(row.id)>=0}
			className={rowClass(row,i)}
			onClick={e=>{
				return typeof onRowClick=='function'?onRowClick(row):null;
			}
			}
		>{includeSelectBox &&<TableCell
				role="checkbox"
				aria-checked={selected.indexOf(row.id)>=0}
				padding="checkbox"
				onClick={event =>{handleSelectClick(event, row.id);event.stopPropagation();}}>
				<Checkbox
					checked={selected.indexOf(row.id)>=0}
				/>
			</TableCell>
			}
			{_columns.map((c,j)=> {
				if (columnIndexes && columnIndexes.indexOf(j)<0) return "";
				return <TableCell key={j} align={c.align} className="text-nowrap">
					{c.render?c.render({row}):
						(editing&c.field!="id")?<input
							type="text"
							name={c.field}
							onBlur={e=>handleCellChange(row,e)}
							onPaste={handlePaste}
							key={`${c.field}:${newValues[c.field] || row[c.field]}`}
							defaultValue={newValues[c.field] || row[c.field]}
						/>:c.format(row[c.field])
					}</TableCell>;
			})}<TableCell>{(editing&&onRowDelete)?<DeleteIcon onClick={()=>onRowDelete(row)}/>:""}</TableCell>
		</TableRow>}</React.Fragment>;
	};
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		console.error("setting rows per page");
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	let rowsPerPageOptions=[5,10,25,100];
	if (rowsPerPageOptions.indexOf(rowsPerPage)<0) rowsPerPageOptions=rowsPerPageOptions.concat(parseInt(rowsPerPage)).sort((a,b)=>(parseInt(a)<parseInt(b)?-1:1));

	return (
		<div style={{overflowX: 'auto'}}>
			{/*stickyHeader causes non-scrolling bug */}
			<Table size="small" padding={padding} style={{minWidth: 750}}>
				<TableHead>
					<TableRow>{includeSelectBox && <TableCell padding="checkbox"><Checkbox
						checked={selected.length === finalRows.length}
						onChange={handleSelectAllClick}
						inputProps={{ 'aria-label': 'Select All' }}
					/></TableCell>}{_columns.map((c,i)=>{
						if (columnIndexes && columnIndexes.indexOf(i)<0) return "";
						return <TableCell key={i} align={c.align} className="text-nowrap"
						><Tooltip title={c.description||""} disableHoverListener={!c.description} placement="top"><TableSortLabel
								active={c.field == sort}
								direction={sortDirection}
								onClick={e => {
									let dir=sortDirection==('asc')?'desc':'asc';
									setSort(c.field);
									setSortDirection(dir);
									if (typeof onSort=='function') onSort(c.field,dir);
								}}>
								{c.title}
							</TableSortLabel></Tooltip>{includeGroupBy?<Button className={c.field==groupBy?"active":""} size="small"><ListIcon onClick={e => setGroupBy(c.field==groupBy?"":c.field)} color={groupBy==c.field?"primary":"action"}/></Button>:""}</TableCell>;
					})}<TableCell padding="checkbox" className="d-flex">
						{includeColumnPicker && <ColumnPicker columns={_columns} columnIndexes={columnIndexes} setColumnIndexes={cols=>setColumnIndexes(cols)}/>}
						{includeEditing &&<IconButton color={editing?"secondary":"primary"}
							onClick={e=>setEditing(!editing)}><EditIcon/></IconButton>}</TableCell>
					</TableRow>
				</TableHead>
					<TableBody>
						{includePagination?
							finalRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(_renderRow)
							:
							finalRows.map(_renderRow)
						}
					</TableBody>
			</Table>
			{includePagination && <TablePagination
				rowsPerPageOptions={rowsPerPageOptions}
				component="div"
				count={finalRows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>}
			{editing?
				<Fab color="primary" aria-label="add" onClick={()=>{if (onRowChange)onRowChange({});}}>
					<AddIcon />
				</Fab>
				:""}
		</div>
	);
}
