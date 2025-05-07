
// import React, { useState } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import { Calendar } from 'primereact/calendar';
// import { Dialog } from 'primereact/dialog';
// import { classNames } from 'primereact/utils';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const ADFormgAdd = (props) => {
//     const accesstoken = useSelector((state) => state.token.token);
//     const decoded = accesstoken ? jwtDecode(accesstoken) : null;

//     const [showMessage, setShowMessage] = useState(false);
//     const [addedManager, setAddedManager] = useState(null);

//     const { control, formState: { errors }, handleSubmit, reset } = useForm({
//         defaultValues: {
//             firstName: '',
//             lastName: '',
//             gender: '',
//             dateOfBirth: null,
//             userName: '',
//             numberID: '',
//             phone: '',
//             email: '',
//             area: ''
//         }
//     });

//     const onSubmit = async (data) => {
//         if ((new Date() - new Date(data.dateOfBirth)) < 0) {
//             alert("Invalid date of birth");
//             return;
//         }

//         if ((new Date() - new Date(data.dateOfBirth)) > 70 * 31536000000 || (new Date() - new Date(data.dateOfBirth)) < 50 * 31536000000) {
//             alert("The age is not appropriate, for a manager the required age is between 50-70");
//             return;
//         }

//         try {
//             const res = await axios.post(
//                 'http://localhost:7000/manager/addManager',
//                 { ...data, dateOfBirth: new Date(data.dateOfBirth) },
//                 { headers: { Authorization: "Bearer " + accesstoken } }
//             );

//             if (res.status === 200 && res.data.managers) {
//                 props.setManagers(res.data.managers || []);
//                 props.setChange(res.data);
//                 setAddedManager(data);
//                 setShowMessage(true);
//             } else {
//                 alert("Unexpected response from the server.");
//             }
//         } catch (e) {
//             const errorMessage = e?.response?.data?.message || "An error occurred, please try again.";
//             alert(errorMessage);
//             console.error(e);
//         }
//     };

//     const dialogFooter = (
//         <div className="flex justify-content-center">
//             <Button
//                 label="OK"
//                 className="p-button-text"
//                 autoFocus
//                 onClick={() => {
//                     setShowMessage(false);
//                     props.setVisibleAdd(false);
//                 }}
//             />
//         </div>
//     );

//     const getFormErrorMessage = (name) => errors[name] && <small className="p-error">{errors[name].message}</small>;

//     return (
//         <div className="form-demo">
//             {/* דיאלוג הצלחה - בעיצוב זהה להחלפה */}
//             <Dialog
//                 visible={showMessage}
//                 onHide={() => setShowMessage(false)}
//                 footer={dialogFooter}
//                 style={{ width: '30vw' }}
//                 breakpoints={{ '960px': '75vw', '640px': '100vw' }}
//                 closable={false}
//                 modal
//             >
//                 <div className="flex flex-column align-items-center text-center p-3">
//                     <i className="pi pi-check-circle text-green-500" style={{ fontSize: '3rem' }}></i>
//                     <h4 className="mt-3">Manager successfully added</h4>
//                     {addedManager && (
//                         <p>
//                             Manager <b>{addedManager.firstName} {addedManager.lastName}</b> has been successfully added.<br />
//                             Password has been sent to email <b>{addedManager.email}</b>.
//                         </p>
//                     )}
//                 </div>
//             </Dialog>

//             {/* דיאלוג טופס ההוספה */}
//             <Dialog visible={props.visibleAdd} style={{ width: '28vw' }} onHide={() => props.setVisibleAdd(false)}>
//                 <div className="flex justify-content-center">
//                     <div className="card">
//                         <h5 className="text-center">Add New Manager</h5>
//                         <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
//                             {['firstName', 'lastName', 'userName', 'numberID', 'phone', 'email'].map(fieldName => (
//                                 <div className="field" key={fieldName}>
//                                     <span className="p-float-label">
//                                         <Controller
//                                             name={fieldName}
//                                             control={control}
//                                             rules={fieldName === 'email' ? {
//                                                 required: 'Email is required.',
//                                                 pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' }
//                                             } : { required: `${fieldName} is required.` }}
//                                             render={({ field, fieldState }) => (
//                                                 <InputText
//                                                     id={field.name}
//                                                     {...field}
//                                                     className={classNames({ 'p-invalid': fieldState.invalid })}
//                                                 />
//                                             )}
//                                         />
//                                         <label htmlFor={fieldName} className={classNames({ 'p-error': errors[fieldName] })}>{fieldName}*</label>
//                                     </span>
//                                     {getFormErrorMessage(fieldName)}
//                                 </div>
//                             ))}

//                             <div className="field">
//                                 <span className="p-float-label">
//                                     <Controller
//                                         name="area"
//                                         control={control}
//                                         rules={{ required: 'Area is required.' }}
//                                         render={({ field }) => (
//                                             <InputText id={field.name} {...field} readOnly />
//                                         )}
//                                     />
//                                     <label htmlFor="area">Area*</label>
//                                 </span>
//                             </div>

//                             <div className="field">
//                                 <span className="p-float-label" dir='ltr'>
//                                     <Controller
//                                         name="dateOfBirth"
//                                         control={control}
//                                         rules={{ required: 'Date of birth is required.' }}
//                                         render={({ field, fieldState }) => (
//                                             <Calendar
//                                                 id={field.name}
//                                                 value={field.value}
//                                                 onChange={(e) => field.onChange(e.value)}
//                                                 dateFormat="yy-mm-dd"
//                                                 mask="9999-99-99"
//                                                 showIcon
//                                                 className={classNames({ 'p-invalid': fieldState.invalid })}
//                                             />
//                                         )}
//                                     />
//                                     <label htmlFor="dateOfBirth" className={classNames({ 'p-error': !!errors.dateOfBirth })}>Date of Birth*</label>
//                                 </span>
//                                 {getFormErrorMessage('dateOfBirth')}
//                             </div>

//                             <Button type="submit" label="Submit" className="mt-2" />
//                         </form>
//                     </div>
//                 </div>
//             </Dialog>
//         </div>
//     );
// };

// export default ADFormgAdd;

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ADFormgAdd = (props) => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;

    const [showMessage, setShowMessage] = useState(false);
    const [addedManager, setAddedManager] = useState(null);

    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            gender: '',
            dateOfBirth: null,
            userName: '',
            numberID: '',
            phone: '',
            email: '',
            area: ''  // שדה area יישאר פתוח לכתיבה
        }
    });

    const onSubmit = async (data) => {
        if ((new Date() - new Date(data.dateOfBirth)) < 0) {
            alert("Invalid date of birth");
            return;
        }

        if ((new Date() - new Date(data.dateOfBirth)) > 70 * 31536000000 || (new Date() - new Date(data.dateOfBirth)) < 50 * 31536000000) {
            alert("The age is not appropriate, for a manager the required age is between 50-70");
            return;
        }

        try {
            const res = await axios.post(
                'http://localhost:7000/manager/addManager',
                { ...data, dateOfBirth: new Date(data.dateOfBirth) },
                { headers: { Authorization: "Bearer " + accesstoken } }
            );

            if (res.status === 200 && res.data.managers) {
                console.log(res.data.managers);
                console.log(res.status);
                
                
                debugger
                props.setManagers(res.data.managers || []);
                props.setChange(res.status);
                setAddedManager(data);
                setShowMessage(true);
            } else {
                alert("Unexpected response from the server.");
            }
        } catch (e) {
            const errorMessage = e?.response?.data?.message || "An error occurred, please try again.";
            alert(errorMessage);
            console.error(e);
        }
    };

    const dialogFooter = (
        <div className="flex justify-content-center">
            <Button
                label="OK"
                className="p-button-text"
                autoFocus
                onClick={() => {
                    setShowMessage(false);
                    props.setVisibleAdd(false);
                }}
            />
        </div>
    );

    const getFormErrorMessage = (name) => errors[name] && <small className="p-error">{errors[name].message}</small>;

    return (
        <div className="form-demo">
            {/* דיאלוג הצלחה - בעיצוב זהה להחלפה */}
            <Dialog
                visible={showMessage}
                onHide={() => setShowMessage(false)}
                footer={dialogFooter}
                style={{ width: '30vw' }}
                breakpoints={{ '960px': '75vw', '640px': '100vw' }}
                closable={false}
                modal
            >
                <div className="flex flex-column align-items-center text-center p-3">
                    <i className="pi pi-check-circle text-green-500" style={{ fontSize: '3rem' }}></i>
                    <h4 className="mt-3">Manager successfully added</h4>
                    {addedManager && (
                        <p>
                            Manager <b>{addedManager.firstName} {addedManager.lastName}</b> has been successfully added.<br />
                            Password has been sent to email <b>{addedManager.email}</b>.
                        </p>
                    )}
                </div>
            </Dialog>

            {/* דיאלוג טופס ההוספה */}
            <Dialog visible={props.visibleAdd} style={{ width: '28vw' }} onHide={() => props.setVisibleAdd(false)}>
                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">Add New Manager</h5>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                            {['firstName', 'lastName', 'userName', 'numberID', 'phone', 'email'].map(fieldName => (
                                <div className="field" key={fieldName}>
                                    <span className="p-float-label">
                                        <Controller
                                            name={fieldName}
                                            control={control}
                                            // rules={fieldName === 'email' ? {
                                            //     required: 'Email is required.',
                                            //     pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' }
                                            // } : fieldName === 'phone' ? {
                                            //     required: 'Phone number is required.',
                                            //     pattern: { value: /^[0-9]{10}$/, message: 'Phone number must be 10 digits.' }
                                            // } : fieldName === 'numberID' ? {
                                            //     required: 'ID number is required.',
                                            //     pattern: { value: /^[0-9]{9}$/, message: 'ID number must be 9 digits.' }
                                            // } : { required: `${fieldName} is required.` }}

                                            rules={fieldName === 'email' ? {
                                                required: 'Email is required.',
                                                pattern: { value: /^[A-Z0-9._%+-]+@(mby\.co\.il|gmail\.com)$/i,
                                                    message: 'Only emails ending with @mby.co.il or @gmail.com are allowed.'
                                                     }
                                            } : fieldName === 'phone' ? {
                                                required: 'Phone number is required.',
                                                pattern: { value: /^[0-9]{10}$/, message: 'Phone number must be 10 digits.' }
                                            } : fieldName === 'numberID' ? {
                                                required: 'ID number is required.',
                                                pattern: { value: /^[0-9]{9}$/, message: 'ID number must be 9 digits.' }
                                            } : { required: `${fieldName} is required.` }}
                                            
                                            render={({ field, fieldState }) => (
                                                <InputText
                                                    id={field.name}
                                                    {...field}
                                                    className={classNames({ 'p-invalid': fieldState.invalid })}
                                                />
                                            )}
                                        />
                                        <label htmlFor={fieldName} className={classNames({ 'p-error': errors[fieldName] })}>{fieldName}*</label>
                                    </span>
                                    {getFormErrorMessage(fieldName)}
                                </div>
                            ))}

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller
                                        name="area"
                                        control={control}
                                        rules={{ required: 'Area is required.' }}
                                        render={({ field }) => (
                                            <InputText
                                                id={field.name}
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value)} // מאפשר שינוי בשדה area
                                            />
                                        )}
                                    />
                                    <label htmlFor="area">Area*</label>
                                </span>
                                {getFormErrorMessage('area')}
                            </div>

                            <div className="field">
                                <span className="p-float-label" dir='ltr'>
                                    <Controller
                                        name="dateOfBirth"
                                        control={control}
                                        rules={{ required: 'Date of birth is required.' }}
                                        render={({ field, fieldState }) => (
                                            <Calendar
                                                id={field.name}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                dateFormat="yy-mm-dd"
                                                mask="9999-99-99"
                                                showIcon
                                                className={classNames({ 'p-invalid': fieldState.invalid })}
                                            />
                                        )}
                                    />
                                    <label htmlFor="dateOfBirth" className={classNames({ 'p-error': !!errors.dateOfBirth })}>Date of Birth*</label>
                                </span>
                                {getFormErrorMessage('dateOfBirth')}
                            </div>

                            <Button type="submit" label="Submit" className="mt-2" />
                        </form>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ADFormgAdd;



// // //בסמינר
// // //מנהל 9 -E5OD|JCbK?S%
// // //מנהל 5-RandomPasswordj3P.bc7iJLWN
// // //מנהל 80 -RandomPassword3{c=xz3*ck{7