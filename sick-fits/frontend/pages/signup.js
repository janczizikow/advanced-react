import Signup from "../components/Signup";

const SignupPage = props => (
  <div
    css={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gridGap: 20
    }}
  >
    <Signup />
    <Signup />
    <Signup />
  </div>
);

export default SignupPage;
