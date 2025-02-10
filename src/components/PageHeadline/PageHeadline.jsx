import PropTypes from 'prop-types';

function PageHeadline({ children, className, TagName = 'h2', ...props }) {
  return (
    <TagName
      className={className || 'font-bold text-xl text-center my-4'}
      {...props}
    >
      {children}
    </TagName>
  );
}

PageHeadline.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  TagName: PropTypes.string,
};

export default PageHeadline;
