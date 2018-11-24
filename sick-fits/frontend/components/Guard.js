import React from "react";
import { Query } from "react-apollo";
import { CURRENT_USER_QUERY } from "./User";
import Signin from "./Signin";

const Guard = ({ children }) => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!data.me) {
        return (
          <div>
            <p>Please Sign in before continuing</p>
            <Signin />
          </div>
        );
      }
      return children;
    }}
  </Query>
);

export default Guard;
