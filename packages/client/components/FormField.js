import React from 'react';
import cx from 'classnames';
import colors from '../lib/colors';

const FormField = ({ id, label, type, error, ...props }) => {
  return (
    <div className="wrapper">
      <input
        id={id}
        className={cx('input', { 'is-danger': !!error })}
        type={type}
        {...props}
      />
      {error && <div className="error">{error}</div>}

      <style jsx>{`
        div {
          display: inline-block;
        }
        .wrapper {
          width: 100%;
          margin: 6px 0;
        }
        .error {
          color: ${colors.error};
        }
      `}</style>
    </div>
  );
};

FormField.defaultProps = {
  type: 'text',
};

export default FormField;
