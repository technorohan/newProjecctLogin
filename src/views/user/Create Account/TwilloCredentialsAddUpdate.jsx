import React, { useState, useEffect, useReducer } from 'react';
import useAuth from '../../../hooks/useAuth';
import { Helmet } from 'react-helmet';
import { Redirect, useHistory } from 'react-router-dom';
import LoadingScreen from '../../../components/LoadingScreen';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useGlobalStore from '../../../hooks/useGlobalStore';
import ImageFormat from '../../../utils/ImageFormat';
import ImageUpload from '../../../utils/ImageUpload';
import Loader from '../../../utils/Loader';
// import LeadDetailsModal from '../../../components/Modals/LeadDetailsModal';
import { toast } from "react-toastify";
import _ from "lodash";
import Validation from '../../../utils/Validation';
import { CountryList, StateList, SubscriptionList } from '../../../actions/commonAction';
import { AWSCredentialsApi, CreateNewAccount, FetchAccountDetails, TwilloCredentialsApi, UpdateAdminAccount } from '../../../actions/authAction';
import ToastHot from 'react-hot-toast';
import Reducer from '../../../services/Reducer';


const initialState = {
    twilioNumber: '',
    twilioAccountSid: '',
    twilioAuthToken: '',

    loading: false
};
const generalStateForErr = {
    timezoneErrBlank: false,
};

export default function TwilloCredentialsAddUpdate() {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const [stateForErr, dispatchForErr] = useReducer(Reducer, generalStateForErr);

    const history = useHistory();

    useEffect(() => {
        let fullData = history && history.location && history.location.search ? history.location.search : ''
        let id
        if (fullData) {
            id = fullData.split('?id=')[1]
            console.log(id)
            dispatch({ type: "SETDATA", payload: { "name": "editId", "value": id } })
        }
    }, []);


    const onTwilloUpdate = async (e) => {
        e.preventDefault();
        let validationStatus = await getValidation();

        if (validationStatus) {
            let response
            let payload
            payload = {
                userId: state.editId ? parseInt(state.editId) : undefined,

                twilioNumber: state.twilioNumber,
                twilioAccountSid: state.twilioAccountSid,
                twilioAuthToken: state.twilioAuthToken,

            };
            dispatch({ type: 'LOAD', payload: true });
            response = await TwilloCredentialsApi(payload);
            if (response && response.status === 200) {
                if (response.data.status === 200) {
                    dispatch({ type: 'LOAD', payload: false });
                    ToastHot.success('Successfully saved twillo data.')

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
            if (Validation.text(state.twilioNumber) &&
                Validation.text(state.twilioAccountSid) &&
                Validation.text(state.twilioAuthToken)

            ) {
                resolve(true)
            } else {
                if (!Validation.text(state.twilioNumber)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'twilioNumberErrBlank', value: true } })
                }
                if (!Validation.text(state.twilioAccountSid)) {

                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'twilioAccountSidErrBlank', value: true } });
                }

                if (!Validation.text(state.twilioAuthToken)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'twilioAuthTokenErrBlank', value: true } });
                }

                resolve(false)
            }
        });
    }


    // OnChange Func
    const getData = (e) => {
        if (e.target.name === "twilioNumber") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'twilioNumberErrBlank', value: true } });
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'twilioNumberErrBlank', value: false } });
            }
        }
        if (e.target.name === "twilioAccountSid") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'twilioAccountSidErrBlank', value: true } });
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'twilioAccountSidErrBlank', value: false } });
            }
        }
        if (e.target.name === "twilioAuthToken") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'twilioAuthTokenErrBlank', value: true } });
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'twilioAuthTokenErrBlank', value: false } });
            }
        }

        dispatch({ type: "ONCHANGE", payload: e })
    }

    console.log("State for Twillo Credential Page-----", state)
    return (
        <>
            <Helmet>
                <title>Twillo Credential</title>
            </Helmet>


            <div className="createNewAccountPage">
                <div className="createNewAccountInner">
                    <h1>Twillo Details</h1>
                    <form>
                        <div className="row">

                            <>
                                <div className='col-12 col-md-6'>
                                    <div className="formGroup">
                                        <label>My organization's Number</label>
                                        <div className="inputgroup">
                                            <input type="text"
                                                className={(stateForErr.twilioNumberErrBlank) ? "form-control red-border" : "form-control"}
                                                id="twilioNumber"
                                                value={state.twilioNumber}
                                                onChange={getData}
                                                name="twilioNumber"
                                                placeholder=""
                                            />
                                        </div>
                                        {stateForErr.twilioNumberErrBlank &&
                                            <p className="error-msg">My organization's Number is required.</p>
                                        }
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div className="formGroup">
                                        <label>My organization's Account Sid</label>
                                        <div className="inputgroup">
                                            <input type="password"
                                                className={(stateForErr.twilioAccountSidErrBlank) ? "form-control red-border" : "form-control"}
                                                id="twilioAccountSid"
                                                value={state.twilioAccountSid}
                                                onChange={getData}
                                                name="twilioAccountSid"
                                                placeholder=""
                                            />
                                        </div>
                                        {stateForErr.twilioAccountSidErrBlank &&
                                            <p className="error-msg">My organization's Account Sid is required.</p>
                                        }
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div className="formGroup">
                                        <label>My organization's Auth Token</label>
                                        <div className="inputgroup ">
                                            <input type="password"
                                                className={(stateForErr.twilioAuthTokenErrBlank) ? "form-control red-border" : "form-control"}
                                                id="twilioAuthToken"
                                                value={state.twilioAuthToken}
                                                onChange={getData}
                                                name="twilioAuthToken"
                                                placeholder=""
                                            />
                                        </div>
                                        {stateForErr.twilioAuthTokenErrBlank &&
                                            <p className="error-msg">Organization's Auth Token is required.</p>
                                        }
                                    </div>
                                </div>


                            </>
                        </div>
                        <div className="row">
                            <div className="col-12">

                                <button className="themeBtn fullBtn" disabled={state.loading ? true : false} onClick={onTwilloUpdate}>
                                    {
                                        state.loading ? <Loader loaderWidth={"30px"} loaderHeight={"30px"} position={"relative"} /> : state.editId ? 'Submit' : 'Submit'
                                    }
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div >


        </>
    );
}
