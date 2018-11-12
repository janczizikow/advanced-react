import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import Form from "./styles/Form";
import { CURRENT_USER_QUERY } from "./User";

export const SIGN_IN_MUTATION = gql`
  mutation signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
    }
  }
`;

class Signin extends Component {
  state = {
    email: "",
    password: ""
  };

  handleChange = e => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = async (e, signInMutation) => {
    e.preventDefault();

    const res = await signInMutation();
    this.setState({
      email: "",
      password: ""
    });
  };

  render() {
    const { password, email } = this.state;

    return (
      <Mutation
        mutation={SIGN_IN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { loading, error, data }) => (
          <Form method="POST" onSubmit={e => this.handleSubmit(e, signin)}>
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign in to your account</h2>
              <label htmlFor="email">
                Email
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.handleChange}
                />
              </label>
              <input type="submit" value="Sign in!" />
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signin;
