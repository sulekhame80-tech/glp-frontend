
import React from 'react';
import ReactDOM from 'react-dom/client';

// Suppress deprecation warnings from legacy third-party libraries
const originalError = console.error;
const originalWarn = console.warn;
const suppressedWarnings = [
  "findDOMNode is deprecated",
  "ReactDOM.render is no longer supported",
  "unmountComponentAtNode is deprecated",
  "Support for defaultProps will be removed from function components",
  "Support for defaultProps will be removed from memo components"
];

const shouldSuppress = (args) => {
  if (typeof args[0] !== 'string') return false;
  return suppressedWarnings.some(warning => args[0].includes(warning));
};

console.error = (...args) => {
  if (shouldSuppress(args)) return;
  originalError(...args);
};
console.warn = (...args) => {
  if (shouldSuppress(args)) return;
  originalWarn(...args);
};

import App from './App';

import reportWebVitals from './reportWebVitals';// Css
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/animate.css/animate.css';
import '../node_modules/slick-carousel/slick/slick.css';
import '../node_modules/slick-carousel/slick/slick-theme.css';
import '../node_modules/cropperjs/dist/cropper.css';
import '../node_modules/toastr/build/toastr.min.css';
import '../node_modules/react-perfect-scrollbar/dist/css/styles.css';
import '../node_modules/react-data-table-component-extensions/dist/index.css';
import '../node_modules/@trendmicro/react-paginations/dist/react-paginations.css';
import '../node_modules/driver.js/dist/driver.min.css';
import '../node_modules/devextreme/dist/css/dx.common.css';
import '../node_modules/devextreme/dist/css/dx.light.css'; 
import './assets/vendors/iconic-fonts/flat-icons/flaticon.css';
import './assets/vendors/iconic-fonts/cryptocoins/cryptocoins.css';
import './assets/vendors/iconic-fonts/cryptocoins/cryptocoins-colors.css';
import './assets/vendors/iconic-fonts/font-awesome/css/all.min.css';
import './assets/css/style.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);

reportWebVitals();
