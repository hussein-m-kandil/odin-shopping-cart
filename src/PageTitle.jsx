import PropTypes from 'prop-types';

function PageTitle({ pageTitle }) {
  return <title>{`${pageTitle} - ${import.meta.env.VITE_APP_NAME}`}</title>;
}

PageTitle.propTypes = { pageTitle: PropTypes.string.isRequired };

export default PageTitle;
