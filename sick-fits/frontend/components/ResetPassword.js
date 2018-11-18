import React, { Component } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import ErrorMessage from "./ErrorMessage";
import Form from "./styles/Form";
import { CURRENT_USER_QUERY } from "./User";

export const REST_PASSWORD_MUTATION = gql`
  mutation resetPasswordMutation(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

class ResetPassword extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  };

  componentDidMount() {
    console.log(this.props.resetToken);
  }

  state = {
    password: "",
    confirmPassword: ""
  };

  handleChange = e => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = async (e, resetPasswordMutation) => {
    e.preventDefault();

    const res = await resetPasswordMutation();
    this.setState({
      password: "",
      confirmPassword: ""
    });
    Router.push({
      pathname: "/"
    });
  };

  render() {
    const { password, confirmPassword } = this.state;
    const { resetToken } = this.props;

    return (
      <Mutation
        mutation={REST_PASSWORD_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        variables={{
          resetToken: this.props.resetToken,
          password,
          confirmPassword
        }}
      >
        {(resetPassword, { loading, error, data, called }) => (
          <Form
            method="POST"
            onSubmit={e => this.handleSubmit(e, resetPassword)}
          >
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Password</h2>
              <label htmlFor="password">
                New Password
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm Password
                <input
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={this.handleChange}
                />
              </label>
              <input type="submit" value="Rest password" />
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default ResetPassword;
