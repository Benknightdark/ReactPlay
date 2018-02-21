import React, { Component } from "react";
import { Grid, Row } from "react-bootstrap";
import Table from "../Table/index";  
import Search from "../Search/index";  
import { Button,Loading } from "../Button/index";
import {
  DEFAULT_QUERY,
  DEFAULT_PAGE,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP
} from "../../constants/index";
// function isSearched(searchTerm) {
//   return function(item) {
//     return (
//       !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };
// }
// Higher Order Component
const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

const updateTopStories=(hits,page)=>prevState=>{
  const { searchKey, results } = prevState;
  const oldHits = results && results.searchKey ? results[searchKey].hits : [];
  const updateHits = [...oldHits, ...hits];
  return {
  results: { ...results, [searchKey]: { hits: updateHits, page } },
  isLoading: false
  }
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
    
    };
    this.RemoveItem = this.RemoveItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  
  checkTopStoriesSearchTerm(searchTerm) {
    return !this.state.results[searchTerm];
  }
  setTopStories(result) {

    const { hits, page } = result;
    this.setState(updateTopStories(hits,page));
   
    
   
  }
  fetchTopStories(searchTerm, page) {
    this.setState({ isLoading: true });
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(res => res.json())
      .then(result => this.setTopStories(result))
      .catch(err => err);
  }
  onSubmit(event) {
    const { searchTerm } = this.state;

    this.setState({ searchKey: searchTerm });
    if (this.checkTopStoriesSearchTerm(searchTerm)) {
      this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
    }

    event.preventDefault();
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
  }
  RemoveItem(id) {
    const { results, searchKey } = this.state;
    const { hits, page } = results[searchKey];
    //const isNotId = item => item.objectID !== id;
    const UpdatList = hits.filter(item => item.objectID !== id);
    this.setState({
      results: { ...results, [searchKey]: { hits: UpdatList, page } }
    });
  }
  searchValue(event) {
    this.setState({ searchTerm: event.target.value });
    console.log(event);
  }
  render() {
    const {
      results,
      searchTerm,
      searchKey,
      isLoading
    } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
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
                RemoveItem={this.RemoveItem}
              />
            </div>
          </Row>
          <div className="text-center alert">
            <ButtonWithLoading
              isLoading={isLoading}
              className="btn btn-success"
              onClick={() => this.fetchTopStories(searchTerm, page + 1)}
            >
              Load More
            </ButtonWithLoading>
          </div>
        </Grid>
      </div>
    );
  }
}







const ButtonWithLoading = withLoading(Button);

export default App;
