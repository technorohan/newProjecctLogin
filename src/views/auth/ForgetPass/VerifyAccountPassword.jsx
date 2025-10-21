import React from 'react';
import { Helmet } from 'react-helmet';

export default function VerifyAccountPassword() {

  return (
    <>
      <Helmet>
        <title>Verify OTP</title>
      </Helmet>
      <>
        {/* <SiteHeader /> */}

        <section className="authBody accountVerification">
        Verify OTP
        </section>
      </>
    </>
  );
}
