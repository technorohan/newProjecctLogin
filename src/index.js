import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </>
  </React.StrictMode>,
)
//  start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
