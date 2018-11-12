import Signup from "../components/Signup";
import Signin from "../components/Signin";

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
  </div>
);

export default SignupPage;
