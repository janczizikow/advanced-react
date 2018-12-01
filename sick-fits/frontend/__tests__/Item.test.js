import { shallow } from "enzyme";
import Item from "../components/Item";

const fakeItem = {
  id: "ABC123",
  title: "A cool item",
  description: "A really cool item!",
  price: 5000,
  image: "cool-item.jpg",
  largeItem: "large-cool-item.jpg"
};

describe("<Item />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Item item={fakeItem} />);
  });

  it("renders without crashing", () => {
    expect(wrapper).toHaveLength(1);
  });

  it("renders the correct price", () => {
    expect(
      wrapper
        .find("PriceTag")
        .children()
        .text()
    ).toBe("$50");
  });
});
