import { PropsWithChildren } from 'react';
import Header from './Header';

const layoutStyle = {
  marginLeft: 20,
  marginRight: 20,
  paddingLeft: 20,
  paddingRight: 20,
};

const Layout = (props: PropsWithChildren) => (
  <div style={layoutStyle}>
    <Header />
    {props && props.children}
  </div>
);

export default Layout;