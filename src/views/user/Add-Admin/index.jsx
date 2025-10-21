import React, { useEffect, useReducer, useRef, useState } from 'react';
import Loader from '../../../utils/Loader';
import { ZodError } from 'zod';
import { adminFormValidate } from '../../../validation/adminFormValidate';
import { handelError } from '../../../helpers/common';
import { addAdmin } from '../../../actions/authAction';
import toast from 'react-hot-toast';


export default function AddAdmin() {
	const imageRef = useRef();
	const [isLoading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		firstName: "",
		firstNameErr: false,
		firstNameErrMsg: "",
		lastName: "",
		lastNameErr: false,
		lastNameErrMsg: "",
		companyName: "",
		companyNameErr: false,
		companyNameErrMsg: "",
		password: "",
		passwordErr: false,
		passwordErrMsg: "",
		email: "",
		emailErr: false,
		emailErrMsg: "",
		phoneNo: "",
		phoneNoErr: false,
		phoneNoErrMsg: "",
	});
	const [image, setImage] = useState(null)
	const handelChange = (_event) => {
		setFormData((_prevState) => ({
			..._prevState,
			[_event.target.name]: _event.target.value,
			[`${_event.target.name}Err`]: false,
			[`${_event.target.name}ErrMsg`]: "",
		}));
	};
	const handleSubmit = async (_e) => {
		_e.preventDefault();
		try {
			console.log('formData', formData)
			adminFormValidate.parse(formData);
		} catch (error) {
			if (error instanceof ZodError) {
				handelError(error, setFormData);
			}
			return;
		}
		setLoading(true)
		let newData = new FormData()
		newData.append('first_name', formData.firstName);
		newData.append('last_name', formData.lastName);
		newData.append('company_name', formData.companyName);
		newData.append('email', formData.email);
		newData.append('password', formData.password);
		newData.append('mobile', formData.phoneNo);
		if (image) {
			newData.append('image', image);
		}
		let responce = await addAdmin(newData);
		console.log('response', responce?.data)
		if (responce?.data?.status === 200) {
			toast.success('Admin added Successfully')
			setFormData({
				firstName: "",
				firstNameErr: false,
				firstNameErrMsg: "",
				lastName: "",
				lastNameErr: false,
				lastNameErrMsg: "",
				companyName: "",
				companyNameErr: false,
				companyNameErrMsg: "",
				password: "",
				passwordErr: false,
				passwordErrMsg: "",
				email: "",
				emailErr: false,
				emailErrMsg: "",
				phoneNo: "",
				phoneNoErr: false,
				phoneNoErrMsg: "",
			})
			setLoading(false)

		} else if (responce?.data?.status === 422) {
			toast.error(responce?.data?.message)
			setLoading(false)

		} else if (responce?.data?.status === 400) {
			toast.error('Something Wrong')
			setLoading(false)

		}
	}

	return (
		<div className="createNewAccountPage">
			<div className="createNewAccountInner">
				<h1> Add Admin</h1>
				<form onSubmit={handleSubmit}>
					<div className="row">
						<div className="col-md-6">
							<div className="formGroup">
								<label>First Name</label>
								<div className="inputgroup ">
									<input type="text"
										className={formData.firstNameErr ? "form-control red-border" : "form-control"}
										id="firstName"
										value={formData.firstName}
										onChange={handelChange}
										name="firstName"
										placeholder=""
									/>
									{/* <img src="/images/user.svg" class="rightSide" /> */}
								</div>
								<p className="error-msg">{formData.firstNameErrMsg}</p>

							</div>
						</div>
						<div className="col-md-6">
							<div className="formGroup">
								<label>Last Name</label>
								<div className="inputgroup ">
									{/* inputgroupRight */}
									<input type="text"
										className={formData.lastNameErr ? "form-control red-border" : "form-control"}
										id="lastName"
										value={formData.lastName}
										onChange={handelChange}
										name="lastName"
										placeholder=""
									/>
									{/* <img src="/images/user.svg" class="rightSide" /> */}
								</div>
								<p className="error-msg">{formData.lastNameErrMsg}</p>
							</div>
						</div>
						<div className="col-md-6">
							<div className="formGroup">
								<label>Company Name</label>
								<div className="inputgroup ">
									{/* inputgroupRight */}
									<input type="text"
										className={formData.companyNameErr ? "form-control red-border" : "form-control"}
										id="companyName"
										value={formData.companyName}
										onChange={handelChange}
										name="companyName"
										placeholder=""
									/>
									{/* <img src="/images/user.svg" class="rightSide" /> */}
								</div>
								<p className="error-msg">{formData.companyNameErrMsg}</p>
							</div>
						</div>
						<div className="col-md-6">
							<div className="formGroup">
								<label>Password</label>
								<div className="inputgroup ">
									{/* inputgroupRight */}
									<input type="text"
										className={formData.passwordErr ? "form-control red-border" : "form-control"}
										id="password"
										value={formData.password}
										onChange={handelChange}
										name="password"
										placeholder=""
									/>
									{/* <img src="/images/user.svg" class="rightSide" /> */}
								</div>
								<p className="error-msg">{formData.passwordErrMsg}</p>
							</div>
						</div>
						<div className="col-md-6">
							<div className="formGroup">
								<label>Email Address</label>
								<div className="inputgroup inputgroupRight">
									<input type="text"
										id="email"
										value={formData.email}
										onChange={handelChange}
										name="email"
										placeholder="tim.jennings@example.com"
										className={formData.emailErr ? "form-control red-border" : "form-control"}
									/>
									<img src="/images/email.svg" class="rightSide" alt="" />
								</div>

								<p className="error-msg">{formData.emailErrMsg}</p>

							</div>
						</div>

						<div className="col-md-6">
							<div className="formGroup">
								<label>Phone Number </label>
								<div className="inputgroup inputgroupRight">
									<input type="tel"
										id="phoneNo"
										value={formData.phoneNo}
										onChange={handelChange}
										name="phoneNo"
										// placeholder="insert phone number"
										className={formData.phoneNoErr ? "form-control red-border" : "form-control"}
									/>
									<img src="/images/phone-icon.svg" class="rightSide" alt="" />
								</div>
								<p className="error-msg">{formData.phoneNoErrMsg}</p>
							</div>
						</div>
						<div className="col-md-6">
							<div className="formGroup">
								<label>Image </label>
								<div className="inputgroup inputgroupRight">
									<input type="file"
										id="image"
										ref={imageRef}
										onChange={(e) => setImage(e.target.files[0])}
										name="image"
										className={"form-control"}
									/>
									<img src="/images/phone-icon.svg" class="rightSide" alt="" />
								</div>
							</div>
						</div>
						<div class="col-12">
							<button type='submit' className="themeBtn fullBtn" disabled={isLoading ? true : false} >
								{
									isLoading ? <Loader loaderWidth={"30px"} loaderHeight={"30px"} position={"relative"} /> : "SAVE"
								}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

