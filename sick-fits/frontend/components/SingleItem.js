import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Head from "next/head";
import styled from "react-emotion";
import ErrorMessage from "./ErrorMessage";

export const SINGLE_ITEM_QUERY = gql`
  query singleItemQuery($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

const SingleItemStyles = styled.div`
  margin: 2rem auto;
  max-width: ${p => p.theme.maxWidth};
  min-height: 800px;
  box-shadow: ${p => p.theme.shadow};

  @media only screen and (min-width: 992px) {
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
  }
`;

const SingleItem = ({ id }) => {
  return (
    <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
      {({ data: { item }, error, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <ErrorMessage error={error} />;
        if (!item) return <p>No Item Found for {id}</p>;
        return (
          <SingleItemStyles>
            <Head>
              <title>Sick Fits - {item.title}</title>
              <meta name="description" content={item.description} />
            </Head>
            <img
              src={item.largeImage}
              alt={item.title}
              css={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
            <div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </SingleItemStyles>
        );
      }}
    </Query>
  );
};

export default SingleItem;
