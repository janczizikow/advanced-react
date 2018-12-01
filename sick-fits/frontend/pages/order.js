import Order from "../components/Order";
import Guard from "../components/Guard";

const OrderPage = ({ query: { id } }) => (
  <Guard>
    <Order id={id} />
  </Guard>
);

export default OrderPage;
