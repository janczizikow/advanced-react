import ResetPassword from "../components/ResetPassword";

const ResetPasswordPage = ({ query }) => (
  <div>
    <ResetPassword resetToken={query.resetToken} />
  </div>
);

export default ResetPasswordPage;
