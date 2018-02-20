import React, { Component } from "react";
//import list from "./list";
import { Grid, Row, FormGroup } from "react-bootstrap";
//Web API Parameter
const DEFAULT_QUERY = "Angular";
const DEFAULT_PAGE = 0;
const PATH_BASE = "http://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
// const url=PATH_BASE+PATH_SEARCH+'?'+PARAM_SEARCH+DEFAULT_QUERY;
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);
function isSearched(searchTerm) {
  return function(item) {
    return (
      !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };
    this.RemoveItem = this.RemoveItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  setTopStories(result) {
    this.setState({ result: result });
  }
  fetchTopStories(searchTerm,page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
      .then(res => res.json())
      .then(result => this.setTopStories(result))
      .catch(err => err);
  }
  onSubmit(event) {
    this.fetchTopStories(this.state.searchTerm,DEFAULT_PAGE);
    event.preventDefault();
  }
  componentDidMount() {
    this.fetchTopStories(this.state.searchTerm,DEFAULT_PAGE);
  }
  RemoveItem(id) {
    const { result } = this.state;
    const isNotId = item => item.objectID !== id;
    const UpdatList = result.hits.filter(isNotId);
    this.setState({ result: { ...result, hits: UpdatList } });
  }
  searchValue(event) {
    this.setState({ searchTerm: event.target.value });
    console.log(event);
  }
  render() {
    const { result, searchTerm } = this.state;
    const page=(result&&result.page)||0;
    //   if(!result){return null;}
    return (
      <div>
        <Grid>
          <Row>
            <div className="jumbotron">
              <Search
                onChange={this.searchValue}
                value={searchTerm}
                onSubmit={this.onSubmit}
              >
                search me
              </Search>
            </div>
          </Row>
          <Row>
            {result && (
              <div className="jumbotron">
                <Table
                  list={result.hits}
                  searchTerm={searchTerm}
                  RemoveItem={this.RemoveItem}
                />
              </div>
            )}
            <div></div>
            
          </Row>
          <Button 
            onClick={()=>this.fetchTopStories(searchTerm,page+1)}
            >
            Load More
            </Button>
        </Grid>
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
const Button = ({ onClick, children, className = "" }) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
);

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
const Search = ({ onChange, value, children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <FormGroup>
        <div className="input-group">
          <h1>{children}</h1>
          <hr style={{ border: "2px" }} />
          <input
            type="text"
            onChange={onChange}
            value={value}
            className="form-control width100"
          />
          <span className="input-group-btn">
            <button className="btn btn-primary" type="submit">
              search
            </button>
          </span>
        </div>
      </FormGroup>
    </form>
  );
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
const Table = ({ list, searchTerm, RemoveItem }) => {
  return (
    <div className="col-sm-10 col-offset-1">
      {// list.filter(isSearched(searchTerm)).map(item => (
      list.map(item => (
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
  );
};
export default App;
