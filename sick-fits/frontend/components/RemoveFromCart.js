import React, { Component } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import styled from "react-emotion";
import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCartMutation($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const RemoveFromCartBtn = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${p => p.theme.red};
    cursor: pointer;
  }
`;

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  // Called as soon as we get a response from the server
  update = (cache, payload) => {
    // 1. read cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    const cartItemId = payload.data.removeFromCart.id;
    // 2. remove item from the cart
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
    // 3. write it back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };

  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id }}
        update={this.update}
        optimisticResponse={{
          __typename: "Mutation",
          removeFromCart: {
            __typename: "CartItem",
            id
          }
        }}
      >
        {(removeFromCart, { loading }) => (
          <RemoveFromCartBtn
            title="Remove from cart"
            disabled={loading}
            onClick={() => removeFromCart().catch(err => alert(err.message))}
          >
            &times;
          </RemoveFromCartBtn>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
