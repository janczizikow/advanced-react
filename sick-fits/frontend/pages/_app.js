import App, { Container } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { injectGlobal } from 'emotion';
import { ThemeProvider } from 'emotion-theming';
import Page from '../components/Page';
import { theme } from '../utils/theme';

Router.onRouteChangeStart = () => {
  NProgress.start();
}

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

injectGlobal`
  @font-face {
    font-family: 'radnicka-next';
    src:
      url('/staticic/radnikanext-medium-webfont.woff2')
      format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  *::before,
  *::after,
  * {
    box-sizing: inherit;
  }

  html {
    box-sizing: border-box;
    font-size: 10px;
  }

  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    font-family: 'radnika-next', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    line-height: 2;
  }

  a {
    text-decoration: none;
    color: ${theme.black};
  }
`;

class Root extends App {
  render() {
    const { Component } = this.props;

    return (
      <Container>
        <ThemeProvider theme={theme}>
          <Page>
            <Component />
          </Page>
        </ThemeProvider>
      </Container>
    )
  }
}

export default Root;
