import { React,Component } from "react";
import './react-table.css';

class ReactTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            tableData: [],
            currentPage: 0 ,
            currentTableData:[]
         }
        this.deleteRow = this.deleteRow.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    deleteRow(id){
        let deletedRowIndex = this.state.tableData[this.state.currentPage].findIndex((row)=> row.id === id)
        let temptableData = this.state.tableData[this.state.currentPage].slice();
        temptableData[deletedRowIndex].deleted = true;
        this.setState({
            tableData: {...this.state.tableData, temptableData}
        })
    }

    changePage(action){
        if (action ==='prev') {
            this.setState((prevstate, props)=>{
                if(prevstate.currentPage !== 0){
                    return {
                        currentPage: prevstate.currentPage - 5
                    }
                }
            }, ()=>{
                this.updateTableView();
            })
        } else {
            this.setState((prevstate, props)=>{
                return {
                    currentPage: prevstate.currentPage + 5
                }
            },()=>{
                this.updateTableView();
            })
        }
        
    }

    updateTableView(){
        if (!this.state.tableData[this.state.currentPage]) {
            this.updateTableData();
        }else{
            this.setState({
                currentTableData: this.state.tableData[this.state.currentPage]
            })
        }
    }
    render() {
        let deleteIcon='\U+2421';
        const generateRows = (tableData) => {
            return tableData.map((tableRow, i)=>{
                if (!tableRow.deleted) {
                    return (
                       <tr key={tableRow.id}>
                          <td>{tableRow.id}</td>
                          <td><img width="50" src={tableRow.url}></img></td>
                          <td>{tableRow.title}</td>
                          <td>{tableRow.url}</td>
                          <td>
                              <button onClick={this.deleteRow.bind(this, tableRow.id)}>Delete Row</button>
                              {/* <button onClick={this.editRow.bind(this, tableRow.id)}>Edit Row</button> */}
                          </td>
                       </tr>
                    );
                } else {    
                    return null;
                }
            })
         }

        return (<div>
            <table className="react-table">
            <thead>
                <th>Id</th>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Album Url</th>
                <th>Action</th>
            </thead>
                <tbody>
                    {generateRows(this.state.currentTableData)}
                </tbody>
            </table>
            <button disabled={this.state.currentPage===0} onClick={this.changePage.bind(this, 'prev')}>Prev</button>
            <button onClick={this.changePage.bind(this, 'next')}>Next</button>
        </div>  );
    }

    updateTableData(){
        fetch("http://jsonplaceholder.typicode.com/photos?_start=" + this.state.currentPage +"&_limit=5")
        .then(res => res.json())
        .then(
            (result) => {
            console.log('Result: ', result);
            this.setState({tableData: {...this.state.tableData, [this.state.currentPage]: result},
                currentTableData: result});
        });
    }

    componentDidMount() {
        this.updateTableData();
    }
}
 
export default ReactTable;