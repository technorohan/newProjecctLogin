import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import Loader from '../../../utils/Loader';
import Validation from '../../../utils/Validation';
import { ChangePasswords, FetchAccountDetails } from '../../../actions/authAction';
import ToastHot from 'react-hot-toast';
import Reducer from '../../../services/Reducer';


const initState = {
    password: '',
    editId: '',

    loading: false,
    validate: false
};
const generalStateForErr = {
    passwordErrBlank: false,
};


export default function UpdateAdminPassword() {
    const [state, dispatch] = useReducer(Reducer, initState);
    const [stateForErr, dispatchForErr] = useReducer(Reducer, generalStateForErr);

    const history = useHistory();

    useEffect(() => {
        let sid = history && history.location && history.location.pathname ? history.location.pathname : ''
        let id
        if (sid) {
            id = sid.split('/')[3]
            console.log(id)
            dispatch({ type: "SETDATA", payload: { "name": "editId", "value": id } })
            id && getAdminInfo(id)
        } else {
        }
    }, [history]);

    //Generates new password
    const generateNewPass = (e) => {
        e.preventDefault();
        let pass = Validation.generatePassword() // New Random Password generate
        dispatch({ type: "SETDATA", payload: { "name": "password", "value": pass } })
    }

    const getAdminInfo = async (id) => {
        const response = await FetchAccountDetails(id);
        if (response && response.status === 200 && response.data && response.data.data) {
            if (response.data.data.roles && response.data.data.roles.length > 0 && response.data.data.roles[0].name && response.data.data.roles[0].name === "Admin") {
                console.log('Stay On this page')
            } else {
                history.push(`/404`)
            }
        }

    }

    const onChangePasswordAdmin = async (e) => {
        e.preventDefault();
        let validationStatus = await getValidation();

        if (validationStatus) {
            let response
            let payload = {
                password: state.password,
                userId: state.editId
            };
            dispatch({ type: 'LOAD', payload: true });
            response = await ChangePasswords(payload);

            if (response && response.status === 200) {
                if (response.data.status === 200) {
                    dispatch({ type: 'LOAD', payload: false });
                    ToastHot.success("Admin account password reset successfully.");
                    history.push(`/user/all-accounts`)
                } else {
                    dispatch({ type: 'LOAD', payload: false });
                }
            } else {
                dispatch({ type: 'LOAD', payload: false });
                console.log('Error');
            }
        }
    };

    const getValidation = () => {
        return new Promise((resolve, reject) => {
            if (
                Validation.text(state.password)

            ) {
                resolve(true)
            } else {

                if (!Validation.text(state.password)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'passwordErrBlank', value: true } });
                    console.log('organizationName')
                }
                resolve(false)
            }
        });
    }

    const getData = (e) => {
        
        if (e.target.name === "password") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'passwordErrBlank', value: true } });
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'passwordErrBlank', value: false } });
            }
        }
        
        dispatch({ type: "ONCHANGE", payload: e })

    }
    console.log("State for Dahboard Page-----", state)
    return (
        <>
            <Helmet>
                <title>Reset Password</title>
            </Helmet>


            <div className="createNewAccountPage">
                <div className="createNewAccountInner">
                    <h1>Reset Password</h1>
                    <form>

                        <div className="col-12">
                            <div className="formGroup">
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <label>Password</label>
                                        <div className="inputgroup">
                                            <input type='text'
                                                className={(stateForErr.passwordErrBlank) ? "form-control red-border" : "form-control"}
                                                id="password"
                                                // disabled={state.passwordType && state.passwordType !== 'CREATENEW' ? true : false}
                                                value={state.password}
                                                onChange={getData}
                                                name="password">
                                            </input>
                                            {stateForErr.passwordErrBlank &&
                                                <p className="error-msg">Password is required.</p>
                                            }
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <button className="btn_genaratePass" onClick={(e) => generateNewPass(e)}>Generate Password</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">

                                <button className="themeBtn fullBtn" disabled={state.loading ? true : false} onClick={onChangePasswordAdmin}>
                                    {
                                        state.loading ? <Loader loaderWidth={"30px"} loaderHeight={"30px"} position={"relative"} /> : 'Reset Password'
                                    }
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>


        </>
    );
}
