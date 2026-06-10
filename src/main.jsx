import tableStyles from "./Components/Table/Table.module.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import localStyles from "./index.module.css";
import './i18n';

const styles = { ...tableStyles, ...(typeof localStyles !== "undefined" ? localStyles : {}) };

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);