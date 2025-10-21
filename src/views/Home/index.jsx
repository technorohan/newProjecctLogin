import React from 'react';
import { Helmet } from 'react-helmet';
import SiteHeader from '../../components/SiteHeader'

export default function Home() {

  return (

    <div>
      <Helmet>
        <title> Home</title>
      </Helmet>

      <SiteHeader />
      Home

    </div>


  );
}
