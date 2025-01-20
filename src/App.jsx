import Navbar from './components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar authenticated={true} />
      <Outlet />
    </>
  );
}

export default App;
