import Link from 'next/link';
import styled from 'react-emotion'
import Nav from '../components/Nav';

const Logo = styled.h1`
  margin-left: 2rem;
  position: relative;
  font-size: 4rem;
  transform: skew(-7deg);
  z-index: 2;

  a {
    padding: 0.5rem 1rem;
    background: ${props => props.theme.red};
    color: white;
    text-transform: uppercase;
    text-decoration: none;
  }

  @media (max-width: 1300px) {
    margin: 0;
    text-align: center;
  }
`;

const StyledHeader = styled.header`
  .bar {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: stretch;
    justify-content: space-between;
    border-bottom: 10px solid ${props => props.theme.black};

    @media (max-width: 1300px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }
  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
  }
`;

const Header = () => (
  <StyledHeader>
    <div className="bar">
      <Logo>
        <Link href="/">
          <a>Sick Fits</a>
        </Link>
      </Logo>
      <Nav />
    </div>
    <div className="sub-bar">
      <p>Search</p>
    </div>
    <div>Cart</div>
  </StyledHeader>
);

export default Header;
