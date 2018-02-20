import React, { Component } from "react";
//import list from "./list";
import { Grid, Row, FormGroup } from "react-bootstrap";
//Web API Parameter
const DEFAULT_QUERY = "Angular";
const DEFAULT_PAGE = 0;
const DEFAULT_HPP=100;
const PATH_BASE = "http://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP="hitsPerPage="
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
      results: null,
      searchKey:'',
      searchTerm: DEFAULT_QUERY
    };
    this.RemoveItem = this.RemoveItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  checkTopStoriesSearchTerm(searchTerm){
    return !this.state.results[searchTerm]
  }
  setTopStories(result) {
    const {hits,page}=result;
    const {searchKey,results}=this.state
    //const oldHits=page!==0?this.state.result.hits:[];
    const oldHits=results&&results.searchKey?results[searchKey].hits:[];
    const updateHits=[...oldHits,...hits]
    this.setState({ results: {...results,[searchKey]:{hits:updateHits,page} } });
  }
  fetchTopStories(searchTerm, page) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(res => res.json())
      .then(result => this.setTopStories(result))
      .catch(err => err);
  }
  onSubmit(event) {
    const {searchTerm}=this.state;
   
    this.setState({searchKey:searchTerm})
    if(this.checkTopStoriesSearchTerm(searchTerm)){
      this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
    }
    
    event.preventDefault();
  }
  componentDidMount() {
    const {searchTerm}=this.state;
    this.setState({searchKey:searchTerm})
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
  }
  RemoveItem(id) {
    const { results,searchKey } = this.state;
    const {hits,page}=results[searchKey]
    //const isNotId = item => item.objectID !== id;
    const UpdatList = hits.filter(item => item.objectID !== id);
    this.setState({ results: { ...results,[searchKey]:{hits: UpdatList,page}  } });
  }
  searchValue(event) {
    this.setState({ searchTerm: event.target.value });
    console.log(event);
  }
  render() {
    const { results, searchTerm ,searchKey} = this.state;
    const page = (results &&results[searchKey] && results[searchKey].page) || 0;
    const list=(results &&results[searchKey] && results[searchKey].hits) || [];
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
          
              <div className="jumbotron">
                <Table
                  list={list}
                  searchTerm={searchTerm}
                  RemoveItem={this.RemoveItem}
                />
              </div>
            
          </Row>
          <div className="text-center alert">
            <Button
              className="btn btn-success"
              onClick={() => this.fetchTopStories(searchTerm, page + 1)}
            >
              Load More
            </Button>
          </div>
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
