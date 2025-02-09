import PropTypes from 'prop-types';
import { Outlet, Navigate, useOutletContext } from 'react-router-dom';

function Guard({ authPath }) {
  const { authenticated, ...contextEntries } = useOutletContext();

  return authenticated ? (
    <Outlet context={{ authenticated, ...contextEntries }} />
  ) : (
    <Navigate to={authPath} replace={true} />
  );
}

Guard.propTypes = { authPath: PropTypes.string.isRequired };

export default Guard;
