import App, { Container } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ApolloProvider } from 'react-apollo';
import { injectGlobal } from 'emotion';
import { ThemeProvider } from 'emotion-theming';
import withData from '../lib/withData';
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
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    // expose the query to the user
    pageProps.query = ctx.query;
    return { pageProps };
  }

  render() {
    const { Component, apollo, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <ThemeProvider theme={theme}>
            <Page>
              <Component {...pageProps} />
            </Page>
          </ThemeProvider>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withData(Root);
