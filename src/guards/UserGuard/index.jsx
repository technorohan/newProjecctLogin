/* eslint-disable radix */
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { ME } from '../../actions/authAction';
import { setAuthUserState } from '../../redux/slice/user';
import LoadingScreen from '../../components/LoadingScreen';

const UserGuard = ({ children }) => {
  // const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate()
  
  // let localAuthentication = localStorage.getItem('isAuthenticated')
  // let token = localStorage.getItem('token')

  // if (!isAuthenticated && user === null) {
  //   return <Navigate to="/login" />;
  // }

  useEffect(() => {
      const getmyData = async () => {
        try {
          setLoading(true)
          let responce = await ME();
          console.log('responce', responce)
          if (responce?.data?.status === 200) {
            localStorage.setItem('isAuthenticated', true)
            dispatch(setAuthUserState({
              isAuthenticated: "authenticated",
              isInitialized: true,
              user: responce?.data?.data,
            }))
            setLoading(false)
          }
          if (responce && responce?.status === 401) {
            navigate('/login')
            setLoading(false)
          } else if (responce && responce?.status === 422) {
            setLoading(false)
            navigate('/login')
          }

        } catch (err) {
          console.log("Inside catch block login: ---", err);
          setLoading(false)
          navigate('/login')
        }
      }
      getmyData()
  }, [])

  return (
    <>
      {children}
    </>
  );
};

UserGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserGuard;
