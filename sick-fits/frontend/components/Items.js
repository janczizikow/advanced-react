import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "react-emotion";
import Item from './Item';

export const ALL_ITEMS_QUERY = gql`
  query allItemsQuery {
    items {
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
    return (
      <div css={{ textAlign: "center" }}>
        <Query query={ALL_ITEMS_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            return (
              <ItemList>
              {data.items.map(item => (
                <Item key={item.id} item={item} />
              ))}
              </ItemList>
            )
          }}
        </Query>
      </div>
    );
  }
}

export default Items;
