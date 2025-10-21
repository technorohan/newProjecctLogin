import api from '../services/Axios';
import Cookie from '../utils/Cookie';

export const loginApi = (payload) => {
  return api.post('login', payload).then(response => response)
    .catch(err => err?.response);
};

export const login = (payload) => {
  return api.post('auth/signin', payload).then(response => response)
    .catch(err => err);
};

export const loginForGoogle = (payload) => {
  return api.post('google/login', payload).then(response => response)
    .catch(err => err);
};

export const register = (payload) => {
  return api.post('auth/register', payload).then(response => response)
    .catch(err => err);
};

export const GoogleRegister = (payload) => {
  return api.post('google/register', payload).then(response => response)
    .catch(err => err);
};

//For Email
export const VerifyOtp = (payload) => {
  return api.post('verify/email', payload).then(response => response)
    .catch(err => err);
};
//For Email
export const ResendOtp = (payload) => {
  return api.post('resend/otp', payload).then(response => response)
    .catch(err => err);
};

//For Resetc pass
export const VerifyOtpForReset = (payload) => {
  return api.post('controller/user/otp-verification', payload).then(response => response)
    .catch(err => err);
};

//For Reset pass
export const ResendOtpForReset = (payload) => {
  return api.post('resend/password/otp', payload).then(response => response)
    .catch(err => err);
};

export const ResetPassWord = (payload) => {
  return api.post('controller/user/createNewPassword', payload).then(response => response)
    .catch(err => err);
};

export const ForgetPassword = (payload) => {
  return api.post('controller/user/forgotPassword', payload).then(response => response)
    .catch(err => err);
};

// -------------------------------------------------User Information------------------------------------------
export const ME = () => {
  const header = {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  }
  return api.get('me', header).then(response => response)
    .catch(err => err?.response);
};
// ------------------------------------------------------ Add Admin ----------------------------------------------------
export const addAdmin = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'Content-Type': 'multipart/form-data' }
  }
  return api.post('add-admin', payload,header).then(response => response)
    .catch(err => err?.response);
};
// ------------------------------------------------- get admin list ------------------------------------------------
export const GetAdminList = ({searchTerm}) => {
  const header = {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  }
  return api.get(`admin-list?searchTerm=${searchTerm}`, header).then(response => response)
    .catch(err => err?.response);
};
// ------------------------------------------------------ Add Staf ----------------------------------------------------
export const addStaf = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'Content-Type': 'multipart/form-data' }
  }
  return api.post('add-staff', payload,header).then(response => response)
    .catch(err => err?.response);
};
// ------------------------------------------------- get staf list ------------------------------------------------
export const GetStafList = () => {
  const header = {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  }
  return api.get('staff-list', header).then(response => response)
    .catch(err => err?.response);
};
// -------------------------------------------------Account Tab------------------------------------------
//Create Account
export const CreateNewAccount = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  }
  return api.post('auth/signup', payload, header).then(response => response)
    .catch(err => err);
};

//Get Account
export const FetchAccountDetails = (id) => {
  const header = {
    headers: { 'Authorization': `Bearer ${Cookie.getCookie('_tokenAuth')}` }
  }
  return api.get('controller/user/' + id, header).then(response => response)
    .catch(err => err);
};

//Update Admin Account
export const UpdateAdminAccount = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${Cookie.getCookie('_tokenAuth')}` }
  }
  return api.put('controller/user/admin/update/' + payload.id, payload, header).then(response => response)
    .catch(err => err);
};

//Update User Account
export const UpdateUserAccount = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${Cookie.getCookie('_tokenAuth')}` }
  }
  return api.put('controller/user/update/' + payload.id, payload, header).then(response => response)
    .catch(err => err);
};

//Delete Account
export const DeleteAnyAccount = (id) => {
  const header = {
    headers: { 'Authorization': `Bearer ${Cookie.getCookie('_tokenAuth')}` }
  }
  return api.delete('controller/user/delete/' + id, header).then(response => response)
    .catch(err => err);
};

//Status Change Account
export const ChangeStatusAccount = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${Cookie.getCookie('_tokenAuth')}` }
  }
  return api.post('controller/user/changeAccountStatus', payload, header).then(response => response)
    .catch(err => err);
};


//Search Admin list
export const AllSearchAccountList = (term, page) => {
  const header = {
    headers: { 'Authorization': `Bearer ${Cookie.getCookie('_tokenAuth')}` }
  }
  return api.get(`controller/user/searchAdminList?searchKey=${term}&limit=10&page=${page}`, header).then(response => response)
    .catch(err => err);
};

//Search user list
export const AllUserSearchAccountList = (term, page) => {
  const header = {
    headers: { 'Authorization': `Bearer ${Cookie.getCookie('_tokenAuth')}` }
  }
  return api.get(`controller/user/searchUserList?searchKey=${term}&limit=10&page=${page}`, header).then(response => response)
    .catch(err => err);
};

//Update Super admin
export const GetTypeOfUserList = () => {
  const header = {
    headers: { 'Authorization': `Bearer ${Cookie.getCookie('_tokenAuth')}` }
  }
  return api.get(`controller/userType/getAll`).then(response => response)
    .catch(err => err);
};

//Update Super admin
export const UpdateAccountForSuperAdmin = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${Cookie.getCookie('_tokenAuth')}` }
  }
  return api.put(`controller/user/superadmin/update`, payload, header).then(response => response)
    .catch(err => err);
};

//Update admin
export const UpdateAccountForAdmin = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${Cookie.getCookie('_tokenAuth')}` }
  }
  return api.put(`controller/user/admin/update`, payload, header).then(response => response)
    .catch(err => err);
};


//Update user Account
export const UpdateAccountForUser = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${Cookie.getCookie('_tokenAuth')}` }
  }
  return api.put(`controller/user/update`, payload, header).then(response => response)
    .catch(err => err);
};

//Update user Password
export const ChangePasswords = (payload) => {
  const header = {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  }
  return api.post(`reset-password`, payload, header).then(response => response)
    .catch(err => err?.response);
};

//For Resetc pass
export const TwoFactorsAuthApi = (payload) => {
  return api.post('auth/admin/verify-otp', payload).then(response => response)
    .catch(err => err);
};

export const UploadProfilePicture = (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  const header = {
    headers: { 'Authorization': `Bearer ${Cookie.getCookie('_tokenAuth')}`, 'Content-Type': 'multipart/form-data' }
  }
  return api.post(`controller/files/upload-profile-picture`, formData, header).then(response => response)
}