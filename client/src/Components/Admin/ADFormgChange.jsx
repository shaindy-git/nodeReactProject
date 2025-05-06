
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

const ADFormgChange = ({ visibleChange, setVisibleChange, manager }) => {
    const accesstoken = useSelector((state) => state.token.token);
    const [showMessage, setShowMessage] = useState(false);

    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues: {
            firstName: manager?.firstName || '',
            lastName: manager?.lastName || '',
            gender: manager?.gender || '',
            dateOfBirth: manager?.dateOfBirth ? new Date(manager.dateOfBirth) : null,
            userName: manager?.userName || '',
            numberID: manager?.numberID || '',
            phone: manager?.phone || '',
            email: manager?.email || '',
            area: manager?.area || '',
        }
    });

    const genders = ['male', 'female'];

    const onSubmit = async (data) => {
        try {
            const res = await axios({
                method: 'put',
                url: `http://localhost:7000/manager/updateManager/${manager.id}`,
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    ...data,
                    dateOfBirth: data.dateOfBirth.toISOString(),
                },
            });

            if (res.status === 200) {
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
            <Button
                label="OK"
                className="p-button-text"
                autoFocus
                onClick={() => {
                    setShowMessage(false);
                    setVisibleChange(false);
                }}
            />
        </div>
    );

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    return (
        <div className="form-demo">
            {/* הודעה על הצלחה */}
            <Dialog
                visible={showMessage}
                onHide={() => setShowMessage(false)}
                position="top"
                footer={dialogFooter}
                showHeader={false}
                breakpoints={{ '960px': '80vw' }}
                style={{ width: '30vw' }}
            >
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Manager details updated successfully!</h5>
                </div>
            </Dialog>

            {/* דיאלוג לשינוי פרטי מנהל */}
            <Dialog
                visible={visibleChange}
                style={{ width: '40vw' }}
                onHide={() => setVisibleChange(false)}
            >
                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">Change Manager Details</h5>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                            {/* First Name */}
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller
                                        name="firstName"
                                        control={control}
                                        rules={{ required: 'First name is required.' }}
                                        render={({ field, fieldState }) => (
                                            <InputText
                                                id={field.name}
                                                {...field}
                                                autoFocus
                                                className={classNames({ 'p-invalid': fieldState.invalid })}
                                            />
                                        )}
                                    />
                                    <label htmlFor="firstName" className={classNames({ 'p-error': errors.firstName })}>
                                        First Name*
                                    </label>
                                </span>
                                {getFormErrorMessage('firstName')}
                            </div>

                            {/* Last Name */}
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller
                                        name="lastName"
                                        control={control}
                                        rules={{ required: 'Last name is required.' }}
                                        render={({ field, fieldState }) => (
                                            <InputText
                                                id={field.name}
                                                {...field}
                                                className={classNames({ 'p-invalid': fieldState.invalid })}
                                            />
                                        )}
                                    />
                                    <label htmlFor="lastName" className={classNames({ 'p-error': errors.lastName })}>
                                        Last Name*
                                    </label>
                                </span>
                                {getFormErrorMessage('lastName')}
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
                                <span className="p-float-label">
                                    <Controller
                                        name="dateOfBirth"
                                        control={control}
                                        rules={{ required: 'Date of Birth is required.' }}
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
                                    <label htmlFor="dateOfBirth" className={classNames({ 'p-error': !!errors.dateOfBirth })}>
                                        Date of Birth*
                                    </label>
                                </span>
                                {getFormErrorMessage('dateOfBirth')}
                            </div>

                            <Button type="submit" label="Save Changes" className="mt-2" />
                        </form>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ADFormgChange;
