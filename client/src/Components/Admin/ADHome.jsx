import React, { useState } from 'react';
import { Button } from 'primereact/button';
import ADFormgAdd from "./ADFormgAdd";
import ADFormgChange from "./ADFormgChange";
import './ADHome.css'

const ADHome = () => {
    const [visibleAdd, setVisibleAdd] = useState(false); // סטייט לניהול חלון הוספת מנהל
    const [visibleChange, setVisibleChange] = useState(false); // סטייט לניהול חלון שינוי פרטים

    return (
        <>
            <Button 
                label="Manager Register" 
                icon="pi pi-user-plus" 
                severity="success" 
                className="w-10rem" 
                onClick={() => {
                    console.log("Opening Add Manager Dialog");
                    setVisibleAdd(true);
                }} 
            />

            <Button 
                label="Manager Update" 
                icon="pi pi-user-plus" 
                severity="success" 
                className="w-10rem" 
                onClick={() => setVisibleChange(true)} 
            />

            {visibleAdd && (
                <ADFormgAdd 
                    setVisibleAdd={setVisibleAdd} 
                    visibleAdd={visibleAdd} 
                />
            )}

            {visibleChange && (
                <ADFormgChange 
                    setVisibleChange={setVisibleChange} 
                    visibleChange={visibleChange} 
                />
            )}
        </>
    );
};

export default ADHome;