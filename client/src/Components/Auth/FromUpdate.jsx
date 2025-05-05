import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../../redux/tokenSlice';
import { jwtDecode } from 'jwt-decode';

const FormUpdate = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;

    const defaultValues = {
        firstName: decoded?.firstName || '',
        lastName: decoded?.lastName || '',
        userName: decoded?.userName || '',
        phone: decoded?.phone || '',
        email: decoded?.email || '',
    };

    const { control, formState: { errors }, handleSubmit, reset, setValue, getValues } = useForm({
        defaultValues: defaultValues
    });

    useEffect(() => {
        // Set default values in the form (in case defaultValues are updated dynamically)
        Object.keys(defaultValues).forEach((key) => {
            setValue(key, defaultValues[key]);
        });
    }, [defaultValues, setValue]);

    const onSubmit = async (data) => {
        // Combine updated data with default values
        const updatedData = {
            ...defaultValues,
            ...data,
        };

        try {
            let url = '';
            if (decoded?.role === 'M') url = 'http://localhost:7000/manager/updateManager';
            else if (decoded?.role === 'T') url = 'http://localhost:7000/teacher/updateTeacher';
            else if (decoded?.role === 'S') url = 'http://localhost:7000/student/updateStudent';

            const res = await axios({
                method: 'put',
                url: url,
                headers: { Authorization: "Bearer " + accesstoken },
                data: updatedData,
            });

            if (res.status === 200) {
                setFormData(updatedData);
                setShowMessage(true);
                dispatch(setToken(res.data.accessToken));
                reset(); // Reset form after submission
            } else {
                alert("Unexpected response from the server.");
            }
        } catch (e) {
            const errorMessage = e.response?.data?.message || "An error occurred, please try again.";
            alert(errorMessage);
            console.error(e);
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    const dialogFooter = (
        <div className="flex justify-content-center">
            <Button label="OK" className="p-button-text" autoFocus onClick={() => {
                setShowMessage(false);
                navigate('./Auth/Auth');
                props.setVisibleU(false);
            }} />
        </div>
    );

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '100vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Update Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        The details have been updated successfully. You are being redirected to the login page to refresh the details.
                    </p>
                </div>
            </Dialog>

            <Dialog visible={props.visibleU} style={{ width: '28vw' }} onHide={() => { if (!props.visibleU) return; props.setVisibleU(false); }}>
                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">Update User Details</h5>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="firstName" control={control} rules={{ required: 'First name is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name}
                                            {...field}
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )} />
                                    <label htmlFor="firstName" className={classNames({ 'p-error': errors.firstName })}>First Name*</label>
                                </span>
                                {getFormErrorMessage('firstName')}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="lastName" control={control} rules={{ required: 'Last name is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name}
                                            {...field}
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )} />
                                    <label htmlFor="lastName" className={classNames({ 'p-error': errors.lastName })}>Last Name*</label>
                                </span>
                                {getFormErrorMessage('lastName')}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="userName" control={control} rules={{ required: 'User name is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name}
                                            {...field}
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )} />
                                    <label htmlFor="userName" className={classNames({ 'p-error': errors.userName })}>User Name*</label>
                                </span>
                                {getFormErrorMessage('userName')}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="phone" control={control} rules={{ required: 'Phone is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name}
                                            {...field}
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )} />
                                    <label htmlFor="phone" className={classNames({ 'p-error': errors.phone })}>Phone*</label>
                                </span>
                                {getFormErrorMessage('phone')}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="email" control={control} rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address.' } }} render={({ field, fieldState }) => (
                                        <InputText id={field.name}
                                            {...field}
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )} />
                                    <label htmlFor="email" className={classNames({ 'p-error': errors.email })}>Email*</label>
                                </span>
                                {getFormErrorMessage('email')}
                            </div>

                            <Button type="submit" label="Submit" className="mt-2" />
                        </form>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default FormUpdate;