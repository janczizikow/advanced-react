import Signup from "../components/Signup";
import Signin from "../components/Signin";
import RequestReset from "../components/RequestReset";

const SignupPage = props => (
  <div
    css={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gridGap: 20
    }}
  >
    <Signup />
    <Signin />
    <RequestReset />
  </div>
);

export default SignupPage;
