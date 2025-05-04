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
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, logOut } from '../../redux/tokenSlice'
import { jwtDecode } from 'jwt-decode';
import './FromReg.css';
import './FromReg.css';




const FormUpdate = (props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const accesstoken = useSelector((state) => state.token.token)
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;

    const [defaultValues, setDefaultValues] = useState({

        firstName: decoded.firstName,
        lastName: decoded.lastName,
        userName: decoded.userName,
        phone: decoded.phone,
        email: decoded.email,
        accept: false
    })

    const onSubmit = async (data) => {

        if (decoded?.role === 'M') {
            try {
                console.log(defaultValues);

                const res = await axios({
                    method: 'put',
                    url: 'http://localhost:7000/manager/updateManager',
                    headers: { Authorization: "Bearer " + accesstoken },
                    data: {
                        firstName: defaultValues.firstName,
                        lastName: defaultValues.lastName,
                        userName: defaultValues.userName,
                        phone: defaultValues.phone,
                        email: defaultValues.email,

                    }
                });

                if (res.status === 200) {
                    setFormData(data);
                    setShowMessage(true);
                    dispatch(setToken(res.data.accessToken))

                    reset();

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
        }
        else if (decoded?.role === 'T') {

            try {
                console.log(defaultValues);

                const res = await axios({
                    method: 'put',
                    url: 'http://localhost:7000/teacher/updateTeacher',
                    headers: { Authorization: "Bearer " + accesstoken },
                    data: {
                        firstName: defaultValues.firstName,
                        lastName: defaultValues.lastName,
                        userName: defaultValues.userName,
                        phone: defaultValues.phone,
                        email: defaultValues.email,


                    }
                });

                if (res.status === 200) {
                    setFormData(data);
                    setShowMessage(true);
                    dispatch(setToken(res.data.accessToken))

                    reset();

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



        }

        if (decoded?.role === 'S') {

            try {
                console.log(defaultValues);

                const res = await axios({
                    method: 'put',
                    url: 'http://localhost:7000/student/updateStudent',
                    headers: { Authorization: "Bearer " + accesstoken },
                    data: {
                        firstName: defaultValues.firstName,
                        lastName: defaultValues.lastName,
                        userName: defaultValues.userName,
                        phone: defaultValues.phone,
                        email: defaultValues.email,


                    }
                });

                if (res.status === 200) {
                    setFormData(data);
                    setShowMessage(true);
                    dispatch(setToken(res.data.accessToken))

                    reset();

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



        }
    }


        const OK = async () => {
            setShowMessage(false);
            // const accesstoken = useSelector((state) => state.token.token)
            // decoded = accesstoken ? jwtDecode(accesstoken) : null;
           navigate('./Auth/Auth');
            props.setVisibleU(false);
        }


        const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });



        const getFormErrorMessage = (name) => {
            return errors[name] && <small className="p-error">{errors[name].message}</small>
        };

        const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={OK} /></div>;
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
                            The details have been updated successfully, you are being redirected to the login page to refresh the details.
                        </p>
                    </div>
                </Dialog>

                <Dialog visible={props.visibleU} style={{ width: '28vw' }} onHide={() => { if (!props.visibleU) return; props.setVisibleU(false); }}>

                    <div className="flex justify-content-center">
                        <div className="card">
                            <h5 className="text-center">Update user details</h5>
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


                                <Button type="submit" label="Submit" className="mt-2" />
                            </form>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
    export default FormUpdate

