import Guard from "../components/Guard";
import Permissions from "../components/Permissions";

const PermissionsPage = () => (
  <Guard>
    <Permissions />
  </Guard>
);

export default PermissionsPage;
