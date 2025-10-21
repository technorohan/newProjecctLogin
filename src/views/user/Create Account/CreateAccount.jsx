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
import { toast } from "react-toastify";
import _ from "lodash";
import Validation from '../../../utils/Validation';
import { CountryList, StateList, SubscriptionList } from '../../../actions/commonAction';
import { CreateNewAccount, FetchAccountDetails, UpdateAdminAccount, UploadProfilePicture } from '../../../actions/authAction';
import ToastHot from 'react-hot-toast';
import Reducer from '../../../services/Reducer';


const initialState = {
    filterRed: false,
    editId: '',
    organizationName: '',
    email: '',
    password: '',
    // phoneCode: '',
    phoneNo: '',

    twilioNumber: '',
    twilioAccountSid: '',
    twilioAuthToken: '',

    subscriptionType: 'Essentials',
    allocateSeat: '',
    subscriptionExpiredDate: new Date(moment().add(1, 'years')),
    addressLine1: '',
    addressLine2: '',
    profileCity: '',
    comnpanyZip: '',

    comnpanyCountry: '226',
    profileState: '',
    firstName: '',
    middleName: '',
    lastName: '',

    googleClientId: '',
    googleClientSecret: "",

    office365ClientId: '',
    office365TenantId: '',
    office365Secret: "",

    isOfficeGoogleEnable: true,

    isMacSecurityEnable: false,
    isRoundRobinEnable: false,
    isClassEnable: false,
    isSecurityEnable: false,
    isRegionEnable: false,
    isReportEnable: false,

    CountryList: [],

    SubscriptionsList: [],
    StateList: [],

    timezone: '',

    awsUser: '',
    accessKeyID: '',
    secretAccessKey: '',
    bucket: '',
    region: '',

    profilePhoto: '',
    loadingForProfilePicture: false,

    loading: false
};
const generalStateForErr = {
    firstNameErrBlank: false,
    lastNameErrBlank: false,
    validFirstNameError: false,
    validLastNameError: false,

    phoneErrBlank: false,
    IsValidPhone: false,
    IsExistPhone: false,

    emailErrBlank: false,
    IsValidEmail: false,
    IsExistEmail: false,

    passwordErrBlank: false,

    subscriptionTypesErrBlank: false,
    companyError: false,
    companyAddressErrBlank: false,
    cityErrBlank: false,
    zipErrBlank: false,
    companyStateErrBlank: false,
    companyCountryErrBlank: false,

    companyPhoneErrBlank: false,
    companyIsValidPhone: false,

    timezoneErrBlank: false,
};

export default function CreateAccount() {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const [stateForErr, dispatchForErr] = useReducer(Reducer, generalStateForErr);

    const history = useHistory();

    useEffect(() => {
        console.log("Wecome to dahboard-----", state)
        getStateList()
        getSubscriptionList()
    }, []);

    useEffect(() => {
        let fullData = history && history.location && history.location.search ? history.location.search : ''
        let id
        if (fullData) {
            id = fullData.split('?id=')[1]
            console.log(id)
            dispatch({ type: "SETDATA", payload: { "name": "editId", "value": id } })
            id && getAllUserInfo(id)
        }
    }, []);

    //Generate new password
    // const generateNewPass = (e) => {
    //     e.preventDefault();
    //     let pass = Validation.generatePassword() // New Random Password generate
    //     dispatch({ type: "SETDATA", payload: { "name": "password", "value": pass } })
    // }

    const getAllUserInfo = async (id) => {
        dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'phoneErrBlank', value: false } });
        const response = await FetchAccountDetails(id);
        if (response && response.status === 200 && response.data && response.data.data) {
            dispatch({ type: "SETDATA", payload: { "name": "firstName", "value": response.data.data.firstname } })
            dispatch({ type: "SETDATA", payload: { "name": "middleName", "value": response.data.data.middleName } })
            dispatch({ type: "SETDATA", payload: { "name": "lastName", "value": response.data.data.lastname } })
            dispatch({ type: "SETDATA", payload: { "name": "email", "value": response.data.data.email } })
            dispatch({ type: "SETDATA", payload: { "name": "phoneNo", "value": response.data.data.phoneNumber } })
            dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'phoneErrBlank', value: false } });
            dispatch({ type: "SETDATA", payload: { "name": "password", "value": response.data.data.password } })
            let data = {
                logo: response.data.data?.adminLogo,
                profilePictureLink: response.data.data?.adminProfilePictureLink ? response.data.data.adminProfilePictureLink : "",
            }
            dispatch({ type: "SETDATA", payload: { "name": "profilePhoto", "value": data } })

            dispatch({ type: "SETDATA", payload: { "name": "googleClientId", "value": !!response.data.data?.googleClientId ? response.data.data?.googleClientId : '' } })
            dispatch({ type: "SETDATA", payload: { "name": "googleClientSecret", "value": !!response.data.data?.googleClientSecret ? response.data.data?.googleClientSecret : '' } })


            dispatch({ type: "SETDATA", payload: { "name": "office365ClientId", "value": !!response.data.data?.office365ClientId ? response.data.data?.office365ClientId : '' } })
            dispatch({ type: "SETDATA", payload: { "name": "office365TenantId", "value": !!response.data.data?.office365TenantId ? response.data.data?.office365TenantId : '' } })
            dispatch({ type: "SETDATA", payload: { "name": "office365Secret", "value": !!response.data.data?.office365ClientSecret ? response.data.data?.office365ClientSecret : '' } })

            dispatch({ type: "SETDATA", payload: { "name": "isOfficeGoogleEnable", "value": response.data.data.isOfficeGoogleEnable ? true : false } })

            // dispatch({ type: "SETDATA", payload: { "name": "isMacSecurityEnable", "value": response.data.data.isMacSecurityEnable ? true : false } })
            // dispatch({ type: "SETDATA", payload: { "name": "isRoundRobinEnable", "value": response.data.data.isRoundRobinEnable ? true : false } })
            // dispatch({ type: "SETDATA", payload: { "name": "isClassEnable", "value": response.data.data.isClassEnable ? true : false } })
            // dispatch({ type: "SETDATA", payload: { "name": "isSecurityEnable", "value": response.data.data.isSecurityEnable ? true : false } })
            // dispatch({ type: "SETDATA", payload: { "name": "isRegionEnable", "value": response.data.data.isRegionEnable ? true : false } })

            dispatch({ type: "SETDATA", payload: { "name": "organizationName", "value": response.data.data.organisationName } })

            // dispatch({ type: "SETDATA", payload: { "name": "twilioNumber", "value": response.data.data.userSettings.twilioNumber } })
            // dispatch({ type: "SETDATA", payload: { "name": "twilioAccountSid", "value": response.data.data.userSettings.twilioAccountSid } })
            // dispatch({ type: "SETDATA", payload: { "name": "twilioAuthToken", "value": response.data.data.userSettings.twilioAuthToken } })

            dispatch({ type: "SETDATA", payload: { "name": "subscriptionType", "value": response.data.data.subscription && response.data.data.subscription.subscriptionPackage && response.data.data.subscription.subscriptionPackage.packageName ? response.data.data.subscription.subscriptionPackage.packageName : '' } })
            dispatch({ type: "SETDATA", payload: { "name": "subscriptionExpiredDate", "value": response.data.data.subscription && response.data.data.subscription.subscriptionExpiredDate && new Date(response.data.data.subscription.subscriptionExpiredDate) } })
            dispatch({ type: "SETDATA", payload: { "name": "allocateSeat", "value": response.data.data.subscription && response.data.data.subscription.allocatedSeat ? response.data.data.subscription.allocatedSeat : '' } })

            dispatch({ type: "SETDATA", payload: { "name": "addressLine1", "value": response.data.data.addressList && response.data.data.addressList.length > 0 && response.data.data.addressList[0].addressLine1 ? response.data.data.addressList[0].addressLine1 : '' } })
            dispatch({ type: "SETDATA", payload: { "name": "addressLine2", "value": response.data.data.addressList && response.data.data.addressList.length > 0 && response.data.data.addressList[0].addressLine2 ? response.data.data.addressList[0].addressLine2 : '' } })

            dispatch({ type: "SETDATA", payload: { "name": "profileCity", "value": response.data.data.addressList && response.data.data.addressList.length > 0 && response.data.data.addressList[0].city ? response.data.data.addressList[0].city : '' } })
            dispatch({ type: "SETDATA", payload: { "name": "profileState", "value": response.data.data.addressList && response.data.data.addressList.length > 0 && response.data.data.addressList[0].state ? response.data.data.addressList[0].state : '' } })
            dispatch({ type: "SETDATA", payload: { "name": "comnpanyCountry", "value": response.data.data.addressList && response.data.data.addressList.length > 0 && response.data.data.addressList[0].country ? response.data.data.addressList[0].country : '' } })
            dispatch({ type: "SETDATA", payload: { "name": "comnpanyZip", "value": response.data.data.addressList && response.data.data.addressList.length > 0 && response.data.data.addressList[0].zipcode ? response.data.data.addressList[0].zipcode : '' } })

            dispatch({ type: "SETDATA", payload: { "name": "timezone", "value": response.data.data.timezone ? response.data.data.timezone : '' } })

            //AWS details
            // dispatch({ type: "SETDATA", payload: { "name": "awsUser", "value": response.data.data.awsUser ? response.data.data.awsUser : '' } })
            // dispatch({ type: "SETDATA", payload: { "name": "accessKeyID", "value": response.data.data.accessKeyID ? response.data.data.accessKeyID : '' } })
            // dispatch({ type: "SETDATA", payload: { "name": "secretAccessKey", "value": response.data.data.secretAccessKey ? response.data.data.secretAccessKey : '' } })
            // dispatch({ type: "SETDATA", payload: { "name": "bucket", "value": response.data.data.bucket ? response.data.data.bucket : '' } })
            // dispatch({ type: "SETDATA", payload: { "name": "region", "value": response.data.data.region ? response.data.data.region : '' } })
        }

    }

    const getStateList = async () => {
        const response = await StateList();
        console.log(response);
        if (response.status === 200) {
            dispatch({ type: "SETDATA", payload: { "name": "StateList", "value": response.data.data } })
        }
    }
    const getSubscriptionList = async () => {
        const response = await SubscriptionList();
        console.log(response);
        if (response.status === 200) {
            console.log('Country List fetched');
            dispatch({ type: "SETDATA", payload: { "name": "SubscriptionsList", "value": response.data.data } })
        }
    }
    const timeZoneValue = (timezone) => {
        if (timezone) {
            let withoutGmt = timezone.split('GMT')[1]
            let hoursWithMints = withoutGmt.split(')')[0]
            let sign = hoursWithMints.charAt(0)
            let timeTotal
            if (sign === '+') {
                timeTotal = parseInt(hoursWithMints.substring(1).split(':')[0]) * 60 + parseInt(hoursWithMints.substring(1).split(':')[1])
            } else {
                timeTotal = parseInt(hoursWithMints.substring(1).split(':')[0]) * 60 - parseInt(hoursWithMints.substring(1).split(':')[1])
            }
            // console.log(`${sign}${timeTotal}`)
            return `${sign}${timeTotal}`
        }


    }
    const onProfileUpdate = async (e) => {
        e.preventDefault();
        let validationStatus = await getValidation();

        if (validationStatus) {
            let response
            let payload
            if (state.editId) {
                payload = {
                    id: state.editId ? state.editId : undefined,
                    adminLogo: state.profilePhoto && state.profilePhoto.logo ? state.profilePhoto.logo : "",
                    firstname: state.firstName,
                    middlename: state.middleName,
                    lastname: state.lastName,
                    email: state.email.toLowerCase(),
                    "role": "Admin",

                    // twilioNumber: state.twilioNumber,
                    // twilioAccountSid: state.twilioAccountSid,
                    // twilioAuthToken: state.twilioAuthToken,

                    googleClientId: state.googleClientId,
                    googleClientSecret: state.googleClientSecret,

                    office365ClientId: state.office365ClientId,
                    office365TenantId: state.office365TenantId,
                    office365ClientSecret: state.office365Secret,

                    isOfficeGoogleEnable: state.isOfficeGoogleEnable,

                    // isMacSecurityEnable: state.isMacSecurityEnable,
                    // macSecurityRequest: {
                    //     isRoundRobinEnable: state.isRoundRobinEnable,
                    //     isClassEnable: state.isClassEnable,
                    //     isSecurityEnable: state.isSecurityEnable,
                    //     isRegionEnable: state.isRegionEnable,
                    // },


                    selectedSubscription: state.subscriptionType,
                    // accountID: '',
                    allocatedSeat: state.allocateSeat,
                    subscriptionExpiredDate: state.subscriptionExpiredDate,
                    phoneNumber: state.phoneNo,
                    organisationName: state.organizationName,
                    city: state.profileCity,
                    addressline1: state.addressLine1,
                    addressline2: state.addressLine2,
                    zipcode: state.comnpanyZip,
                    // company_phone: state.comnpanyPhone,
                    country: parseInt(226),
                    state: state.profileState,

                    timezone: state.timezone,
                    timezoneValue: timeZoneValue(state.timezone),

                    // awsUser: state.awsUser,
                    // accessKeyID: state.accessKeyID,
                    // secretAccessKey: state.secretAccessKey,
                    // bucket: state.bucket,
                    // region: state.region,

                    typeAddress: 1

                };
                dispatch({ type: 'LOAD', payload: true });
                response = await UpdateAdminAccount(payload);
            } else {
                payload = {
                    firstname: state.firstName,
                    middlename: state.middleName,
                    lastname: state.lastName,
                    // profile_image: state.profilePhoto,
                    email: state.email.toLowerCase(),
                    // password: state.password,
                    "empID": "",
                    "title": "",
                    "type": "",
                    "typeData": "",
                    "role": "Admin",
                    // twilioNumber: state.twilioNumber,
                    // twilioAccountSid: state.twilioAccountSid,
                    // twilioAuthToken: state.twilioAuthToken,

                    googleClientId: state.googleClientId,
                    googleClientSecret: state.googleClientSecret,

                    office365ClientId: state.office365ClientId,
                    office365TenantId: state.office365TenantId,
                    office365ClientSecret: state.office365Secret,

                    isOfficeGoogleEnable: state.isOfficeGoogleEnable,

                    isMacSecurityEnable: state.isMacSecurityEnable,
                    macSecurityRequest: {
                        isRoundRobinEnable: state.isRoundRobinEnable,
                        // isClassEnable: state.isClassEnable,
                        isSecurityEnable: state.isSecurityEnable,
                        isRegionEnable: state.isRegionEnable,
                        isReportEnable: state.isReportEnable,
                    },


                    selectedSubscription: state.subscriptionType,
                    accountID: '',
                    allocatedSeat: state.allocateSeat,
                    subscriptionExpiredDate: state.subscriptionExpiredDate,
                    phoneNumber: state.phoneNo,
                    organisationName: state.organizationName,
                    city: state.profileCity,
                    addressline1: state.addressLine1,
                    addressline2: state.addressLine2,
                    zipcode: state.comnpanyZip,
                    // company_phone: state.comnpanyPhone,
                    country: parseInt(226),
                    state: state.profileState,
                    typeAddress: 1,

                    timezone: state.timezone,
                    timezoneValue: timeZoneValue(state.timezone),

                    "orgTypeId": "1",
                    "userType": "I",

                    // awsUser: state.awsUser,
                    // accessKeyID: state.accessKeyID,
                    // secretAccessKey: state.secretAccessKey,
                    // bucket: state.bucket,
                    // region: state.region,
                };
                dispatch({ type: 'LOAD', payload: true });
                response = await CreateNewAccount(payload);
            }
            if (response && response.status === 200) {
                if (response.data.status === 200) {
                    dispatch({ type: 'LOAD', payload: false });
                    if (state.editId) {
                        ToastHot.success('Successfully account updated.')
                    } else {
                        ToastHot.success('Successfully account added.')
                    }
                    history.push(`/user/all-accounts`)
                } else {
                    if (response.data.status === 400) {
                        dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistEmail', value: true } });
                    }
                    dispatch({ type: 'LOAD', payload: false });
                }
            } else {
                dispatch({ type: 'LOAD', payload: false });
                // toast.error("Something went wrong");
                console.log('Error');
            }
        }
    };

    const getValidation = () => {
        return new Promise((resolve, reject) => {
            if (Validation.text(state.firstName) &&
                // Validation.nameFields(state.firstName) &&
                // Validation.nameFields(state.lastName) &&
                Validation.text(state.lastName) &&
                Validation.text(state.email) &&
                Validation.email(state.email.toLowerCase()) &&
                Validation.text(state.phoneNo) &&
                Validation.mobile(state.phoneNo) &&
                Validation.text(state.organizationName) &&
                Validation.text(state.subscriptionType) &&

                // Validation.text(state.password) &&
                Validation.text(state.addressLine1) &&
                // Validation.text(state.comnpanyCountry) &&
                Validation.text(state.profileCity) &&
                Validation.text(state.profileState) &&
                Validation.text(state.comnpanyZip) &&
                Validation.text(state.timezone)

            ) {
                resolve(true)
            } else {
                if (!Validation.text(state.firstName)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'firstNameErrBlank', value: true } })
                }
                // else if (!Validation.nameFields(state.firstName)) {
                //     dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validFirstNameError', value: true } });
                //     console.log('firstname Errs')
                // }
                if (!Validation.text(state.lastName)) {
                    console.log('lastname Blank')
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'lastNameErrBlank', value: true } });
                }
                // else if (!Validation.nameFields(state.lastName)) {
                //     dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validLastNameError', value: true } });
                //     console.log('lastName Name')
                // }

                if (!Validation.text(state.email)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'emailErrBlank', value: true } });
                }
                else if (!Validation.email(state.email.toLowerCase())) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidEmail', value: true } });
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistEmail', value: false } });
                }

                if (!Validation.text(state.phoneNo)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'phoneErrBlank', value: true } });
                    console.log('phone')
                }
                else if (!Validation.mobile(state.phoneNo)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidPhone', value: true } });
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistPhone', value: false } });
                }

                if (!Validation.text(state.organizationName)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyError', value: true } });
                    console.log('organizationName')
                }
                if (!Validation.text(state.subscriptionType)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'subscriptionTypesErrBlank', value: true } });
                    console.log('organizationName')
                }

                // if (!Validation.text(state.password)) {
                //     dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'passwordErrBlank', value: true } });
                //     console.log('organizationName')
                // }

                if (!Validation.text(state.addressLine1)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyAddressErrBlank', value: true } });
                    console.log('organizationName')
                }
                // if (!Validation.text(state.comnpanyCountry)) {
                //     dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyCountryErrBlank', value: true } });
                //     console.log('comnpanyCountry')
                // }
                if (!Validation.text(state.profileCity)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'cityErrBlank', value: true } });
                    console.log('profileCity')
                }
                if (!Validation.text(state.comnpanyZip)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'zipErrBlank', value: true } });
                }
                if (!Validation.text(state.profileState)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyStateErrBlank', value: true } });
                    console.log('profileState')
                }
                if (!Validation.text(state.timezone)) {
                    dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'timezoneErrBlank', value: true } });
                    console.log('firstname')
                    // } else if (!Validation.nameFields(state.firstName)) {
                    //     dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validFirstnameError', value: true } });
                    //     console.log('firstname')
                }
                resolve(false)
            }
        });
    }

    const ImageFileUpload = async (file) => {
        try {
            dispatch({ type: "SETDATA", payload: { name: "loadingForProfilePicture", value: true } });

            let res = await UploadProfilePicture(file, state.editId);
            if (res.data.status === 200 && res.data.data) {
                dispatch({ type: "SETDATA", payload: { name: "profilePhoto", value: res.data.data } });
                dispatch({ type: "SETDATA", payload: { name: "loadingForProfilePicture", value: false } });
            } else {
                dispatch({ type: "SETDATA", payload: { name: "loadingForProfilePicture", value: false } });
                ToastHot.error("Profile upload failed");
            }
        } catch (error) {
            dispatch({ type: "SETDATA", payload: { name: "loadingForProfilePicture", value: false } });
            ToastHot.error("Profile upload failed");
        }
    };






    // OnChange Func
    const getData = (e) => {
        //OnChanges
        if (e.target.name === "firstName") {



            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'firstNameErrBlank', value: true } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validFirstNameError', value: false } });
                console.log('firstname Err')

                // } else if (!Validation.nameFields(e.target.value)) {
                //     dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'firstNameErrBlank', value: false } });
                //     dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validFirstNameError', value: true } });
                //     console.log('firstname Valids')
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'firstNameErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validFirstNameError', value: false } });
            }
        }
        if (e.target.name === "lastName") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'lastNameErrBlank', value: true } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validLastNameError', value: false } });
                // } else if (!Validation.nameFields(e.target.value)) {
                //     dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'lastNameErrBlank', value: false } });
                //     dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validLastNameError', value: true } });
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'lastNameErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'validLastNameError', value: false } });
            }
        }

        if (e.target.name === "email") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'emailErrBlank', value: true } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidEmail', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistEmail', value: false } });
                console.log('emails ')
            }
            else if (!Validation.email(e.target.value.toLowerCase())) {
                console.log('email2 Err')
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'emailErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidEmail', value: true } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistEmail', value: false } });
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'emailErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidEmail', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistEmail', value: false } });
            }
        }

        if (e.target.name === "subscriptionType") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'subscriptionTypesErrBlank', value: true } });
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'subscriptionTypesErrBlank', value: false } });
            }
        }
        if (e.target.name === "organizationName") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyError', value: true } });
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyError', value: false } });
            }
        }

        if (e.target.name === "addressLine1") {


            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyAddressErrBlank', value: true } });
                console.log('organizationName')
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyAddressErrBlank', value: false } });
            }
        }
        if (e.target.name === "profileCity") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'cityErrBlank', value: true } });
                console.log('profileCity')


            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'cityErrBlank', value: false } });
            }
        }
        // if (e.target.name === "comnpanyCountry") {
        //     if (!Validation.text(e.target.value)) {
        //         dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyCountryErrBlank', value: true } });
        //         console.log('comnpanyCountry')
        //     } else {
        //         dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyCountryErrBlank', value: false } });
        //     }
        // }
        if (e.target.name === "profileState") {
            if (!Validation.text(e.target.value)) {


                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyStateErrBlank', value: true } });
                console.log('profileState')

            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyStateErrBlank', value: false } });
            }

        }
        if (e.target.name === "comnpanyZip") {


            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'zipErrBlank', value: true } });
                console.log('comnpanyZip')
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'zipErrBlank', value: false } });
            }
        }
        // if (e.target.name === "organizationName") {
        //   dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyError', value: false } });
        // }

        // if (e.target.name === "password") {
        //     if (!Validation.text(e.target.value)) {
        //         dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'passwordErrBlank', value: true } });
        //     } else {
        //         dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'passwordErrBlank', value: false } });
        //     }
        // }

        // if (e.target.name === "comnpanyPhone") {
        //     dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyPhoneErrBlank', value: false } });
        //     dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'companyIsValidPhone', value: false } });
        // }
        if (e.target.name === "timezone") {
            if (!Validation.text(e.target.value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'timezoneErrBlank', value: true } });
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'timezoneErrBlank', value: false } });
            }
        }
        if (e.target.name === "phoneNo") {
            let value
            value = e.target.value.replace(/[^0-9]/ig, '')
            if (!Validation.text(value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'phoneErrBlank', value: true } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidPhone', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistPhone', value: false } });
            }
            else if (!Validation.mobile(value)) {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'phoneErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidPhone', value: true } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistPhone', value: false } });
                console.log('valid phonfe')
            } else {
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'phoneErrBlank', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsValidPhone', value: false } });
                dispatchForErr({ type: 'VALIDATECHECK', payload: { name: 'IsExistPhone', value: false } });
            }
            dispatch({ type: "SETDATA", payload: { "name": "phoneNo", "value": value } })
        } else {
            dispatch({ type: "ONCHANGE", payload: e })
        }

    }
    const uploadImage = async (e) => {

        const file = e.target.files[0];
        const totalFiles = file ? file.length : 0;

        if (totalFiles === 0) return;

        // await files.forEach((file, index) => {

        let checkImageSize = ImageFormat.fileUploadSize(file.size)
        let fileParts = file.name.split('.');
        let fileType = fileParts[fileParts.length - 1];
        let fileSize = file.size;
        let fileName = fileParts[0];

        let checkImageFormat = ImageFormat.imageCheck(fileType)
        if (!checkImageSize) {
            toast.error('File size must be under 5 MB, Please Try Again', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        if (!checkImageFormat) {
            toast.error('Wrong File Type Uploaded, Please Try Again', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        dispatch({ type: "SETDATA", payload: { "name": "loadingForProfilePicture", "value": true } })
        ImageFileUpload(file)// General Image upload fuction
        // console.log(uploadStatus)
        // if (uploadStatus) {
        //     dispatch({ type: "SETDATA", payload: { "name": "profilePhoto", "value": uploadStatus } })
        //     dispatch({ type: "SETDATA", payload: { "name": "loadingForProfilePicture", "value": false } })
        // } else {
        //     console.log("Error")
        //     dispatch({ type: "SETDATA", payload: { "name": "loadingForProfilePicture", "value": false } })
        // }
    }

    console.log("State for Dahboard Page-----", state)
    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>


            <div className="createNewAccountPage">
                <div className="createNewAccountInner">
                    <h1>{state.editId ? 'Update Account' : 'Create Account'}</h1>
                    <form>
                        <div className="row">

                            {state.editId &&
                                <div className="col-12 col-md-12">
                                    <div className="myProfile-uploader1">
                                        <figure>
                                            {state.profilePhoto?.profilePictureLink ?
                                                !state.loadingForProfilePicture ? <img src={state.profilePhoto.profilePictureLink} /> : <LoadingScreen />
                                                : <img src="../images/default-user-img.svg" alt="" />
                                            }
                                            <figcaption>
                                                <img src="/images/camera-icon2.svg" />
                                                <span>Change Photo</span>
                                                <input type="file" onChange={(e) => uploadImage(e)}></input>
                                            </figcaption>
                                        </figure>
                                    </div>
                                </div>
                            }
                            <div class="col-md-12"><h4>Actount Information</h4></div>
                            <div className="col-md-12">
                                <div className="formGroup">
                                    <div className='label-with-star-mark'>
                                        <label>Organization Name </label>
                                        <span>*</span>
                                    </div>
                                    <div className="inputgroup inputgroupRight">
                                        <input type="text"
                                            id="organizationName"
                                            // disabled
                                            value={state.organizationName}
                                            onChange={getData}
                                            name="organizationName"
                                            placeholder=""
                                            className={(stateForErr.companyError) ? "form-control red-border" : "form-control"}
                                        />
                                        <img src="/images/brifcase.svg" class="rightSide" />
                                    </div>
                                    {stateForErr.companyError &&
                                        <p className="error-msg">Organization Name is required.</p>
                                    }
                                </div>
                            </div>



                            <div class="col-md-12"><h4>Subscription</h4></div>

                            <div className="col-md-6">
                                <div className="formGroup">
                                    <div className='label-with-star-mark'>
                                        <label>Subsciption Type</label>
                                        <span>*</span>
                                    </div>
                                    <div className="inputgroup inputgroupRight">
                                        <select
                                            className={(stateForErr.subscriptionTypesErrBlank) ? "form-control red-border" : "form-control"}
                                            id="subscriptionType"
                                            value={state.subscriptionType}
                                            // disabled={state.editId && true}
                                            onChange={getData}
                                            name="subscriptionType">
                                            <option value="">Select...</option>
                                            {/* <option value="ss">S1</option> */}
                                            {state.SubscriptionsList && state.SubscriptionsList.length > 0 &&
                                                state.SubscriptionsList.map((data, index) =>
                                                    <option key={index} value={data.packageName}>{data.packageName}</option>)
                                            }
                                        </select>
                                        {stateForErr.subscriptionTypesErrBlank &&
                                            <p className="error-msg">Subsciption Type is required.</p>
                                        }
                                        {/* <img src="/images/coin.svg" class="rightSide" /> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="formGroup">
                                    <label>Subscription Expiration</label>
                                    <div className="inputgroup inputgroupRight">
                                        <DatePicker className="form-control"
                                            // disabled={state.editId && true}
                                            selected={state.subscriptionExpiredDate}
                                            // onSelect={state.textScheduleDate} //when day is clicked
                                            onChange={(date) => dispatch({ type: "SETDATA", payload: { "name": "subscriptionExpiredDate", "value": date } })} //only when value has changed
                                        />
                                        {/* <input type="text"
                                            id="subscriptionExpiredDate"
                                            value={state.subscriptionExpiredDate}
                                            onChange={getData}
                                            name="subscriptionExpiredDate"
                                            className="form-control" placeholder="" /> */}
                                        <img src="/images/coin.svg" class="rightSide" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="formGroup">
                                    <label>Allocated Seats</label>
                                    <div className="inputgroup inputgroupRight">
                                        <input type="number"
                                            id="allocateSeat"
                                            value={state.allocateSeat}
                                            onChange={getData}
                                            name="allocateSeat"
                                            className="form-control" placeholder="" />
                                        <img src="/images/armchair.svg" class="rightSide" />
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12"><h4>Address</h4></div>

                            <div className="col-md-6">
                                <div className="formGroup">
                                    <div className='label-with-star-mark'>
                                        <label>Address Line 1</label>
                                        <span>*</span>
                                    </div>
                                    <input type="text"
                                        id="addressLine1"
                                        value={state.addressLine1}
                                        onChange={getData}
                                        name="addressLine1"
                                        placeholder=""
                                        className={(stateForErr.companyAddressErrBlank) ? "form-control red-border" : "form-control"}
                                    />
                                    {stateForErr.companyAddressErrBlank &&
                                        <p className="error-msg">Address Line 1 is required.</p>
                                    }
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="formGroup">
                                    <label>Address Line 2</label>
                                    <input type="text"
                                        id="addressLine2"
                                        value={state.addressLine2}
                                        onChange={getData}
                                        name="addressLine2"
                                        className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="formGroup">
                                    <div className='label-with-star-mark'>
                                        <label>City</label>
                                        <span>*</span>
                                    </div>
                                    <input type="text" id="profileCity"
                                        value={state.profileCity}
                                        onChange={getData}
                                        name="profileCity"
                                        placeholder=""
                                        className={(stateForErr.cityErrBlank) ? "form-control red-border" : "form-control"}
                                    />
                                    {stateForErr.cityErrBlank &&
                                        <p className="error-msg">City is required.</p>
                                    }
                                </div>
                            </div>
                            {/* <div className="col-md-6">
                                <div className="formGroup">
                                    <label>State</label>
                                    <input
                                        type="text" id="profileState"
                                        value={state.profileState}
                                        onChange={getData}
                                        name="profileState"
                                        className={(stateForErr.companyStateErrBlank) ? "form-control red-border" : "form-control"}
                                    >
                                    </input>
                                    {stateForErr.companyStateErrBlank &&
                                        <p className="error-msg">State is required.</p>
                                    }

                                </div>
                            </div> */}
                            <div className="col-md-6">
                                <div className="formGroup">
                                    <div className='label-with-star-mark'>
                                        <label>State</label>
                                        <span>*</span>
                                    </div>
                                    <select
                                        className={(stateForErr.companyStateErrBlank) ? "form-control red-border" : "form-control"}
                                        id="profileState"
                                        value={state.profileState}
                                        onChange={getData}
                                        name="profileState">
                                        <option value="">Select...</option>
                                        {state.StateList.map((data, index) =>
                                            <option key={index} value={data.stateName}>{data.stateName}</option>)
                                        }
                                    </select>
                                    {stateForErr.companyStateErrBlank &&
                                        <p className="error-msg">State is required.</p>
                                    }
                                </div>
                            </div>
                            {/* <div className="col-md-6">
                                <div className="formGroup">
                                    <label>Country</label>
                                    <select
                                        className={(stateForErr.companyCountryErrBlank) ? "form-control red-border" : "form-control"}
                                        id="comnpanyCountry"
                                        value={state.comnpanyCountry}
                                        onChange={getData}
                                        name="comnpanyCountry">
                                        <option value="">Select...</option>
                                        {state.CountryList.map((data, index) =>
                                            <option key={index} value={data.id}>{data.name}</option>)
                                        }
                                    </select>
                                    {stateForErr.companyCountryErrBlank &&
                                        <p className="error-msg">Country is required.</p>
                                    }
                                </div>
                            </div> */}
                            <div className="col-md-6">
                                <div className="formGroup">
                                    <div className='label-with-star-mark'>
                                        <label>Zip Code</label>
                                        <span>*</span>
                                    </div>
                                    <input type="number" id="comnpanyZip"
                                        value={state.comnpanyZip}
                                        onChange={getData}
                                        name="comnpanyZip"
                                        placeholder=""
                                        className={(stateForErr.zipErrBlank) ? "form-control red-border" : "form-control"}
                                    />
                                    {stateForErr.zipErrBlank &&
                                        <p className="error-msg">Zip is required.</p>
                                    }
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="formGroup">
                                    <div className='label-with-star-mark'>
                                        <label>Timezone</label>
                                        <span>*</span>
                                    </div>
                                    <div className="inputgroup">
                                        <select
                                            className={(stateForErr.timezoneErrBlank) ? "form-control red-border" : "form-control"}
                                            name="timezone"
                                            id="timezone"
                                            value={state.timezone}
                                            onChange={getData}
                                        >
                                            <option value=''>Select</option>
                                            {/* {  TimezoneCollection.map((data,index) => (
                                             <option key={index} value={data.value}>{data.key}</option>)
                                       )} */}
                                            <option value="(GMT-11:00) Pacific/Midway">(GMT-11:00) Midway Island, Samoa</option>
                                            <option value="(GMT-10:00) America/Adak">(GMT-10:00) Hawaii-Aleutian</option>
                                            <option value="(GMT-10:00) Etc/GMT+10">(GMT-10:00) Hawaii</option>
                                            <option value="(GMT-09:30) Pacific/Marquesas">(GMT-09:30) Marquesas Islands</option>
                                            <option value="(GMT-09:00) Pacific/Gambier">(GMT-09:00) Gambier Islands</option>
                                            <option value="(GMT-09:00) America/Anchorage">(GMT-09:00) Alaska</option>
                                            <option value="(GMT-08:00) America/Ensenada">(GMT-08:00) Tijuana, Baja California</option>
                                            <option value="(GMT-08:00) Etc/GMT+8">(GMT-08:00) Pitcairn Islands</option>
                                            <option value="(GMT-08:00) America/Los_Angeles">(GMT-08:00) Pacific Time (US & Canada)</option>
                                            <option value="(GMT-07:00) America/Denver">(GMT-07:00) Mountain Time (US & Canada)</option>
                                            <option value="(GMT-07:00) America/Chihuahua">(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
                                            <option value="(GMT-07:00) America/Dawson_Creek">(GMT-07:00) Arizona</option>
                                            <option value="(GMT-06:00) America/Belize">(GMT-06:00) Saskatchewan, Central America</option>
                                            <option value="(GMT-06:00) America/Cancun">(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
                                            <option value="(GMT-06:00) Chile/EasterIsland">(GMT-06:00) Easter Island</option>
                                            <option value="(GMT-06:00) America/Chicago">(GMT-06:00) Central Time (US & Canada)</option>
                                            <option value="(GMT-05:00) America/New_York">(GMT-05:00) Eastern Time (US & Canada)</option>
                                            <option value="(GMT-05:00) America/Havana">(GMT-05:00) Cuba</option>
                                            <option value="(GMT-05:00) America/Bogota">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
                                            <option value="(GMT-04:30) America/Caracas">(GMT-04:30) Caracas</option>
                                            <option value="(GMT-04:00) America/Santiago">(GMT-04:00) Santiago</option>
                                            <option value="(GMT-04:00) America/La_Paz">(GMT-04:00) La Paz</option>
                                            <option value="(GMT-04:00) Atlantic/Stanley">(GMT-04:00) Faukland Islands</option>
                                            <option value="(GMT-04:00) America/Campo_Grande">(GMT-04:00) Brazil</option>
                                            <option value="(GMT-04:00) America/Goose_Bay">(GMT-04:00) Atlantic Time (Goose Bay)</option>
                                            <option value="(GMT-04:00) America/Glace_Bay">(GMT-04:00) Atlantic Time (Canada)</option>
                                            <option value="(GMT-03:30) America/St_Johns">(GMT-03:30) Newfoundland</option>
                                            <option value="(GMT-03:00) America/Araguaina">(GMT-03:00) UTC-3</option>
                                            <option value="(GMT-03:00) America/Montevideo">(GMT-03:00) Montevideo</option>
                                            <option value="(GMT-03:00) America/Miquelon">(GMT-03:00) Miquelon, St. Pierre</option>
                                            <option value="(GMT-03:00) America/Godthab">(GMT-03:00) Greenland</option>
                                            <option value="(GMT-03:00) America/Argentina/Buenos_Aires">(GMT-03:00) Buenos Aires</option>
                                            <option value="(GMT-03:00) America/Sao_Paulo">(GMT-03:00) Brasilia</option>
                                            <option value="(GMT-02:00) America/Noronha">(GMT-02:00) Mid-Atlantic</option>
                                            <option value="(GMT-01:00) Atlantic/Cape_Verde">(GMT-01:00) Cape Verde Is.</option>
                                            <option value="(GMT-01:00) Atlantic/Azores">(GMT-01:00) Azores</option>
                                            {/* <option value="Europe/Belfast">(GMT) Greenwich Mean Time : Belfast</option>
                                            <option value="Europe/Dublin">(GMT) Greenwich Mean Time : Dublin</option>
                                            <option value="Europe/Lisbon">(GMT) Greenwich Mean Time : Lisbon</option>
                                            <option value="Europe/London">(GMT) Greenwich Mean Time : London</option>
                                            <option value="Africa/Abidjan">(GMT) Monrovia, Reykjavik</option> */}
                                            <option value="(GMT+01:00) Europe/Amsterdam">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
                                            <option value="(GMT+01:00) Europe/Belgrade">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option>
                                            <option value="(GMT+01:00) Europe/Brussels">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
                                            <option value="(GMT+01:00) Africa/Algiers">(GMT+01:00) West Central Africa</option>
                                            <option value="(GMT+01:00) Africa/Windhoek">(GMT+01:00) Windhoek</option>
                                            <option value="(GMT+02:00) Asia/Beirut">(GMT+02:00) Beirut</option>
                                            <option value="(GMT+02:00) Africa/Cairo">(GMT+02:00) Cairo</option>
                                            <option value="(GMT+02:00) Asia/Gaza">(GMT+02:00) Gaza</option>
                                            <option value="(GMT+02:00) Africa/Blantyre">(GMT+02:00) Harare, Pretoria</option>
                                            <option value="(GMT+02:00) Asia/Jerusalem">(GMT+02:00) Jerusalem</option>
                                            <option value="(GMT+02:00) Europe/Minsk">(GMT+02:00) Minsk</option>
                                            <option value="(GMT+02:00) Asia/Damascus">(GMT+02:00) Syria</option>
                                            <option value="(GMT+03:00) Europe/Moscow">(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
                                            <option value="(GMT+03:00) Africa/Addis_Ababa">(GMT+03:00) Nairobi</option>
                                            <option value="(GMT+03:30) Asia/Tehran">(GMT+03:30) Tehran</option>
                                            <option value="(GMT+04:00) Asia/Dubai">(GMT+04:00) Abu Dhabi, Muscat</option>
                                            <option value="(GMT+04:00) Asia/Yerevan">(GMT+04:00) Yerevan</option>
                                            <option value="(GMT+04:30) Asia/Kabul">(GMT+04:30) Kabul</option>
                                            <option value="(GMT+05:00) Asia/Yekaterinburg">(GMT+05:00) Ekaterinburg</option>
                                            <option value="(GMT+05:00) Asia/Tashkent">(GMT+05:00) Tashkent</option>
                                            <option value="(GMT+05:30) Asia/Kolkata">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                                            <option value="(GMT+05:45) Asia/Katmandu">(GMT+05:45) Kathmandu</option>
                                            <option value="(GMT+06:00) Asia/Dhaka">(GMT+06:00) Astana, Dhaka</option>
                                            <option value="(GMT+06:00) Asia/Novosibirsk">(GMT+06:00) Novosibirsk</option>
                                            <option value="(GMT+06:30) Asia/Rangoon">(GMT+06:30) Yangon (Rangoon)</option>
                                            <option value="(GMT+07:00) Asia/Bangkok">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                                            <option value="(GMT+07:00) Asia/Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option>
                                            <option value="(GMT+08:00) Asia/Hong_Kong">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
                                            <option value="(GMT+08:00) Asia/Irkutsk">(GMT+08:00) Irkutsk, Ulaan Bataar</option>
                                            <option value="(GMT+08:00) Australia/Perth">(GMT+08:00) Perth</option>
                                            <option value="(GMT+08:45) Australia/Eucla">(GMT+08:45) Eucla</option>
                                            <option value="(GMT+09:00) Asia/Tokyo">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
                                            <option value="(GMT+09:00) Asia/Seoul">(GMT+09:00) Seoul</option>
                                            <option value="(GMT+09:00) Asia/Yakutsk">(GMT+09:00) Yakutsk</option>
                                            <option value="(GMT+09:30) Australia/Adelaide">(GMT+09:30) Adelaide</option>
                                            <option value="(GMT+09:30) Australia/Darwin">(GMT+09:30) Darwin</option>
                                            <option value="(GMT+10:00) Australia/Brisbane">(GMT+10:00) Brisbane</option>
                                            <option value="(GMT+10:00) Australia/Hobart">(GMT+10:00) Hobart</option>
                                            <option value="(GMT+10:00) Asia/Vladivostok">(GMT+10:00) Vladivostok</option>
                                            <option value="(GMT+10:30) Australia/Lord_Howe">(GMT+10:30) Lord Howe Island</option>
                                            <option value="(GMT+11:00) Etc/GMT-11">(GMT+11:00) Solomon Is., New Caledonia</option>
                                            <option value="(GMT+11:00) Asia/Magadan">(GMT+11:00) Magadan</option>
                                            <option value="(GMT+11:30) Pacific/Norfolk">(GMT+11:30) Norfolk Island</option>
                                            <option value="(GMT+12:00) Asia/Anadyr">(GMT+12:00) Anadyr, Kamchatka</option>
                                            <option value="(GMT+12:00) Pacific/Auckland">(GMT+12:00) Auckland, Wellington</option>
                                            <option value="(GMT+12:00) Etc/GMT-12">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
                                            <option value="(GMT+12:45) Pacific/Chatham">(GMT+12:45) Chatham Islands</option>
                                            <option value="(GMT+13:00) Pacific/Tongatapu">(GMT+13:00) Nuku'alofa</option>
                                            <option value="(GMT+14:00) Pacific/Kiritimati">(GMT+14:00) Kiritimati</option>
                                        </select>
                                    </div>
                                    {stateForErr.timezoneErrBlank &&
                                        <p className="error-msg">Timezone is required.</p>
                                    }
                                </div>
                            </div>
                            <div className="col-md-12">
                                <h4>Account Administrator Details</h4>
                            </div>
                            <div className="col-12">
                                <div className="name-row">
                                    <div className="name-col first-name">
                                        <div className="formGroup">
                                            <div className='label-with-star-mark'>
                                                <label>First Name</label>
                                                <span>*</span>
                                            </div>
                                            <div className="inputgroup">
                                                <input type="text"
                                                    className={(stateForErr.firstNameErrBlank || stateForErr.validFirstNameError) ? "form-control red-border" : "form-control"}
                                                    id="firstName"
                                                    value={state.firstName}
                                                    onChange={getData}
                                                    name="firstName"
                                                    placeholder=""
                                                />
                                            </div>
                                            {stateForErr.firstNameErrBlank &&
                                                <p className="error-msg">First name is required.</p>
                                            }
                                            {stateForErr.validFirstNameError &&
                                                <p className="error-msg">First name is not valid.</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="name-col middle-name">
                                        <div className="formGroup">
                                            <label>Middle Name</label>
                                            <div className="inputgroup">
                                                <input type="text"
                                                    className={"form-control"}
                                                    id="middleName"
                                                    value={state.middleName}
                                                    onChange={getData}
                                                    name="middleName"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="name-col last-name">
                                        <div className="formGroup">
                                            <div className='label-with-star-mark'>
                                                <label>Last Name</label>
                                                <span>*</span>
                                            </div>
                                            <div className="inputgroup ">
                                                <input type="text"
                                                    className={(stateForErr.lastNameErrBlank || stateForErr.validLastNameError) ? "form-control red-border" : "form-control"}
                                                    id="lastName"
                                                    value={state.lastName}
                                                    onChange={getData}
                                                    name="lastName"
                                                    placeholder=""
                                                />
                                            </div>
                                            {stateForErr.lastNameErrBlank &&
                                                <p className="error-msg">Last name is required.</p>
                                            }
                                            {stateForErr.validLastNameError &&
                                                <p className="error-msg">Last name is not valid.</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="formGroup">
                                    <div className='label-with-star-mark'>
                                        <label>Email</label>
                                        <span>*</span>
                                    </div>
                                    <div className="inputgroup inputgroupRight">
                                        <input type="text"
                                            id="email"
                                            // disabled
                                            disabled={state.editId && true}
                                            value={state.email}
                                            onChange={getData}
                                            name="email"
                                            placeholder=""
                                            className={(stateForErr.emailErrBlank || stateForErr.IsValidEmail || stateForErr.IsExistEmail) ? "form-control red-border" : "form-control"}
                                        />
                                        <img src="/images/email.svg" class="rightSide" />
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
                                    <div className='label-with-star-mark'>
                                        <label>Phone No.</label>
                                        <span>*</span>
                                    </div>
                                    <div className="inputgroup inputgroupRight">
                                        <input type="tel"
                                            id="phoneNo"
                                            value={Validation.phoneNumberFormat(state.phoneNo)}
                                            onChange={getData}
                                            name="phoneNo"
                                            // placeholder="insert phone number"
                                            className={(stateForErr.phoneErrBlank || stateForErr.IsValidPhone) ? "form-control red-border" : "form-control"}
                                        />
                                        <img src="/images/phone-icon.svg" class="rightSide" />
                                    </div>
                                    {stateForErr.phoneErrBlank &&
                                        <p className="error-msg">Phone no is required.</p>
                                    }
                                    {stateForErr.IsValidPhone &&
                                        <p className="error-msg">Phone no must be 10 digit.</p>
                                    }
                                </div>
                            </div>

                            {/* {!state.editId && */}
                            {/* <>
                                <div className="col-md-12">
                                    <h4>Twilio Integration Details</h4>
                                </div>

                                <div className='col-12 col-md-6'>
                                    <div className="formGroup">
                                        <label>My organization's Number</label>
                                        <div className="inputgroup">
                                            <input type="text"
                                                className={"form-control"}
                                                id="twilioNumber"
                                                value={state.twilioNumber}
                                                onChange={getData}
                                                name="twilioNumber"
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div className="formGroup">
                                        <label>My organization's Account Sid</label>
                                        <div className="inputgroup">
                                            <input type="password"
                                                className={"form-control"}
                                                id="twilioAccountSid"
                                                value={state.twilioAccountSid}
                                                onChange={getData}
                                                name="twilioAccountSid"
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div className="formGroup">
                                        <label>My organization's Auth Token</label>
                                        <div className="inputgroup ">
                                            <input type="password"
                                                className={"form-control"}
                                                id="twilioAuthToken"
                                                value={state.twilioAuthToken}
                                                onChange={getData}
                                                name="twilioAuthToken"
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            </> */}
                            <>
                                <div className="col-12 col-md-12">
                                    <h4 className='mb-0'>Google/Office 365 Tenant App Information.</h4>
                                </div>
                                <div className='col-12 col-md-12'>
                                    <div className="formGroup">
                                        <div className="toggle-btn-with-label">
                                            <div className="left-toggle">
                                                <input type="checkbox" className="custom-toggle-s1"
                                                    id='isOfficeGoogleEnable'
                                                    value={state.isOfficeGoogleEnable}
                                                    onChange={(e) => {
                                                        dispatch({ type: "SETDATA", payload: { "name": "isOfficeGoogleEnable", "value": e.target.checked } })

                                                        dispatch({ type: "SETDATA", payload: { "name": "googleClientId", "value": '' } })
                                                        dispatch({ type: "SETDATA", payload: { "name": "googleClientSecret", "value": '' } })


                                                        dispatch({ type: "SETDATA", payload: { "name": "office365ClientId", "value": '' } })
                                                        dispatch({ type: "SETDATA", payload: { "name": "office365TenantId", "value": '' } })
                                                        dispatch({ type: "SETDATA", payload: { "name": "office365Secret", "value": '' } })

                                                    }}
                                                    name='isOfficeGoogleEnable'
                                                    checked={state.isOfficeGoogleEnable}
                                                />
                                            </div>
                                            <div className="rg-toggle-text pl15">
                                                <label htmlFor="t2">{'Enable Google Credentials'}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-12'>
                                    <div className="formGroup">
                                        <div className="toggle-btn-with-label">
                                            <div className="left-toggle">
                                                <input type="checkbox" className="custom-toggle-s1"
                                                    id='isOfficeGoogleEnable'
                                                    value={state.isOfficeGoogleEnable ? false : true}
                                                    onChange={(e) => {
                                                        dispatch({ type: "SETDATA", payload: { "name": "isOfficeGoogleEnable", "value": !e.target.checked } })

                                                        dispatch({ type: "SETDATA", payload: { "name": "googleClientId", "value": '' } })
                                                        dispatch({ type: "SETDATA", payload: { "name": "googleClientSecret", "value": '' } })


                                                        dispatch({ type: "SETDATA", payload: { "name": "office365ClientId", "value": '' } })
                                                        dispatch({ type: "SETDATA", payload: { "name": "office365TenantId", "value": '' } })
                                                        dispatch({ type: "SETDATA", payload: { "name": "office365Secret", "value": '' } })
                                                    }}
                                                    name='isOfficeGoogleEnable'
                                                    checked={state.isOfficeGoogleEnable ? false : true}
                                                />
                                            </div>
                                            <div className="rg-toggle-text pl15">
                                                <label htmlFor="t2">{'Enable Office 365 Credentials'}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {state.isOfficeGoogleEnable
                                    ?
                                    <>
                                        <div className='col-12 col-md-6'>
                                            <div className="formGroup">
                                                <label>Google Client ID</label>
                                                <div className="inputgroup">
                                                    <input type="password"
                                                        className={"form-control"}
                                                        id="googleClientId"
                                                        value={state.googleClientId}
                                                        onChange={getData}
                                                        name="googleClientId"
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6'>
                                            <div className="formGroup">
                                                <label>Google Client Secret</label>
                                                <div className="inputgroup">
                                                    <input type="password"
                                                        className={"form-control"}
                                                        id="googleClientSecret"
                                                        value={state.googleClientSecret}
                                                        onChange={getData}
                                                        name="googleClientSecret"
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className='col-12 col-md-6'>
                                            <div className="formGroup">
                                                <label>Office 365 Client ID</label>
                                                <div className="inputgroup">
                                                    <input type="password"
                                                        className={"form-control"}
                                                        id="office365ClientId"
                                                        value={state.office365ClientId}
                                                        onChange={getData}
                                                        name="office365ClientId"
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6'>
                                            <div className="formGroup">
                                                <label>Office 365 Tenant ID</label>
                                                <div className="inputgroup ">
                                                    <input type="password"
                                                        className={"form-control"}
                                                        id="office365TenantId"
                                                        value={state.office365TenantId}
                                                        onChange={getData}
                                                        name="office365TenantId"
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6'>
                                            <div className="formGroup">
                                                <label>Office 365 Secret</label>
                                                <div className="inputgroup ">
                                                    <input type="password"
                                                        className={"form-control"}
                                                        id="office365Secret"
                                                        value={state.office365Secret}
                                                        onChange={getData}
                                                        name="office365Secret"
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }


                            </>


                        </div>
                        {/* {!state.editId &&
                            <>
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
                                                <button className="btn_genaratePass" onClick={(e)=> generateNewPass(e)}>Generate Password</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        } */}
                        {!state.editId &&
                            <>
                                <div className="col-12 col-md-12">
                                    <h4 className='mb-0'>Core Extension API</h4>
                                </div>
                                <div className='col-12 col-md-12'>
                                    <div className="formGroup">
                                        <div className="toggle-btn-with-label">
                                            <div className="left-toggle">
                                                <input type="checkbox" className="custom-toggle-s1"
                                                    id='isMacSecurityEnable'
                                                    value={state.isMacSecurityEnable}
                                                    onChange={(e) => {
                                                        dispatch({ type: "SETDATA", payload: { "name": "isMacSecurityEnable", "value": e.target.checked } })

                                                        // if (!e.target.checked) {
                                                        dispatch({ type: "SETDATA", payload: { "name": "isRoundRobinEnable", "value": e.target.checked } })
                                                        dispatch({ type: "SETDATA", payload: { "name": "isClassEnable", "value": e.target.checked } })
                                                        dispatch({ type: "SETDATA", payload: { "name": "isSecurityEnable", "value": e.target.checked } })
                                                        dispatch({ type: "SETDATA", payload: { "name": "isRegionEnable", "value": e.target.checked } })
                                                        dispatch({ type: "SETDATA", payload: { "name": "isReportEnable", "value": e.target.checked } })
                                                        // }

                                                    }}
                                                    name='isMacSecurityEnable'
                                                    checked={state.isMacSecurityEnable}
                                                />
                                            </div>
                                            <div className="rg-toggle-text pl15">
                                                <label htmlFor="t2">{!state.isMacSecurityEnable ? 'Enable Core Extension API' : 'Disable Core Extension API'}</label>
                                                {state.isMacSecurityEnable &&
                                                    <>
                                                        <div className="toggle-btn-with-label">
                                                            <div className="left-toggle">
                                                                <input type="checkbox" className="custom-toggle-s1"
                                                                    id="isRoundRobinEnable"
                                                                    value={state.isRoundRobinEnable}
                                                                    checked={state.isRoundRobinEnable}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            dispatch({ type: "SETDATA", payload: { "name": "isClassEnable", "value": e.target.checked } })
                                                                        } else {
                                                                            if (!state.isSecurityEnable && !state.isRegionEnable && !state.isReportEnable) {
                                                                                dispatch({ type: "SETDATA", payload: { "name": "isMacSecurityEnable", "value": false } })
                                                                            }
                                                                        }
                                                                        dispatch({ type: "ONCHANGE_CHECKBOX", payload: e })
                                                                    }
                                                                    }
                                                                    name="isRoundRobinEnable"
                                                                    placeholder=""
                                                                />
                                                            </div>
                                                            <div className="rg-toggle-text pl15">
                                                                <label>Enable Round Robin</label>
                                                            </div>
                                                        </div>
                                                        {/* <div className="toggle-btn-with-label">
                                                            <div className="left-toggle">
                                                                <input type="checkbox" className="custom-toggle-s1"
                                                                    id="isClassEnable"
                                                                    value={state.isClassEnable}
                                                                    checked={state.isClassEnable}
                                                                    disabled={state.isRoundRobinEnable}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            dispatch({ type: "SETDATA", payload: { "name": "isRoundRobinEnable", "value": false } })
                                                                        }
                                                                        dispatch({ type: "ONCHANGE_CHECKBOX", payload: e })
                                                                    }
                                                                    }
                                                                    name="isClassEnable"
                                                                    placeholder=""
                                                                />
                                                            </div>
                                                            <div className="rg-toggle-text pl15">
                                                                <label>Enable Case Class</label>
                                                            </div>
                                                        </div> */}
                                                        <div className="toggle-btn-with-label">
                                                            <div className="left-toggle">
                                                                <input type="checkbox" className="custom-toggle-s1"
                                                                    id="isSecurityEnable"
                                                                    checked={state.isSecurityEnable}
                                                                    value={state.isSecurityEnable}
                                                                    onChange={(e) => {
                                                                        dispatch({ type: "ONCHANGE_CHECKBOX", payload: e })
                                                                        if (!e.target.checked) {
                                                                            if (!state.isRegionEnable && !state.isRoundRobinEnable && !state.isReportEnable) {
                                                                                dispatch({ type: "SETDATA", payload: { "name": "isMacSecurityEnable", "value": false } })
                                                                            }
                                                                        }
                                                                    }}
                                                                    name="isSecurityEnable"
                                                                    placeholder=""
                                                                />
                                                            </div>
                                                            <div className="rg-toggle-text pl15">
                                                                <label>Enable Security</label>
                                                            </div>
                                                        </div>
                                                        <div className="toggle-btn-with-label">
                                                            <div className="left-toggle">
                                                                <input type="checkbox" className="custom-toggle-s1"
                                                                    id="isRegionEnable"
                                                                    checked={state.isRegionEnable}
                                                                    value={state.isRegionEnable}
                                                                    onChange={(e) => {
                                                                        dispatch({ type: "ONCHANGE_CHECKBOX", payload: e })
                                                                        if (!e.target.checked) {
                                                                            if (!state.isSecurityEnable && !state.isRoundRobinEnable && !state.isReportEnable) {
                                                                                dispatch({ type: "SETDATA", payload: { "name": "isMacSecurityEnable", "value": false } })
                                                                            }
                                                                        }
                                                                    }}
                                                                    name="isRegionEnable"
                                                                    placeholder=""
                                                                />
                                                            </div>
                                                            <div className="rg-toggle-text pl15">
                                                                <label>Enable Region</label>
                                                            </div>
                                                        </div>
                                                        <div className="toggle-btn-with-label">
                                                            <div className="left-toggle">
                                                                <input type="checkbox" className="custom-toggle-s1"
                                                                    id="isReportEnable"
                                                                    checked={state.isReportEnable}
                                                                    value={state.isReportEnable}
                                                                    onChange={(e) => {
                                                                        dispatch({ type: "ONCHANGE_CHECKBOX", payload: e })
                                                                        if (!e.target.checked) {
                                                                            if (!state.isRegionEnable && !state.isRoundRobinEnable && !state.isSecurityEnable) {
                                                                                dispatch({ type: "SETDATA", payload: { "name": "isMacSecurityEnable", "value": false } })
                                                                            }
                                                                        }
                                                                    }}
                                                                    name="isReportEnable"
                                                                    placeholder=""
                                                                />
                                                            </div>
                                                            <div className="rg-toggle-text pl15">
                                                                <label>Enable Report Access</label>
                                                            </div>
                                                        </div>

                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </>
                        }


                        {/* {state.loading && <LoadingScreen />} */}
                        <div className="row">
                            <div className="col-12">

                                <button className="themeBtn fullBtn" disabled={state.loading ? true : false} onClick={onProfileUpdate}>
                                    {
                                        state.loading ? <Loader loaderWidth={"30px"} loaderHeight={"30px"} position={"relative"} /> : state.editId ? 'Update Account' : 'Create Account'
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
