import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTable , usePagination, useFilters,useSortBy} from "react-table";
import axios from "axios";
import { ColumnFilter } from "./Columnfilter";
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINT } from "../constants";



const playerDataUrl=API_ENDPOINT+"getAllPlayers";
const PlayerList = (props) => {
  //let history = useHistory();
  let navigate = useNavigate(); 
  const [players, setPlayers] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const playersRef = useRef();
  
    playersRef.current = players;
  
    useEffect(() => {
      retrievePlayers();
    }, []);
    
    const retrievePlayers = () => {
        //var xdas=[{"clubName": "FC Barcelona","countryName": "Argentina","playerId": 1,"playerName": "L. Messi"},{"clubName": "Juventus","countryName": "Portugal","playerId": 2,"playerName": "Cristiano Ronaldo"}];
        //setPlayers(xdas);
        axios.get(playerDataUrl, {
    
        })
        .then(function (response) {
         
          console.log(response.data.players.length);
          setPlayers(response.data.players);
          console.log(response.data.players);
        }) .catch((e) => {
            console.log(e);
          });        
    };
  
 
   
    const openTutorial = (rowIndex) => {
      const id = playersRef.current[rowIndex].playerId;
      navigate({
        pathname: '/playerEdit',
        search: '?playerId='+id,
      });  
     // navigate("/playerEdit/playerId=" + id);
    };
  
       
    const viewTutorial = (rowIndex) => {
      const id = playersRef.current[rowIndex].playerId;
      navigate({
        pathname: '/playerView',
        search: '?playerId='+id,
      });  
     // navigate("/playerEdit/playerId=" + id);
    };
  

    const deleteTutorial = (rowIndex) => {
      const id = playersRef.current[rowIndex].playerId;
      axios.get(API_ENDPOINT+"deletePlayer", {
        params: { playerId: id } 
      }).then(function (response) {
      console.log(response.data.player);
      navigate('/players');  
      let newTutorials = [...playersRef.current];
      newTutorials.splice(rowIndex, 1);
      setPlayers(newTutorials);
       
      }) .catch((e) => {
       console.log(e);
     });      
    };
  
    const columns = useMemo(
      () => [
        {
          Header: "Id",
          accessor: "playerId",
          Filter : ColumnFilter
        },
        {
          Header: "Name",
          accessor: "playerName",
          Filter : ColumnFilter
        },
        {
          Header: "Country",
          accessor: "countryName",
          Filter : ColumnFilter
        },
        {
            Header: "Club",
            accessor: "clubName",
            Filter : ColumnFilter
        },
        {
          Header: "Actions",
          accessor: "actions",
          Filter : ColumnFilter,
          disableFilters : true,
          Cell: (props) => {
            const rowIdx = props.row.id;
            return (
              <div>

                <span onClick={() => viewTutorial(rowIdx)}>
                  <i className="fa fa-eye"></i>
                </span>  

                <span onClick={() => openTutorial(rowIdx)}>
                  <i className="far fa-edit action mr-2"></i>
                </span>
  
                <span onClick={() => deleteTutorial(rowIdx)}>
                  <i className="fas fa-trash action"></i>
                </span>
              </div>
            );
          }
        }
      ],
      []
    );
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      nextPage,
      previousPage,
      canNextPage,
      canPreviousPage,
      pageOptions,
      gotoPage,
      pageCount,
      setPageSize,
      state,
      prepareRow,
    } = useTable({
      columns,
      data: players,
      initialState: { pageIndex: 0, pageSize: 15 }
    },
    useFilters,
    usePagination
    );
  
    const {pageIndex, pageSize}=state

    return (
      <div className="list row">
        
        <div className="col-md-12 list">
          <table
            className="table table-striped table-bordered"
            {...getTableProps()}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                      <div>{column.canFilter ? column.render('Filter') : null}</div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <span>
              Page {' '}
              <strong>
                {pageIndex+1} of {pageOptions.length}
              </strong> {' '}
          </span>  
          <span>
             | Go to page: {' '} 
             <input type='number' default={pageIndex+1} onChange={e => {
               const pageNumber = e.target.value ? Number(e.target.value) -1 : 0
               gotoPage(pageNumber)

             }}
              style={{width: '50px'}}
             />  


          </span>
           <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>  {'<<'}  </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
            <button onClick={() => gotoPage(pageCount-1)} disabled={!canNextPage}>  {'>>'}  </button>
        </div>
  
       
      </div>
    );
  };
  
  export default PlayerList;