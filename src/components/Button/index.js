import React from "react";

//es6 button reuse function
export const Button = ({ onClick, children, className = "" }) => (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
  export const Loading = () => <div>loading ...</div>;
  export const Sort = ({ sortKey, onSort, activeSortKey,children }) => {
 const sortClass = ["btn btn-default"];
  if (sortKey === activeSortKey) {
    sortClass.push("btn btn-primary");
  }
 
  console.log(activeSortKey)
  return (
    <Button  className={sortClass.join(' ')}  onClick={() => onSort(sortKey)}>
      {children}
    </Button>
  );
};