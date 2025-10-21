import React, { useState, useReducer } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useHistory, useNavigate } from 'react-router-dom';
import Validation from '../../../utils/Validation';
import _ from "lodash";
// import { ChangePasswords } from '../../../actions/authAction';
import ToastHot, { toast } from 'react-hot-toast';
import Loader from '../../../utils/Loader';
import Reducer from '../../../services/Reducer';
import { ChangePasswords } from '../../../actions/authAction';
import { logout } from '../../../redux/slice/user';
import { useDispatch } from 'react-redux';

const initState = {
    old_password: '',
    password: '',
    password_confirmation: '',
    loading: false,
    validate: false
};

const passwordState = {
    oldPassErrBlank: false,
    // IsValidOldPass: false,
    IsExistOldPass: false,

    passErrBlank: false,
    IsValidPass: false,

    confirmPassErrBlank: false
};

function ChangePasssword() {
    const [state, dispatch] = useReducer(Reducer, initState);
    const reduxDispatch = useDispatch()
    const navigator = useNavigate()
    const [stateForErr, dispatchForErr] = useReducer( Reducer , passwordState);
    const [togglePassword, setTogglePassword] = useState(false)
    const [togglePassword2, setTogglePassword2] = useState(false)

    const { Logout } = useAuth();

    const onPasswordChange = async (e) => {
        e.preventDefault();
        dispatch({ type: 'VALIDATE', payload: true });
        let validationStatus = await getValidation();

        if (validationStatus) {
            // const payload = {
            //     old_password: state.old_password,
            //     new_password: state.password
            // };
            dispatch({ type: 'LOAD', payload: true });
            let newData = new FormData()
            newData.append('password', state.password);
            newData.append('password_confirmation', state.password_confirmation);
            
            const response = await ChangePasswords(newData);
            if (response) {
                if (response?.data?.status === 200) {
                    dispatch({ type: 'LOAD', payload: false });
                    ToastHot.success("Password reset successfully");
                    dispatch({ type: "SETDATA", payload: { "name": "old_password", "value": '' } })
                    dispatch({ type: "SETDATA", payload: { "name": "password", "value": '' } })
                    dispatch({ type: "SETDATA", payload: { "name": "password_confirmation", "value": '' } })

                    reduxDispatch(logout())
                    navigator('/login')

                }else if (response?.data?.status === 422) {
                    toast.error(response?.data?.message)
                    dispatch({ type: 'LOAD', payload: false });
                } else if (response?.data?.status === 400) {
                    toast.error('Something Wrong')
                    dispatch({ type: 'LOAD', payload: false });
                } else {
                    dispatch({ type: 'LOAD', payload: false });

                    if (response.data.message === "Old password is wrong") {
                        dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistOldPass', value: true } });
                    }

                }
            } else {
                ToastHot.error("Something went wrong");
                console.log('Error');
            }
        }
    };

    const getValidation = () => {
        return new Promise((resolve, reject) => {
            if (
                // Validation.passwordCheck(state.old_password) && 
                Validation.text(state.password) &&
                Validation.passwordCheck(state.password) &&
                Validation.passwordConfirmCheck(state.password, state.password_confirmation)
            ) {
                resolve(true)
            } else {

                // if (!Validation.text(state.old_password)) {
                //     dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'oldPassErrBlank', value: true } });
                //     console.log('old_password')
                // }
                if (!Validation.text(state.password)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'passErrBlank', value: true } });
                    console.log('password')
                }
                else if (!Validation.passwordCheck(state.password)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidPass', value: true } });
                    console.log('password2')
                }
                if (!Validation.passwordConfirmCheck(state.password, state.password_confirmation)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'confirmPassErrBlank', value: true } });
                    console.log('password_confirmation')
                }


                resolve(false)
            }
        });
    }
    const getData = (e) => {
        if (e.target.name === "password") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'passErrBlank', value: true } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidPass', value: false } });
                console.log('password')
            }
            else if (!Validation.passwordCheck(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'passErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidPass', value: true } });
                console.log('password2')
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'passErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidPass', value: false } });
            }
            if (!Validation.passwordConfirmCheck(e.target.value, state.password_confirmation)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'confirmPassErrBlank', value: true } });
                console.log('password_confirmation')
            }
        }

        if (e.target.name === "password_confirmation") {
            if (!Validation.passwordConfirmCheck(state.password, e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'confirmPassErrBlank', value: true } });
                console.log('password_confirmation')
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'confirmPassErrBlank', value: false } });
            }
        }

        // }

        dispatch({ type: "ONCHANGE", payload: e })

    }
    return (
        <div className="createNewAccountPage">
            <div className="createNewAccountInner">
                <h1> Change Password</h1>
                <form>
                    <div className="row">
                        {/* <div className="col-md-12">
                                <h4>Contact Person Details</h4>
                            </div> */}
                        {/* <div className="col-md-6">
                            <div className="formGroup">
                                <label>Old Password</label>
                                <div className="inputgroup">
                                    <input type="password" id="old_password"
                                        value={state.old_password}
                                        onChange={getData}
                                        name="old_password"
                                        className={(stateForErr.oldPassErrBlank || stateForErr.IsExistOldPass) ? "form-control red-border" : "form-control"}
                                         />
                                </div>
                                {stateForErr.oldPassErrBlank &&
                                    <p className="error-msg">Password is required.</p>
                                }
                                
                                {stateForErr.IsExistOldPass &&
                                    <p className="error-msg">Wrong old password.</p>
                                }
                            </div>
                        </div> */}
                        <div className="col-md-12"></div>
                        <div className="col-md-6">
                            <div className="formGroup">
                                <label>New Password</label>
                                <div className="inputgroup inputgroupRight">
                                    <input id="password"
                                        value={state.password}
                                        onChange={getData}
                                        name="password"
                                        className={(stateForErr.passErrBlank || stateForErr.IsValidPass) ? "form-control red-border" : "form-control"}
                                        type={!togglePassword ? "password" : "text"}
                                        placeholder="" />
                                    <span onClick={() => setTogglePassword(!togglePassword)} style={{ cursor: "pointer" }}
                                        className="rightSide">
                                        {togglePassword ?
                                            <img src="/images/visibility.svg" className="w23"></img>
                                            :
                                            <img src="/images/visibility_off.svg" className="w23"></img>}
                                    </span>
                                </div>
                                {stateForErr.passErrBlank &&
                                    <p className="error-msg">Password is required.</p>
                                }
                                {stateForErr.IsValidPass &&
                                    <p className="error-msg">Please enter valid password minimum 8 characters with at least a number,
                                        special character and capital letter and small letter.</p>
                                }
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="formGroup">
                                <label>Confirm New Password</label>
                                <div className="inputgroup inputgroupRight">
                                    <input id="password_confirmation"
                                        value={state.password_confirmation}
                                        onChange={getData}
                                        type={!togglePassword2 ? "password" : "text"}
                                        name="password_confirmation"
                                        className={(stateForErr.confirmPassErrBlank) ? "form-control red-border" : "form-control"} placeholder="" />
                                    <span onClick={() => setTogglePassword2(!togglePassword2)} style={{ cursor: "pointer" }}
                                        className="rightSide">
                                        {togglePassword2 ?
                                            <img src="/images/visibility.svg" className="w23"></img>
                                            :
                                            <img src="/images/visibility_off.svg" className="w23"></img>}
                                    </span>
                                </div>
                                {stateForErr.confirmPassErrBlank &&
                                    <p className="error-msg">Confirm Password is not matched with New Password.</p>
                                }
                            </div>
                        </div>
                        <div class="col-12">
                            <button disabled={state.loading ? true : false} class="themeBtn fullBtn" onClick={onPasswordChange}>
                                {
                                    state.loading ? <Loader loaderWidth={"30px"} loaderHeight={"30px"} position={"relative"} /> : "Change Password"
                                }

                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePasssword;
