import React, { Component } from "react";
import { sortBy } from "lodash";
import { Button,Sort } from "../Button/index";

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, "title")
  };
class Table extends Component{
    constructor(props) {
      super(props);
      this.state={
        sortKey: "NONE",
        isSortReverse: false
      }
      this.onSort=this.onSort.bind(this);
      
    }
    // sorting functin
    onSort(sortKey) {
      const isSortReverse =
        this.state.sortKey === sortKey && !this.state.isSortReverse;
      this.setState({ sortKey, isSortReverse });
    }
    
    render(){
      const {list,RemoveItem}=this.props;
      const{sortKey,isSortReverse}=this.state
      const sortedList = SORTS[sortKey](list);
      const reversedSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <div className="col-sm-10 col-offset-1">
        <div>
          <Sort sortKey="TITLE" onSort={this.onSort} activeSortKey={sortKey}>
            Title
          </Sort>
          <Sort sortKey="NONE" onSort={this.onSort} activeSortKey={sortKey}>
            NONE
          </Sort>
        </div>
        {reversedSortedList.map(item => (
          <div key={item.objectID}>
            <Button
              className="btn btn-danger btn-xs"
              type="button"
              onClick={() => RemoveItem(item.objectID)}
            >
              remove
            </Button>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    )
  }
  };

  export default Table;