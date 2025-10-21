import React, { useEffect, useReducer, useRef, useState } from 'react';
import Loader from '../../../utils/Loader';
import { ZodError } from 'zod';
import { adminFormValidate, collegeFormValidate, streamFormValidate } from '../../../validation/adminFormValidate';
import { handelError } from '../../../helpers/common';
import toast from 'react-hot-toast';
import { AddCollegeHandler, AddStreamHandler } from '../../../actions/mainAction';


export default function AddStream() {
	const imageRef = useRef();
	const [isLoading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: "",
		nameErr: false,
		nameErrMsg: "",
	});
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
			streamFormValidate.parse(formData);
		} catch (error) {
			if (error instanceof ZodError) {
				handelError(error, setFormData);
			}
			return;
		}
		setLoading(true)
		let newData = new FormData()
		newData.append('name', formData.name);
		let responce = await AddStreamHandler(newData);
		console.log('response', responce?.data)
		if (responce?.data?.status === 200) {
			toast.success('Stream added Successfully')
			setFormData({
				name: "",
				nameErr: false,
				nameErrMsg: "",
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
				<h1> Add Stream </h1>
				<form onSubmit={handleSubmit}>
					<div className="row">
						<div className="col-md-6">
							<div className="formGroup">
								<label>Stream</label>
								<div className="inputgroup ">
									<input type="text"
										className={formData.nameErr ? "form-control red-border" : "form-control"}
										id="name"
										value={formData.name}
										onChange={handelChange}
										name="name"
										placeholder=""
									/>
									{/* <img src="/images/user.svg" class="rightSide" /> */}
								</div>
								<p className="error-msg">{formData.nameErrMsg}</p>

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

