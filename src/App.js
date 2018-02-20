import React, { Component } from "react";
import { Grid, Row, FormGroup } from "react-bootstrap";
import {
  DEFAULT_QUERY,
  DEFAULT_PAGE,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP
} from "./constants/index";
import { sortBy } from "lodash";
import PropTypes from "prop-types";
function isSearched(searchTerm) {
  return function(item) {
    return (
      !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
}
// Higher Order Component
const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;
const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, "title")
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
      sortKey: "NONE",
      isSortReverse: false
    };
    this.RemoveItem = this.RemoveItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSort = this.onSort.bind(this);
  }
  // sorting functin
  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }
  checkTopStoriesSearchTerm(searchTerm) {
    return !this.state.results[searchTerm];
  }
  setTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    //const oldHits=page!==0?this.state.result.hits:[];
    const oldHits = results && results.searchKey ? results[searchKey].hits : [];
    const updateHits = [...oldHits, ...hits];
    this.setState({
      results: { ...results, [searchKey]: { hits: updateHits, page } },
      isLoading: false
    });
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
      isLoading,
      sortKey,
      isSortReverse
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
                sortKey={sortKey}
                onSort={this.onSort}
                searchTerm={searchTerm}
                RemoveItem={this.RemoveItem}
                isSortReverse={isSortReverse}
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
Button.prototypes = {
  onCLick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};
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
class Search extends Component {
  componentDidMount() {
    this.input.focus();
  }
  render() {
    const { onChange, value, children, onSubmit } = this.props;
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
              ref={node => {
                this.input = node;
              }}
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
  }
}

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
const Table = ({
  list,
  searchTerm,
  RemoveItem,
  sortKey,
  onSort,
  isSortReverse
}) => {
  const sortedList = SORTS[sortKey](list);
  const reversedSortedList = isSortReverse ? sortedList.reverse() : sortedList;
  return (
    <div className="col-sm-10 col-offset-1">
      <div>
        <Sort sortKey="TITLE" onSort={onSort} activeSortKey={sortKey}>
          Title
        </Sort>
        <Sort sortKey="NONE" onSort={onSort} activeSortKey={sortKey}>
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
  );
};
// Table.prototypes = {
//   list: PropTypes.arrayOf(
//     PropTypes.shape({
//       objectID: PropTypes.string.isRequired
//     })
//   ).isRequired,
//   searchTerm: PropTypes.string.isRequired,
//   RemoveItem: PropTypes.func.isRequired
// };
const Loading = () => <div>loading ...</div>;
const ButtonWithLoading = withLoading(Button);
const Sort = ({ sortKey, onSort, activeSortKey,children }) => {
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
export default App;
