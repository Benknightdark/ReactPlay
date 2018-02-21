import React, { Component } from "react";
import {  FormGroup } from "react-bootstrap";

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
  export default Search;