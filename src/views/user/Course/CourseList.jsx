import React, { useState, useEffect, useReducer } from 'react';
import useAuth from '../../../hooks/useAuth';
import { Helmet } from 'react-helmet';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import useGlobalStore from '../../../hooks/useGlobalStore';
import _ from "lodash";
// import { AllUserSearchAccountList, ChangeStatusAccount, ChangeStatusForMacSettingsApi, DeleteAnyAccount } from '../../../actions/authAction';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import LoadingScreen from '../../../components/LoadingScreen';
import ToastHot from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Reducer from '../../../services/Reducer';
import { DeleteCollegeHandler, DeleteCourseHandler, DeleteSemesterHandler, DeleteStreamHandler, GetCollegeList, GetCourseList, GetSemesterList, GetStreamList } from '../../../actions/mainAction';

const initState = {
    searchTerm: '',
    SubscriptionsList: '',
    totalItem: '',
    loading: false,
    validate: false
};


export default function CourseList() {
    const [state, dispatch] = useReducer(Reducer, initState);

    const navigator = useNavigate();
    // const [isError, setIsError] = useState(false)
    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        getFilterwithPaginationList()
    }, [page, state.searchTerm]);

    const getFilterwithPaginationList = async () => {
        dispatch({ type: 'LOAD', payload: true });
        const response = await GetCourseList();
        if (response && response.data) {
            // setIsError(true)
            if (response.data.status === 200) {
                dispatch({ type: 'LOAD', payload: false });
                dispatch({ type: "SETDATA", payload: { "name": "SubscriptionsList", "value": response.data.data } })
                dispatch({ type: "SETDATA", payload: { "name": "totalItem", "value": response.data.total_item } })
            } else {
                dispatch({ type: 'LOAD', payload: false });
                dispatch({ type: "SETDATA", payload: { "name": "SubscriptionsList", "value": [] } })
                dispatch({ type: "SETDATA", payload: { "name": "totalItem", "value": 0 } })
            }

        } else {
            dispatch({ type: 'LOAD', payload: false });
            ToastHot.error('Something went wrong')
            // toast.error("Something went wrong");
        }
    }
    const popUpForConfirmation = (index, deletedData, type) => {
        // confirmAlert({
        // title: 'Confirm to delete this',
        // message: 'You want to delete this account?',
        // buttons: [
        //     {
        //         label: 'Yes',
        //         onClick: () => deleteContact(index, deletedData)
        //     },
        //     {
        //         label: 'No',
        //         onClick: () => console.log('Click No')
        //     }
        // ]
        //     title: 'Confirm to delete this',                        // Title dialog
        //     message: 'You want to delete this account?',               // Message dialog
        //     childrenElement: () => <div>Custom UI</div>,       // Custom UI or Component
        //     confirmLabel: 'Yes',                           // Text button confirm
        //     cancelLabel: 'Cancel',                             // Text button cancel
        //     onConfirm: () => deleteContact(index, deletedData),    // Action after Confirm
        //     onCancel: () => alert('Action after Cancel'),      // Action after Cancel
        //     overlayClassName: "overlay-custom-class-name"      // Custom overlay class name
        // });
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    // default-alert-popup
                    // danger-alert-popup
                    // success-alert-popup
                    <div className='custom-ui-alert-popup default-alert-popup'>
                        <div className="alert-popup-headerpart">
                            <h1>Are you sure?</h1>
                            <div className="alert-popup-close" onClick={onClose} >X</div>
                        </div>
                        <div className="alert-popup-bodypart">
                            <p>You want to {type && type === 'delete' ? type : deletedData.status && deletedData.status === 'A' ? 'Inactive' : 'Active'} this account?</p>
                        </div>
                        <div className="alert-actions">
                            <div className="alert-actions-col">
                                <button onClick={onClose} className="alert--cancel-btn">No</button>
                            </div>
                            <div className="alert-actions-col">
                                {type && type === 'delete' ?
                                    <button className="alert--submit-btn"
                                        onClick={() => {
                                            deleteContact(index, deletedData)
                                            onClose();
                                        }}
                                    >
                                        Yes, Delete it!
                                    </button>
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                    </div>
                );
            }
        });
    }
    const deleteContact = async (index, deletedData) => {
        let delId = deletedData.id
        let newData = new FormData()
		newData.append('course_id', delId);
        const response = await DeleteCourseHandler(newData)
        if (response && response.status === 200) {
            ToastHot.success('Account has been successfully deleted.')
            getFilterwithPaginationList()
        } else {
            ToastHot.error('Something went wrong')
        }
    }

    const debounce = (func) => {
        let timer;
        return function (...args) {
            const context = this;
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                timer = null
                func.apply(context, args);
            }, 500);
        }
    }
    const phoneNumberFormat = (value) => {
        let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        console.log(value)
        return value
    }
    const handleChangeSearch = (e) => {
        console.log(e)
        const { value } = e.target;
        dispatch({ type: "SETDATA", payload: { "name": "searchTerm", "value": decodeURI(value) } })
    }
    const optimizedVersion = React.useCallback(debounce(handleChangeSearch), [])


    console.log("State for Account Page-----", state)
    return (
        <>
            <Helmet>
                <title>Course</title>
            </Helmet>

            <div className="listingPages allAccountsPage">
                <div className="listingPagesHead">
                    <div className="left">
                        <h3>Course</h3>
                    </div>
                    <div className="right">
                        <div className="rightInner">
                            <div className="searchGroup">
                                <div>
                                    <i className="material-icons">search</i>
                                    <input type="text" className="form-control" placeholder="Search" id="searchTerm" name="searchTerm" onChange={optimizedVersion} />
                                </div>
                            </div>
                            <Link to="/user/add-course" className="themeBtn"><i className="material-icons">add</i>Add New</Link>
                        </div>
                    </div>
                </div>

                <div className="listingMain">
                    {state.loading && <LoadingScreen />}
                    <div className="customTable allaccountsTable table-responsive scrollbox">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Sl No</th>
                                    <th className="d-none1400px">Course Name</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {state.SubscriptionsList && state.SubscriptionsList.length > 0 && state.SubscriptionsList.map((listing, index) => (
                                    <tr>
                                        <td className="w200px prewrap-text" data-th="Sl No">{index+1}</td>
                                        <td data-th="Course Name" className="d-none1400px w320px">{listing?.name}</td>
                                        <td className="actionTd w60px" data-th="Action">
                                            <div class="dropdown">
                                                <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i class="material-icons">more_vert</i>
                                                </button>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                    <li><a style={{ cursor: "pointer" }} class="dropdown-item" onClick={() =>navigator('/user/edit-course',{ state: listing })} >Edit</a></li>
                                                    <li><a style={{ cursor: "pointer" }} class="dropdown-item" onClick={() => popUpForConfirmation(index, listing, 'delete')} >Delete</a></li>

                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {state.SubscriptionsList && state.SubscriptionsList.length === 0 &&
                            <div className="nodata-found-table">
                                <img src="https://img.freepik.com/premium-vector/no-data-found-empty-file-folder-concept-design-vector-illustration_620585-1698.jpg" />
                                <h3>no data is still added!</h3>
                                <div className="nodata-found-actions">
                                    <Link to="/user/add-course" className="themeBtn">Add Course</Link>
                                </div>
                            </div>
                        }
                    </div>

                    {state.SubscriptionsList && state.SubscriptionsList.length > 0 &&
                        <div className="tablePagination">
                            <div className="left">
                                <p>Results {page !== 1 ? page * 10 - 9 : page} - {state.totalItem > page * 10 ? page * 10 : state.totalItem} of {state.totalItem}</p>
                            </div>
                            <div className="right">
                                <div className="paginationNavigation">
                                    <nav aria-label="Page navigation example">
                                        <Stack spacing={2}>
                                            <Pagination count={parseInt(state.totalItem % 10) === 0 ? parseInt((state.totalItem / 10)) : parseInt((state.totalItem / 10) + 1)} page={page} onChange={handleChange} variant="outlined" color="primary" />
                                        </Stack>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>





        </>
    );
}
