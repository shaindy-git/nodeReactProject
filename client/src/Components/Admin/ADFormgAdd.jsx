import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ADFormgAdd = (props) => {
    const accesstoken = useSelector((state) => state.token.token);
    const [showMessage, setShowMessage] = useState(false);
    const [managerData, setManagerData] = useState(null); // מאחסן את כל הנתונים
    
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
            area: '',
        }
    });

    const genders = ['male', 'female'];

    const onSubmit = async (data) => {
        debugger;
        const dateOfBirth = new Date(data.dateOfBirth);
    
        // Validation for date of birth
        if (new Date() - dateOfBirth < 0) {
            alert("Invalid date of birth");
            return;
        }
    
        const ageInMilliseconds = new Date() - dateOfBirth;
        const ageInYears = ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000);
    
        if (ageInYears < 40 || ageInYears > 60) {
            alert("The age is not appropriate, for a manager the required age is between 40-60 years.");
            return;
        }
    
        try {
            console.log(data);
    
            const res = await axios({
                method: 'post',
                url: 'http://localhost:7000/manager/addManager',
                headers: { Authorization: "Bearer " + accesstoken },
    
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    userName: data.userName,
                    numberID: data.numberID,
                    phone: data.phone,
                    email: data.email,
                    area: data.area,
                    gender: data.gender,
                    dateOfBirth: new Date(data.dateOfBirth).toISOString(),
                },
            });
    
            if (res.status === 200) {
                setManagerData(data); // שמירת כל הנתונים ב-state
                setShowMessage(true);
                reset();
            } else {
                alert("Unexpected response from the server.");
            }
        } catch (e) {
            const errorMessage =
                e.response && e.response.data && e.response.data.message
                    ? e.response.data.message
                    : "An error occurred, please try again.";
            alert(errorMessage);
            console.error(e);
        }
    };

    const dialogFooter = (
        <div className="flex justify-content-center">
            <Button label="OK" className="p-button-text" autoFocus onClick={() => {
                setShowMessage(false);
                props.setVisibleAdd(false);
            }} />
        </div>
    );

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '100vw' }}>
                <div className="justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    {managerData && (
                        <h5>
                            Manager <b>{managerData.firstName} {managerData.lastName}</b> has successfully registered and the password has been sent to his email.
                        </h5>
                    )}
                </div>
            </Dialog>

            <Dialog visible={props.visibleAdd} style={{ width: '28vw' }} onHide={() => props.setVisibleAdd(false)}>
                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">Add Manager</h5>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                            {/* First Name */}
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="firstName" control={control} rules={{ required: 'First name is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="firstName" className={classNames({ 'p-error': errors.firstName })}>First Name*</label>
                                </span>
                                {getFormErrorMessage('firstName')}
                            </div>

                            {/* Last Name */}
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="lastName" control={control} rules={{ required: 'Last name is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="lastName" className={classNames({ 'p-error': errors.lastName })}>Last Name*</label>
                                </span>
                                {getFormErrorMessage('lastName')}
                            </div>

                            {/* User Name */}
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="userName" control={control} rules={{ required: 'User name is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="userName" className={classNames({ 'p-error': errors.userName })}>User Name*</label>
                                </span>
                                {getFormErrorMessage('userName')}
                            </div>

                            {/* ID Number */}
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="numberID" control={control} rules={{ required: 'ID number is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="numberID" className={classNames({ 'p-error': errors.numberID })}>ID Number*</label>
                                </span>
                                {getFormErrorMessage('numberID')}
                            </div>

                            {/* Phone */}
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="phone" control={control} rules={{ required: 'Phone is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="phone" className={classNames({ 'p-error': errors.phone })}>Phone*</label>
                                </span>
                                {getFormErrorMessage('phone')}
                            </div>

                            {/* Email */}
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="email" control={control} rules={{
                                        required: 'Email is required.',
                                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address.' }
                                    }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="email" className={classNames({ 'p-error': errors.email })}>Email*</label>
                                </span>
                                {getFormErrorMessage('email')}
                            </div>

                            {/* Area */}
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="area" control={control} rules={{ required: 'Area is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="area" className={classNames({ 'p-error': errors.area })}>Area*</label>
                                </span>
                                {getFormErrorMessage('area')}
                            </div>

                            {/* Gender */}
                            <div className="field">
                                <Controller
                                    name="gender"
                                    control={control}
                                    rules={{ required: 'Gender is required.' }}
                                    render={({ field }) => (
                                        <Dropdown
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            options={genders}
                                            placeholder="Select a Gender"
                                        />
                                    )}
                                />
                                {getFormErrorMessage('gender')}
                            </div>

                            {/* Date of Birth */}
                            <div className="field">
                                <span className="p-float-label" dir='ltr'>
                                    <Controller
                                        name="dateOfBirth"
                                        control={control}
                                        rules={{ required: 'Date of Birth is required.' }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Calendar
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    dateFormat="yy-mm-dd"
                                                    mask="9999-99-99"
                                                    showIcon
                                                    className={classNames({ 'p-invalid': fieldState.invalid })}
                                                />
                                            </>
                                        )}
                                    />
                                    <label htmlFor="dateOfBirth" className={classNames({ 'p-error': !!errors.dateOfBirth })}>*Date of Birth</label>
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

//בסמינר
//מנהל 9 -E5OD|JCbK?S%
//מנהל 5-RandomPasswordj3P.bc7iJLWN
//מנהל 80 -RandomPassword3{c=xz3*ck{7