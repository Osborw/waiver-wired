import Link from 'next/link';

const linkStyle = {
  marginRight: 15
};

const Header = () => (
  <div style={{marginBottom: '16px'}}>
    <Link href="/" style={linkStyle}>
      Home
    </Link>
    <Link href="/rosters" style={linkStyle}>
      Rosters 
    </Link>
    <Link href="/trades" style={linkStyle}>
      Trades 
    </Link>
    <Link href="/about" style={linkStyle}>
      About
    </Link>
  </div>
);

export default Header;