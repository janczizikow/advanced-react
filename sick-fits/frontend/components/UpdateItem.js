import React, { Component } from "react";
import Router from "next/router";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import ErrorMessage from "./ErrorMessage";
import format from "../lib/formatMoney";

export const SINGLE_ITEM_QUERY = gql`
  query singleItemQuery($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;
export const UPDATE_ITEM_MUTATION = gql`
  mutation updateItem(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
    }
  }
`;

class UpdateItem extends Component {
  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;

    this.setState({
      [name]: val
    });
  };

  handleSubmit = async (e, updateItemMutation) => {
    e.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
    Router.push({
      pathname: "/item",
      query: { id: res.data.updateItem.id }
    });
  };

  render() {
    const { id } = this.props;

    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ loading, data, error }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>Item Not found for ID {id}</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.handleSubmit(e, updateItem)}>
                  <ErrorMessage error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        name="description"
                        placeholder="Description"
                        required
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        required
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">Save Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
