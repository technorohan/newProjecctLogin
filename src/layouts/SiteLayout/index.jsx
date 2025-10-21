import React from 'react';
import PropTypes from 'prop-types';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

const SiteLayout = ({ children }) => {
  return (
    <>
      {/* <SiteHeader /> */}
      
        <SiteHeader />
        {children}
        <SiteFooter /> 
    </>
  );
};

SiteLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SiteLayout;
