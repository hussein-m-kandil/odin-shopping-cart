import PropTypes from 'prop-types';
import { Outlet, Navigate, useOutletContext } from 'react-router-dom';

function Guard({ authPath }) {
  const { authenticated } = useOutletContext();

  return authenticated ? <Outlet /> : <Navigate to={authPath} replace={true} />;
}

Guard.propTypes = { authPath: PropTypes.string.isRequired };

export default Guard;
