

import * as React from 'react';
import Head from 'next/head';
import App, { AppContext, AppProps } from 'next/app';
import '../src/appStyles.css';




interface MyAppProps extends AppProps {
}

export default function MyApp(props: MyAppProps) {
  const { Component, ...pageProps } = props;



  return (<>
    <Head>
      <title>My page</title>
      {/*    <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon.src} />
          <link rel="icon" type="image/png" sizes="32x32" href={favicon32.src} />
           <link rel="icon" type="image/png" sizes="16x16" href={favicon16.src} /> */}
    </Head>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <Component {...pageProps} />
  </>)
}

// We purposefully call getInitialProps to disable Next.js automatic static optimization
// This forces the custom Document in ./_document.tsx to be serverside rendered on every load
// which is needed for the runtime config to initialize
MyApp.getInitialProps = async (appContext: AppContext) => {
  return App.getInitialProps(appContext);
};
