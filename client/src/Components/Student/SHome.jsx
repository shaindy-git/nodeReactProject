import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import './SHome.css';
const SHome = () => {

    return (
        
        <div className="card flex justify-content-start">
        <Button 
            label="Tetcher Selction" 
            link 
            className="no-underline p-button-left"
            onClick={() => window.open("./SSelectionTeatcher", "_blank")} 
            aria-label="Open Auth Terms"
        />
    </div>



        
    )

}
export default SHome