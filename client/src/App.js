import './App.css';
import Auth from './Components/Auth/Auth';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

import './index.css';
import './flags.css';


function App() {
  return (
    <div className="App">
      <Auth/>
    </div>
  );
}
export default App;
