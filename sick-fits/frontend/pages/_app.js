import App, { Container } from 'next/app';
import { ThemeProvider } from 'emotion-theming';
import Page from '../components/Page';
import { theme } from '../utils/theme';

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
