
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ADFormgChange = (props) => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;

    const [showMessage, setShowMessage] = useState(false);
    const [newManager, setNewManager] = useState(null);

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
            area: ''
        }
    });

    useEffect(() => {
        if (props.manager) {
            reset({
                firstName: '',
                lastName: '',
                userName: '',
                numberID: '',
                dateOfBirth: null,
                phone: '',
                email: '',
                area: props.manager.area || ''
            });
        }
    }, [props.manager, reset]);

    const onSubmit = async (data) => {
        if ((new Date() - new Date(data.dateOfBirth)) < 0) {
            alert("Invalid date of birth");
            return;
        }

        if ((new Date() - new Date(data.dateOfBirth)) > 70 * 31536000000 || (new Date() - new Date(data.dateOfBirth)) < 50 * 31536000000) {
            alert("The age is not appropriate, for a teacher the required age is between 50-70");
            return;
        }

        try {
            const res = await axios({
                method: 'delete',
                url: `http://localhost:7000/manager/deleteManager/${props.manager._id}`,
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    ...data,
                    dateOfBirth: new Date(data.dateOfBirth)
                }
            });

            if (res.status === 200 && res.data.managers) {
                props.setManagers(res.data.managers || []);
                props.setChange(res.data);
                setNewManager(data); // שמור את הנתונים של המנהל החדש
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
                    props.setVisibleChange(false);
                }}
            />
        </div>
    );

    const getFormErrorMessage = (name) => errors[name] && <small className="p-error">{errors[name].message}</small>;

    return (
        <div className="form-demo">
            {/* דיאלוג החלפת מנהל מוצלחת */}
            <Dialog
                visible={showMessage}
                onHide={() => setShowMessage(false)}
                footer={dialogFooter}
                style={{ width: '30vw' }}
            >
                <div className="flex flex-column align-items-center text-center">
                    <i className="pi pi-check-circle text-green-500" style={{ fontSize: '3rem' }}></i>
                    <h4 className="mt-3">Manager successfully replaced</h4>
                    {newManager && (
                        <p>Manager <b>{props.manager.firstName} {props.manager.lastName}</b> has been successfully replaced by manager <b>{newManager.firstName} {newManager.lastName}</b>.<br />
Password has been sent to email <b>{newManager.email}</b>.
                        </p>
                    )}
                </div>
            </Dialog>

            {/* דיאלוג הטופס עצמו */}
            <Dialog visible={props.visibleChange} style={{ width: '28vw' }} onHide={() => props.setVisibleChange(false)}>
                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">Exchange Manager</h5>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                            {['firstName', 'lastName', 'userName', 'numberID', 'phone', 'email'].map(fieldName => (
                                <div className="field" key={fieldName}>
                                    <span className="p-float-label">
                                        <Controller
                                            name={fieldName}
                                            control={control}
                                            rules={fieldName === 'email' ? {
                                                required: 'Email is required.',
                                                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' }
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
                                            <InputText id={field.name} {...field} readOnly />
                                        )}
                                    />
                                    <label htmlFor="area">Area*</label>
                                </span>
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

export default ADFormgChange;
