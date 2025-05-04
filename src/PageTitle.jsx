import { APP_NAME } from './App';
import PropTypes from 'prop-types';

function PageTitle({ pageTitle }) {
  return <title>{`${pageTitle} - ${APP_NAME}`}</title>;
}

PageTitle.propTypes = { pageTitle: PropTypes.string.isRequired };

export default PageTitle;
