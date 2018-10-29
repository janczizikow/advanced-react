import React, { Component } from "react";
import styled from "react-emotion";
import Meta from "../components/Meta";
import Header from "../components/Header";

const Site = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const SiteContent = styled.div`
  flex: 1;
`;

const Main = styled.main`
  margin: 0 auto;
  padding: 2rem;
  max-width: ${p => p.theme.maxWidth};
`;

class Page extends Component {
  render() {
    return (
      <Site>
        <Meta />
        <SiteContent>
          <Header />
          <Main>{this.props.children}</Main>
        </SiteContent>
      </Site>
    );
  }
}

export default Page;
