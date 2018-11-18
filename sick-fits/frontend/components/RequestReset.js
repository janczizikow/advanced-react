import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import Form from "./styles/Form";

export const REQUEST_REST_MUTATION = gql`
  mutation requestResetMutation($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {
  state = {
    email: ""
  };

  handleChange = e => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = async (e, requestResetMutation) => {
    e.preventDefault();

    const res = await requestResetMutation();
    this.setState({
      email: ""
    });
  };

  render() {
    const { email } = this.state;

    return (
      <Mutation mutation={REQUEST_REST_MUTATION} variables={this.state}>
        {(requestReset, { loading, error, data, called }) => (
          <Form
            method="POST"
            onSubmit={e => this.handleSubmit(e, requestReset)}
          >
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Forgot Password</h2>
              {!error &&
                !loading &&
                called && <p>Password instructions sent to your email</p>}
              <label htmlFor="email">
                Email
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={this.handleChange}
                />
              </label>
              <input type="submit" value="Send instructions" />
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default RequestReset;
