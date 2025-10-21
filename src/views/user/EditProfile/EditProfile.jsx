import React, { useEffect, useReducer } from 'react';
import useAuth from '../../../hooks/useAuth';
import Loader from '../../../utils/Loader';
import Validation from '../../../utils/Validation';
// import { UpdateAccountForSuperAdmin } from '../../../actions/authAction';
import ToastHot from 'react-hot-toast';
import Reducer from '../../../services/Reducer';
import { useSelector } from 'react-redux';


const initStateEditProfileErr = {
    email: '',
    phoneNo: '',
    
    firstName: '',
    lastName: '',

    loading: false,
    validate: false
};
const generalStateEditProfileErr = {
    firstNameErrBlank: false,
    lastNameErrBlank: false,
    validFirstnameError: false,
    validLastnameError: false,

    emailErrBlank: false,
    IsValidEmail: false,
    IsExistEmail: false,

    phoneErrBlank: false,
    IsValidPhone: false,
    IsExistPhone: false,

};

export default function EditProfile() {
    const [state, dispatch] = useReducer(Reducer, initStateEditProfileErr);
    const [stateForErr, dispatchForErr] = useReducer(Reducer, generalStateEditProfileErr);
    // const { user, updateUser } = useAuth();
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        if(user){
            getAllUserInfo()
        }
    }, []);
    const getAllUserInfo = () => {
        dispatch({ type: "SETDATA", payload: { "name": "firstName", "value": user.first_name } })
        dispatch({ type: "SETDATA", payload: { "name": "lastName", "value": user.last_name } })
        dispatch({ type: "SETDATA", payload: { "name": "email", "value": user.email } })
        dispatch({ type: "SETDATA", payload: { "name": "phoneNo", "value": user.mobile } })
    }

    const onChangeGetDataAllData = (e) => {
        if (e.target.name === "email") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'emailErrBlank', value: true } });

                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistEmail', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidEmail', value: false } });
                console.log('email')
            }
            else if (!Validation.email(e.target.value.toLowerCase())) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'emailErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistEmail', value: false } });
                
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidEmail', value: true } });
            } else {
                //Email
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'emailErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidEmail', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistEmail', value: false } });
            }
        }
        
        //Firstnames
        if ( e.target.name ===  "firstName" ) {
            if (!Validation.text( e.target.value )) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'firstNameErrBlank', value: true } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validFirstnameError', value: false } })
            } else if ( !Validation.nameFields( e.target.value )) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'firstNameErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validFirstnameError', value: true } })
                console.log('firstname')
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'firstNameErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validFirstnameError', value: false } });
            }
        }

        if (e.target.name === "lastName" ) {
            if (!Validation.text( e.target.value )) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'lastNameErrBlank', value: true } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validLastnameError', value: false } })
                console.log('last')
            } else if (!Validation.nameFields( e.target.value )) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'lastNameErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validLastnameError', value: true } });
            } else {
                console.log('last else')
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'lastNameErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validLastnameError', value: false } });
            }
        }

        if (e.target.name === "phoneNo") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'phoneErrBlank', value: true } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistPhone', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidPhone', value: false } });
            }
            else if (!Validation.mobile(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidPhone', value: true } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistPhone', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'phoneErrBlank', value: false } });
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'phoneErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidPhone', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistPhone', value: false } });
            }
        }
        dispatch({ type: "ONCHANGE", payload: e })

    }
    
    const onProfileUpdate = async (e) => {
        e.preventDefault();
        let validationStatus = await getValidation();
        if (validationStatus) {
            const payload = {
                id: user && user.id,
                firstname: state.firstName,
                lastname: state.lastName,
                email: state.email.toLowerCase(),
                phoneNumber: state.phoneNo
            };
            dispatch({ type: 'LOAD', payload: true });
            const response = false//await UpdateAccountForSuperAdmin(payload);
            if (response && response.status === 200) {
                if (response.data.status === 200) {
                    ToastHot.success('Successfully account updated.')
                    //-------------------------------
                    let userData = JSON.parse(JSON.stringify(user));
                    console.log("userData before", userData)
                    userData.firstname = state.firstName;
                    userData.lastname = state.lastName;
                    userData.email = state.email;
                    userData.phoneNumber = state.phoneNo;
                    console.log("userData ", userData)
                    // updateUser(userData);
                    dispatch({ type: 'LOAD', payload: false });
                } else {
                    if (response.data.status === 400) {
                        dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistEmail', value: true } });
                    }
                    dispatch({ type: 'LOAD', payload: false });
                }
            } else {
                dispatch({ type: 'LOAD', payload: false });
                ToastHot.error("Something went wrong");
                console.log('Error');
            }
        }
    };

    const getValidation = () => {
        return new Promise((resolve, reject) => {
            if (Validation.text(state.firstName) &&
                Validation.nameFields(state.firstName) &&
                Validation.nameFields(state.lastName) &&
                Validation.text(state.lastName) &&
                Validation.text(state.email) &&
                Validation.email(state.email.toLowerCase()) &&
                Validation.text(state.phoneNo) &&
                Validation.mobile(state.phoneNo)

            ) {
                resolve(true)
            } else {

                if (!Validation.text(state.firstName)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'firstNameErrBlank', value: true } });
                    console.log('firstname')
                } else if (!Validation.nameFields(state.firstName)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validFirstnameError', value: true } });
                    console.log('firstname')
                }

                if (!Validation.text(state.lastName)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'lastNameErrBlank', value: true } });
                    console.log('lastname')
                } else if (!Validation.nameFields(state.lastName)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validLastnameError', value: true } });
                    console.log('lastName')
                }

                if (!Validation.text(state.email)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'emailErrBlank', value: true } });
                    console.log('email')
                }
                else if (!Validation.email(state.email.toLowerCase())) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidEmail', value: true } });
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistEmail', value: false } });
                    console.log('email2')
                }

                if (!Validation.text(state.phoneNo)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'phoneErrBlank', value: true } });
                    console.log('phone')
                }
                else if (!Validation.mobile(state.phoneNo)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidPhone', value: true } });
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistPhone', value: false } });
                }
                resolve(false)
            }
        });
    }

    

    return (
        <div className="createNewAccountPage">
            <div className="createNewAccountInner">
                <h1> Edit Profile</h1>
                <form>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="formGroup">
                                <label>First Name</label>
                                <div className="inputgroup ">
                                    <input type="text"
                                        className={(stateForErr.firstNameErrBlank || stateForErr.validFirstnameError) ? "form-control red-border" : "form-control"}
                                        id="firstName"
                                        value={state.firstName}
                                        onChange={onChangeGetDataAllData}
                                        name="firstName"
                                        placeholder=""
                                    />
                                    {/* <img src="/images/user.svg" class="rightSide" /> */}
                                </div>
                                {stateForErr.firstNameErrBlank &&
                                    <p className="error-msg">First name is required.</p>
                                }
                                {stateForErr.validFirstnameError &&
                                    <p className="error-msg">First name is not valid.</p>
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="formGroup">
                                <label>Last Name</label>
                                <div className="inputgroup ">
                                {/* inputgroupRight */}
                                    <input type="text"
                                        className={(stateForErr.lastNameErrBlank || stateForErr.validLastnameError) ? "form-control red-border" : "form-control"}
                                        id="lastName"
                                        value={state.lastName}
                                        onChange={onChangeGetDataAllData}
                                        name="lastName"
                                        placeholder=""
                                    />
                                    {/* <img src="/images/user.svg" class="rightSide" /> */}
                                </div>
                                {stateForErr.lastNameErrBlank &&
                                    <p className="error-msg">Last name is required.</p>
                                }
                                {stateForErr.validLastnameError &&
                                    <p className="error-msg">Last name is not valid.</p>
                                }
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="formGroup">
                                <label>Email Address</label>
                                <div className="inputgroup inputgroupRight">
                                    <input type="text"
                                        id="email"
                                        disabled
                                        value={state.email}
                                        onChange={onChangeGetDataAllData}
                                        name="email"
                                        placeholder="tim.jennings@example.com"
                                        className={(stateForErr.emailErrBlank || stateForErr.IsValidEmail || stateForErr.IsExistEmail) ? "form-control red-border" : "form-control"}
                                    />
                                    <img src="/images/email.svg" class="rightSide" alt="" />
                                </div>
                                {stateForErr.emailErrBlank &&
                                    <p className="error-msg">Email is required.</p>
                                }
                                {stateForErr.IsValidEmail &&
                                    <p className="error-msg">Valid Email is required.</p>
                                }
                                {stateForErr.IsExistEmail &&
                                    <p className="error-msg">Already Exist this email.</p>
                                }
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="formGroup">
                                <label>Phone Number </label>
                                <div className="inputgroup inputgroupRight">
                                    <input type="tel"
                                        id="phoneNo"
                                        value={state.phoneNo}
                                        onChange={onChangeGetDataAllData}
                                        name="phoneNo"
                                        // placeholder="insert phone number"
                                        className={(stateForErr.phoneErrBlank || stateForErr.IsValidPhone) ? "form-control red-border" : "form-control"}
                                    />
                                    <img src="/images/phone-icon.svg" class="rightSide" alt=""  />
                                </div>
                                {stateForErr.phoneErrBlank &&
                                    <p className="error-msg">Phone no is required.</p>
                                }
                                {stateForErr.IsValidPhone &&
                                    <p className="error-msg">Valid Phone no is required.</p>
                                }
                            </div>
                        </div>
                        <div class="col-12">
                        <button className="themeBtn fullBtn" disabled={state.loading ? true : false} onClick={onProfileUpdate}>
                                {
                                    state.loading ? <Loader loaderWidth={"30px"} loaderHeight={"30px"} position={"relative"} /> : "SAVE"
                                }
                                </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

