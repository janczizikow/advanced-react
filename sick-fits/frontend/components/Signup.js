import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import Form from "./styles/Form";
export const CREATE_USER_MUTATION = gql`
  mutation createUser($email: String!, $name: String!, $password: String!) {
    createUser(email: $email, name: $name, password: $password) {
      id
    }
  }
`;

class Signup extends Component {
  state = {
    name: "",
    password: "",
    email: ""
  };

  handleChange = e => {
    const { name, type, value } = e.target;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = async (e, createUserMutation) => {
    e.preventDefault();
    const res = await createUserMutation();
    console.log(res);
    this.setState({
      name: "",
      password: "",
      email: ""
    });
  };

  render() {
    const { name, password, email } = this.state;

    return (
      <Mutation mutation={CREATE_USER_MUTATION} variables={this.state}>
        {(createUser, { loading, error, data }) => (
          <Form method="POST" onSubmit={e => this.handleSubmit(e, createUser)}>
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign up for an account</h2>
              <label htmlFor="email">
                Email
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="email">
                Name
                <input
                  name="name"
                  type="text"
                  value={name}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="email">
                Password
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.handleChange}
                />
              </label>
              <input type="submit" value="Sign up!" />
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signup;
