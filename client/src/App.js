import './App.css';
import Auth from './Components/Auth/Auth';
import Logout from './Components/Auth/Logout';
import TermsPage from './Components/Auth/TermsPage';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { Link, Route, Routes } from 'react-router-dom';
import './index.css';
import './flags.css';
import MHome from './Components/Manager/MHome';
import THome from './Components/Teacher/THome';
import SHome from './Components/Student/SHome';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import Logo from './Pictures/Ministry of Transportation.jpg';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import FormUpdate from './Components/Auth/FromUpdate'
import { setToken } from './redux/tokenSlice';
function App() {


  const [visibleU, setVisibleU] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accesstoken = useSelector((state) => state.token.token)

  const decoded = accesstoken ? jwtDecode(accesstoken) : null;

  const [text, setText] = useState("user");
  const [role, setRole] = useState("");
  // const text = decoded ? `${decoded.firstName} ${decoded.lastName}` : "user";

  useEffect(() => {
    if (accesstoken) {
      const decoded = jwtDecode(accesstoken);
      if (decoded.role === 'M') {
        setRole("director")
      } else if (decoded.role === 'T') {
        setRole("teacher")
      } else if (decoded.role === 'S') {
        setRole("student")
      }
      else if (decoded.role === 'A') {
        setRole("Admin")
        setText(role)
      }
      if (decoded.role != 'A')
        setText(`${role} ${decoded.firstName} ${decoded.lastName}`);
    } else {
      setText("user");
    }
  }, [accesstoken, decoded]);

  const items = [
    {
      label: <img src={Logo} alt="Logo" style={{ height: '60px', width: 'auto' }} />, // Image on the right
      command: () => { },
    },
    {
      label: 'Login',
      icon: 'pi pi-sign-in',
      command: () => {
        navigate('/Auth/Auth');
        dispatch(setToken(null));
      }
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        navigate('/Auth/Logout');
      },
    },
    {
      label: <p style={{ fontWeight: "bold" }}>Hello <b>{text}</b></p>,
      icon: 'pi pi-user',
      command: () => {
        if (decoded) {
          setVisibleU(true);
        }
      }

    }


  ];

  return (
    <div className="App">
      {<div className="card">
        <Menubar model={items} dir='ltr' />
      </div>}
      <Routes>
        <Route path="/Auth/Logout" element={<Logout />} />
        <Route path="/Auth/Auth" element={<Auth />} />
        <Route path="/Manager/MHome" element={<MHome />} />
        <Route path="/Teacher/THome" element={<THome />} />
        <Route path="/Student/SHome" element={<SHome />} />
        <Route path="/Auth/terms" element={<TermsPage />} />
      </Routes>


      {visibleU && accesstoken && (
        <FormUpdate visibleU={visibleU} setVisibleU={setVisibleU} />
      )}

    </div>


  );
}

export default App;

// import './App.css';
// import Auth from './Components/Auth/Auth';
// import Logout from './Components/Auth/Logout';
// import React from 'react';
// import { PrimeReactProvider } from 'primereact/api';
// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';
// import 'primereact/resources/primereact.css';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import { Route, Routes, useNavigate } from 'react-router-dom';
// import './index.css';
// import './flags.css';
// import MHome from './Components/Manager/MHome';
// import THome from './Components/Teacher/THome';
// import SHome from './Components/Student/SHome';
// import { Menubar } from 'primereact/menubar';
// import { useSelector } from 'react-redux';
// import { jwtDecode } from 'jwt-decode';
// import Logo from './Pictures/Ministry of Transportation.jpg';

// function App() {
//   const navigate = useNavigate();
//   const accesstoken = useSelector((state) => state.token.token);
//   const decoded = accesstoken ? jwtDecode(accesstoken) : null;
//   const text = decoded ? `${decoded.firstName} ${decoded.lastName}` : "user";

//   const items = [
//     {
//       label: <img src={Logo} alt="Logo" style={{ height: '60px', width: 'auto' }} />,
//       command: () => {},
//     },
//     {
//       label: 'Login',
//       icon: 'pi pi-sign-in',
//       command: () => {
//         navigate('/Auth/Auth');
//       },
//     },
//     {
//       label: 'Logout',
//       icon: 'pi pi-sign-out',
//       command: () => {
//         navigate('/Auth/Logout');
//       },
//     },
//     {
//       label: <p style={{ fontWeight: 'bold' }}>Hello <b>{text}</b></p>,
//       icon: 'pi pi-user',
//       command: () => {},
//     },
//   ];

//   return (
//     <div className="App">
//       <div className="card">
//         <Menubar model={items} dir="ltr" />
//       </div>
//       <Routes>
//         <Route path="/Auth/Logout" element={<Logout />} />
//         <Route path="/Auth/Auth" element={<Auth />} />
//         <Route path="/Manager/MHome" element={<MHome />} />
//         <Route path="/Teacher/THome" element={<THome />} />
//         <Route path="/Student/SHome" element={<SHome />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

