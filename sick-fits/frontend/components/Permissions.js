import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import ErrorMessage from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";

const PERMISSIONS = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE"
];

const ALL_USERS_QUERY = gql`
  query allUsersQuery {
    users {
      id
      name
      email
      permission
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissionsMutation($permissions: [Permission], $userId: ID!) {
    updatePermissions(permission: $permissions, userId: $userId) {
      id
      name
      email
      permission
    }
  }
`;

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      permission: PropTypes.array
    }).isRequired
  };

  state = {
    permissions: this.props.user.permission
  };

  handlePermissionChange = e => {
    const checkbox = e.target;
    const { permissions } = this.state;
    let updatedPermissions = [...permissions];

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      );
    }

    this.setState({
      permissions: updatedPermissions
    });
  };

  render() {
    const { user } = this.props;
    const { permissions } = this.state;
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{ permissions: permissions, userId: user.id }}
      >
        {(updatePermissions, { loading, error }) => (
          <>
            {error && (
              <tr>
                <td colspan="9">
                  <ErrorMessage error={error} />
                </td>
              </tr>
            )}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {PERMISSIONS.map(permission => (
                <td key={`${user.id}-permission-${permission}`}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      id={`${user.id}-permission-${permission}`}
                      type="checkbox"
                      checked={permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton
                  type="button"
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Updat
                  {loading ? "ing" : "e"}
                </SickButton>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        <ErrorMessage error={error} />
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {PERMISSIONS.map(permission => (
                <th key={permission}>{permission}</th>
              ))}
              <th>👇</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map(user => (
              <UserPermissions key={user.id} user={user} />
            ))}
          </tbody>
        </Table>
      </div>
    )}
  </Query>
);

export default Permissions;
