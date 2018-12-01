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

const CREATE_ORDER_MUTATION = gql`
  mutation createOrderMutation($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

const totalItems = cart => {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
};

class TakeMyMoney extends React.Component {
  onCheckout = (res, createOrder) => {
    NProgress.start();

    createOrder({ variables: { token: res.id } }).catch(err =>
      alert(err.message)
    );

    Router.push({
      pathname: "/order",
      query: { id: order.data.createOrder.id }
    });
  };

  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {createOrder => (
              <StripeCheckout
                name="Sick Fits"
                description={`Order of ${totalItems(me.cart)} items!`}
                image={
                  me.cart.length && me.cart[0].item && me.cart[0].item.image
                }
                amount={calcTotalPrice(me.cart)}
                currency="USD"
                email={me.email}
                token={res => this.onCheckout(res, createOrder)}
                stripeKey="pk_test_zuGoQpJ45XJ2FJlDydr2wYyU"
              >
                {this.props.children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
