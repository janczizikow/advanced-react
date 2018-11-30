import { shallow } from "enzyme";
import Page from "../components/Page";

describe("<Page />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Page />);
  });

  it("renders without crashing", () => {
    expect(wrapper).toHaveLength(1);
  });

  it("renders children", () => {
    wrapper.setProps({ children: "child" });
    expect(wrapper.find("child")).toBeTruthy();
  });
});
