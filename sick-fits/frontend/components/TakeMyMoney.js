import React from "react";
import StripeCheckout from "react-stripe-checkout";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import NProgress from "nprogress";
import calcTotalPrice from "../lib/calcTotalPrice";
import ErrorMessage from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

const totalItems = cart => {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
};

class TakeMyMoney extends React.Component {
  onToken = res => {
    // grab res.id
    console.log(res.id);
  };

  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <StripeCheckout
            name="Sick Fits"
            description={`Order of ${totalItems(me.cart)} items!`}
            image={me.cart[0].item && me.cart[0].item.image}
            amount={calcTotalPrice(me.cart)}
            currency="USD"
            email={me.email}
            token={res => this.onToken(res)}
            stripeKey="pk_test_zuGoQpJ45XJ2FJlDydr2wYyU"
          >
            {this.props.children}
          </StripeCheckout>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
