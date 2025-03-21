
import React, { useEffect, useRef, useState } from "react";
import axios from 'axios'
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, logOut } from '../../redux/tokenSlice'
import FormRegT from "./FormRegT";
import FormRegS from "./FormRegS";





const Auth = () => {
    const [visible, setVisible] = useState(false);

    const [userName, setuserName] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();


    const login = async () => {



        try {
            const res = await axios({
                method: 'post',
                url: 'http://localhost:7000/auth/login',
                headers: {},
                data: {
                    userName: userName,
                    password: password// This is the body part
                }
            });
          

            if (res.status === 200) {

                dispatch(setToken(res.data.accessToken))

                alert("You Com In")
            }
        } catch (e) {
            console.error(e);
            alert("Unauthorized user")

        }
    }

    const [visibleS, setVisibleS] = useState(false);
    const [visibleT, setVisibleT] = useState(false);



    return (
        <div className="card">
            <div className="flex flex-column md:flex-row">
                {/* Login Section */}
                <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">User Name</label>
                        <InputText id="username" type="text" className="w-12rem" onChange={(e) => { setuserName(e.target.value); }} />
                    </div>
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Password</label>
                        <InputText id="password" type="password" className="w-12rem" onChange={(e) => { setPassword(e.target.value); }} />
                    </div>
                    <Button label="Login" icon="pi pi-user" className="w-10rem mx-auto" onClick={login}></Button>
                </div>

                {/* Divider Section */}
                <div className="w-full md:w-2">
                    <Divider layout="vertical" className="hidden md:flex" />
                    <Divider layout="horizontal" className="flex md:hidden" align="center" />
                </div>

                {/* Registration Section */}
                <div className="md:w-5 flex flex-column align-items-center gap-3 py-5 mt-5">
                    <Button label="Student Register" icon="pi pi-user-plus" severity="success" className="w-10rem" onClick={() => { setVisibleS(visibleS === false ? true : false); setVisibleT(false); }}></Button>
                    <Button label="Teacher Register" icon="pi pi-user-plus" severity="success" className="w-10rem" onClick={() => { setVisibleT(visibleT === false ? true : false); setVisibleS(false); }}></Button>
                    {visibleT && <FormRegT setVisibleT={setVisibleT} visibleT={visibleT} />}
                    {visibleS && <FormRegS setVisibleS={setVisibleS} visibleS={visibleS} />}
                </div>
            </div>

        </div>
    )
}

export default Auth

//קבלת הטוקן בכל מקום רצוי
// const accesstoken=useSelector((state)=>state.token.token)

//יציאת משתמש מסקנה: להפעיל רק ע"י כפתור ולא ע"י רפשרוש
// useEffect(()=>{
//     dispatch(logOut())

// },[])
