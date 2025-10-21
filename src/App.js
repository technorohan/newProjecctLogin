import React from 'react';
import { Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/JWTAuthContext';
import { GlobalStoreProvider } from './contexts/GlobalStoreContext';
import routes, { renderRoutes } from './routes';
import "bootstrap/dist/css/bootstrap.min.css";
import './scss/main.scss';

import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const App = () => {
  return (
    <Provider store={store}>
    <AuthProvider>
      <GlobalStoreProvider>
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            // Define default options
            className: 'hot-toast-opening-class',
            duration: 3000,
            // style: {
            //   background: '#363636',
            //   color: '#fff',
            // },
            // Default options for specific types
            success: {
              duration: 3000,
              // theme: {
              //   primary: 'green',
              //   secondary: 'black',
              // },
            },
          }}
        />
        <>
          {renderRoutes(routes)}
        </>
      </GlobalStoreProvider>
    </AuthProvider>
    </Provider>
  );
};

export default App;
