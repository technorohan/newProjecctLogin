import React from 'react';
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import Cookie from '../utils/Cookie';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slice/user';

function SiteHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  // const { Logout } = useAuth();

  const handleLogout = () =>{
    dispatch(logout())
  }

  return (
    <div className="authHeader">
      <div className="custom-container">
        <div className="authHeader-wrapper">
          <div className="authHeader_logo">
            {/* <button onClick={() => { navigate('/') }}>
              HOME
            </button> */}
          </div>
          <div className="authHeader_rg">
            <ul className="authHeader_nav">
              {Cookie.getCookie('_tokenAuth') ?
                <li className="signIn">
                  <a onClick={() => { handleLogout(); navigate('/login') }}>Logout</a>
                </li>
                :
                <li className="signIn">
                  <button onClick={() => { navigate('/login') }} className="custom-btn-skyblue">
                    Sign In</button></li>
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

SiteHeader.propTypes = {};

export default SiteHeader;
