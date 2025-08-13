import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav style={{ padding: '10px', background: '#282c34' }}>
      <Link to="/" style={{ margin: '10px', color: 'white' }}>Interactive</Link>
      <Link to="/text" style={{ margin: '10px', color: 'white' }}>Text Compiler</Link>
      <Link to="/batch" style={{ margin: '10px', color: 'white' }}>Batch Compiler</Link>
    </nav>
  );
};

export default Header;
