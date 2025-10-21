import React, { useEffect, useReducer, useRef, useState } from 'react';
import Loader from '../../../utils/Loader';
import { ZodError } from 'zod';
import { collegeFormValidate, streamFormValidate } from '../../../validation/adminFormValidate';
import { handelError } from '../../../helpers/common';
import toast from 'react-hot-toast';
import { AddCollegeHandler, AddLogoHandler, EditCollegeHandler, EditCourseHandler, EditSemesterHandler, EditStreamHandler } from '../../../actions/mainAction';
import { useLocation } from 'react-router-dom';


export default function EditLogo() {
	const imageRef = useRef();
	const [isLoading, setLoading] = useState(false)
	const location = useLocation();
    const dataReceived = location.state;
	console.log('dataReceived',dataReceived)
	const [image, setImage] = useState(null)
	const [previewImage, setPreviewImage] = useState(dataReceived || null)

	const handleSubmit = async (_e) => {
		_e.preventDefault();

		if (image == null) {
		 return	toast.error('Choose a image')
		}
		setLoading(true)
		let newData = new FormData()
		newData.append('logo', image);
		let responce = await AddLogoHandler(newData);
		console.log('response', responce?.data)
		if (responce?.data?.status === 200) {
			toast.success('Logo Edited Successfully')
			setLoading(false)
			imageRef.current.value = null
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
				<h1> Edit Logo </h1>
				<form onSubmit={handleSubmit}>
					<div className="row">
						<div className="col-md-6">
							<div className='row'>
								<div className="col-md-8">
									<div className="formGroup">
										<label>Image </label>
										<div className="inputgroup inputgroupRight">
											<input type="file"
												id="image"
												ref={imageRef}
												onChange={(e) => {
													setImage(e.target.files[0]);
													setPreviewImage(URL.createObjectURL(e.target.files[0]))
												}}
												name="image"
												className={"form-control"}
											/>
											<img src="/images/phone-icon.svg" class="rightSide" alt="" />
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className='imgViewDiv'>
										<img src={previewImage ?? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"} alt=""
											style={{height:"200px",width:'200px'}}
										/>
									</div>
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

