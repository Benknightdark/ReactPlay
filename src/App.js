import React, { Component } from "react";
import list from "./list";
import logo from "./logo.svg";
import "./App.css";
function isSearched(searchTerm) {
  return function(item) {
    return (
      !searchTerm || item.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: list,
      searchTerm: ""
    };
    this.RemoveItem = this.RemoveItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
  }
  RemoveItem(id) {
    const isNotId = item => item.ObjectID !== id;
    const UpdatList = this.state.list.filter(isNotId);
    this.setState({ list: UpdatList });
  }
  searchValue(event) {
    this.setState({ searchTerm: event.target.value });
    console.log(event);
  }
  render() {
    const { list, searchTerm } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to ds1111fdsf</h1>
        </header>
        <div className="App-intro">
          <Search onChange={this.searchValue} value={searchTerm}>
            search me
          </Search>
          <Table
            list={list}
            searchTerm={searchTerm}
            RemoveItem={this.RemoveItem}
          />
        </div>
      </div>
    );
  }
}
//Reuse button Component
// class Button extends Component {
//   render() {
//     const{onClick,children}=this.props
//     return (
//       <button onClick={onClick}>
//         {children}
//       </button>
//     );
//   }
// }

//button reuse function 
// function Button({onClick,children}){
//   return (
//     <button onClick={onClick}>
//       {children}
//     </button>
//   );
// }

//es6 button reuse function 
const Button = ({ onClick, children }) => <button onClick={onClick}>{children}</button>;

// class Search extends Component {
//   render() {
//     const { onChange, value, children } = this.props;
//     return (
//       <form>
//         {children}
//         <input type="text" onChange={onChange} value={value} />
//       </form>
//     );
//   }
// }
 const Search = ({ onChange, value, children }) =>  {
  return (
    <form>
      {children}
      <input type="text" onChange={onChange} value={value} />
    </form>
  )
};

//table component
// class Table extends Component {
//   render() {
//     const { list, searchTerm, RemoveItem } = this.props;
//     return (
//       <div>
//         {list.filter(isSearched(searchTerm)).map(item => (
//           <div key={item.ObjectID}>
//             <Button type="button" onClick={() => RemoveItem(item.ObjectID)}>
//               aa
//             </Button>
//             <span>{item.text}</span>
//             <span>{item.value}</span>
//           </div>
//         ))}
//       </div>
//     );
//   }
// }

//table function
const Table=({ list, searchTerm, RemoveItem })=>{
  return (
    <div>
      {list.filter(isSearched(searchTerm)).map(item => (
        <div key={item.ObjectID}>
          <Button type="button" onClick={() => RemoveItem(item.ObjectID)}>
            aa
          </Button>
          <span>{item.text}</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
}
export default App;
