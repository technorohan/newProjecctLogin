import React from 'react';
import dayjs from 'dayjs';

const SiteFooter = () => {

  return (
    <>
      {/* outer-footerBottom */}
      <div className="mainDashboard-footer">
        <p>Copyright © {dayjs().format('YYYY')}, TECHNO EXPONENT, All Rights Reserved.</p>
      </div>
    </>
  );
};


export default SiteFooter;
