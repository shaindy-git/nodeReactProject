import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import './FromReg.css';


import './FromReg.css';

const FormRegT = (props) => {

    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const [defaultValues, setDefaultValues] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        numberID: '',
        phone: '',
        email: '',
        area: '',
        gender: '',
        password: '',
        dateOfBirth: null,
        accept: false
    })

    const RegisterT = async () => {


    }





    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        debugger
        if ((new Date() - new Date(defaultValues.dateOfBirth)) > 60 * 31536000000 || (new Date() - new Date(defaultValues.dateOfBirth)) < 40 * 31536000000) {//מציג את 1/1000 השניה בשנה
            alert("The age is not appropriate, for a teacher the required age is between 40-60")
            return
        }


        try {
            console.log(defaultValues);

            const res = await axios({
                method: 'post',
                url: 'http://localhost:7000/auth/registerT',
                headers: {},

                data: {
                    firstName: defaultValues.firstName,
                    lastName: defaultValues.lastName,
                    userName: defaultValues.userName,
                    numberID: defaultValues.numberID,
                    phone: defaultValues.phone,
                    email: defaultValues.email,
                    area: defaultValues.area,
                    gender: defaultValues.gender,
                    password: defaultValues.password,
                    dateOfBirth: defaultValues.dateOfBirth.toISOString()
                }
            });

            if (res.status === 200) {
                setFormData(data);
                setShowMessage(true);

                reset();
                alert("You have successfully registered")
            }
            else {

            }
        } catch (e) {


            const errorMessage = e.response && e.response.data && e.response.data.message
                ? e.response.data.message
                : "An error occurred, please try again.";
            alert(errorMessage);

            console.log("here");
            console.error(e);
            return e.status;


        }

    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
    const passwordHeader = <h6>Pick a password</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    return (
        <div className="form-demo">

            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '100vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Registration Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        The details have been saved in the system. You will receive a response to your phone  call  <b>{formData.phone}</b> within ten business days.
                    </p>
                </div>
            </Dialog>

            <Dialog visible={props.visibleT} style={{ width: '28vw' }} onHide={() => { if (!props.visibleT) return; props.setVisibleT(false); }}>

                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">Teacher Register</h5>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">


                            <div className="field">
                                <span className="p-float-label" >
                                    <Controller name="firstname" control={control} rules={{ required: 'firstname is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onChange={(e) => (field.onChange(e.target.value), setDefaultValues(prevValues => ({ ...prevValues, firstName: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="firstname" className={classNames({ 'p-error': errors.name })}>firstname*</label>
                                </span>
                                {getFormErrorMessage('firstname')}
                            </div>

                            <div className="field">
                                <span className="p-float-label" >
                                    <Controller name="lastname" control={control} rules={{ required: 'lastname is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onChange={(e) => (field.onChange(e.target.value), setDefaultValues(prevValues => ({ ...prevValues, lastName: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="lastname" className={classNames({ 'p-error': errors.name })}>lastname*</label>
                                </span>
                                {getFormErrorMessage('lastname')}
                            </div>

                            <div className="field">
                                <span className="p-float-label" >
                                    <Controller name="username" control={control} rules={{ required: 'username is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onChange={(e) => (field.onChange(e.target.value), setDefaultValues(prevValues => ({ ...prevValues, userName: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="username" className={classNames({ 'p-error': errors.name })}>username*</label>
                                </span>
                                {getFormErrorMessage('username')}
                            </div>

                            <div className="field">
                                <span className="p-float-label" >
                                    <Controller name="numberID" control={control} rules={{ required: 'numberID is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onChange={(e) => (field.onChange(e.target.value), setDefaultValues(prevValues => ({ ...prevValues, numberID: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="numberID" className={classNames({ 'p-error': errors.name })}>numberID*</label>
                                </span>
                                {getFormErrorMessage('numberID')}
                            </div>

                            <div className="field">
                                <span className="p-float-label" >
                                    <Controller name="gender" control={control} rules={{ required: 'gender is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onChange={(e) => (field.onChange(e.target.value), setDefaultValues(prevValues => ({ ...prevValues, gender: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="username" className={classNames({ 'p-error': errors.name })}>gender*</label>
                                </span>
                                {getFormErrorMessage('username')}
                            </div>

                            <div className="field">
                                <span className="p-float-label" >
                                    <Controller name="phone" control={control} rules={{ required: 'phone is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onChange={(e) => (field.onChange(e.target.value), setDefaultValues(prevValues => ({ ...prevValues, phone: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="phone" className={classNames({ 'p-error': errors.name })}>phone*</label>
                                </span>
                                {getFormErrorMessage('phone')}
                            </div>

                            <div className="field">
                                <span className="p-float-label" >
                                    <Controller name="area" control={control} rules={{ required: 'area is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                            onChange={(e) => (field.onChange(e.target.value), setDefaultValues(prevValues => ({ ...prevValues, area: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="area" className={classNames({ 'p-error': errors.name })}>area*</label>
                                </span>
                                {getFormErrorMessage('area')}
                            </div>




                            <div className="field">
                                <span className="p-float-label p-input-icon-right " >

                                    <Controller name="email" control={control}
                                        rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' } }}
                                        render={({ field, fieldState }) => (
                                            <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })}
                                                onChange={(e) => (field.onChange(e.target.value), setDefaultValues(prevValues => ({ ...prevValues, email: e.target.value })))}
                                            />
                                        )} />
                                    <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>Email*</label>
                                </span>
                                {getFormErrorMessage('email')}
                            </div>

                            <div className="field">
                                <span className="p-float-label"  >
                                    <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                                        <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter}
                                            onChange={(e) => (field.onChange(e.target.value), setDefaultValues(prevValues => ({ ...prevValues, password: e.target.value })))}
                                        />
                                    )} />
                                    <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
                                </span>
                                {getFormErrorMessage('password')}
                            </div>

                            <div className="field">
                                <span className="p-float-label" dir='ltr'>
                                    <Controller
                                        name="dateOfBirth" // Field name
                                        control={control}
                                        rules={{ required: 'dateOfBirth is required.' }} // Required validation
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Calendar
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => (field.onChange(e.target.value), setDefaultValues(prevValues => ({ ...prevValues, dateOfBirth: e.target.value })))} // Update value in react-hook-form
                                                    dateFormat="yy-mm-dd"
                                                    mask="9999-99-99"
                                                    showIcon
                                                    className={classNames({ 'p-invalid': fieldState.invalid })} // Apply class for invalid state
                                                />
                                            </>
                                        )}
                                    />
                                    <label htmlFor="dateOfBirth" className={classNames({ 'p-error': !!errors.date })}>*dateOfBirth</label>
                                </span>
                                {getFormErrorMessage('date')}

                            </div>


                            <div className="field">


                            </div>
                            <div className="field-checkbox" >
                                <Controller name="accept" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                                    <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)} checked={field.value} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="accept" className={classNames({ 'p-error': errors.accept })}>I agree to the terms and conditions*</label>

                            </div>

                            <Button type="submit" label="Submit" className="mt-2" />
                        </form>
                    </div>
                </div>

            </Dialog>
        </div>
    );
}
export default FormRegT

