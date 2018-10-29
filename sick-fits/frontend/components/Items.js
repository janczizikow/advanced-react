import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "react-emotion";
import Item from "./Item";
import Pagination from "./Pagination";
import { perPage } from "../config";

export const ALL_ITEMS_QUERY = gql`
  query allItemsQuery($skip: Int = 0, $first: Int = ${perPage}) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`;

const ItemList = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
`;

class Items extends Component {
  render() {
    const { page } = this.props;
    return (
      <div css={{ textAlign: "center" }}>
        <Pagination page={page} />
        <Query
          query={ALL_ITEMS_QUERY}
          variables={{
            skip: page * perPage - perPage,
            first: perPage
          }}
        >
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            return (
              <ItemList>
                {data.items.map(item => (
                  <Item key={item.id} item={item} />
                ))}
              </ItemList>
            );
          }}
        </Query>
        <Pagination page={page} />
      </div>
    );
  }
}

export default Items;
