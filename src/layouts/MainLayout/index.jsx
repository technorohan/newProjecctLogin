import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthHeader from '../../components/AuthHeader';
import AuthSidebar from '../../components/AuthSidebar';
import AuthFooter from '../../components/AuthFooter';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AodRoundedIcon from '@mui/icons-material/AodRounded';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slice/user';

// const location = useLocation()


const MainLayout = ({ children }) => {
  console.log('child', children)
  // const { user } = useAuth();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showLeftMenue, setShowLeftMenue] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const navigator = useNavigate();
  const location = useLocation();
  const goToProfile = () => {
    console.log('Enrwechhsddh')
    navigator('/user/account');
  };

  const goToEditProfile = () => {
    navigator('/user/edit-profile');
  }
  const goToChangePassword = () => {
    navigator('/user/change-password');
  }

  const goToHelp = () => {
    navigator('/user/help');
  }
  const handleLogout = () =>{
    dispatch(logout())
    navigator('/login')
  }
  console.log(user)
  return (
    <div className='body'>
      {/* <main className="custom-dashboard"> */}
      <div className="adminLayout">
        <div className={showLeftMenue ? "leftPanel show" : "leftPanel"}>

          <button className={showLeftMenue ? "mainDashboard-toggle active" : "mainDashboard-toggle"}
            onClick={() => setShowLeftMenue(!showLeftMenue)}>
            <div></div>
          </button>
          <div className="logoDiv">
            <Link to="/user/dashboard">
              {/* <img src="../../images/logo.png" /> */}
              <img src="https://euphoriagenx.com/wp-content/uploads/2022/03/Footer-Logo.png" />
            </Link>
          </div>
          <ul>
            <li><Link to="/user/dashboard" className={location.pathname === "/user/dashboard" && "active"}><DashboardOutlinedIcon /> <span>Dashboard</span></Link></li>
            <li><Link to="/user/all-accounts" className={(location.pathname === "/user/all-accounts" && "active") || (location.pathname === "/user/add-admin" && "active")} ><InsertChartOutlinedIcon /> <span>Admins</span></Link></li>
            <li><Link to="/user/logo" className={(location.pathname === "/user/logo" && "active") || (location.pathname === "/user/edit-logo" && "active")} ><InsertChartOutlinedIcon /> <span>Logo</span></Link></li>

            {/* <li><Link to="/user/all-staf" className={(location.pathname === "/user/add-staf" && "active") || (location.pathname === "/user/all-staf" && "active")} ><InsertChartOutlinedIcon /> <span>Stafs</span></Link></li>
            <li><Link to="/user/all-college" className={(location.pathname === "/user/add-college" && "active") || (location.pathname === "/user/all-college" && "active")} ><InsertChartOutlinedIcon /> <span>Colleges</span></Link></li>
            <li><Link to="/user/all-stream" className={(location.pathname === "/user/add-stream" && "active") || (location.pathname === "/user/all-stream" && "active")} ><InsertChartOutlinedIcon /> <span>Streams</span></Link></li>
            <li><Link to="/user/all-semester" className={(location.pathname === "/user/add-semester" && "active") || (location.pathname === "/user/all-semester" && "active")} ><InsertChartOutlinedIcon /> <span>Semesters</span></Link></li>
            <li><Link to="/user/all-course" className={(location.pathname === "/user/add-course" && "active") || (location.pathname === "/user/all-course" && "active")} ><InsertChartOutlinedIcon /> <span>Courses</span></Link></li> */}
            
            
          </ul>
        </div>
        <div className="leftPanel-outerlayout" onClick={() => setShowLeftMenue(false)}></div>
        <div className="rightPanel">
          <div className="dashbordHead">
            <div className="dashbordHeadRow">
              <button className={showLeftMenue ? "mainDashboard-toggle active" : "mainDashboard-toggle"} onClick={() => setShowLeftMenue(!showLeftMenue)}>
                <div></div>
              </button>

              <div className="right">
                <div className="profileMenu">
                  <div class="dropdown">
                    <div className="avtarBlock" onClick={() => setShowAccountMenu(!showAccountMenu)}>
                      <div className="imgBlock">
                        <AccountCircleOutlinedIcon />
                      </div>
                      {user &&
                        <p>{user.first_name} {user.last_name}</p>
                      }
                    </div>

                    <ul class={showAccountMenu ? "dropdown-menu show" : "dropdown-menu"} onClick={() => setShowAccountMenu(!showAccountMenu)}>
                      <li class="dropdown-menu-header">
                        <h5>Account</h5>
                        <button class="dropdown-close"><img src="/images/modaclosebtn.svg" alt="" /></button>
                      </li>
                      <li class="userAcountInfo">
                        <figure>
                          <AccountCircleOutlinedIcon />
                          {user &&
                            <figcaption>
                              {/* {user.firstname} */}
                              <h4>{user.first_name} {user.last_name}</h4>
                              <p>{user.email}</p>
                            </figcaption>
                          }
                        </figure>
                      </li>

                      <li><a class="dropdown-item" onClick={goToEditProfile}><EditOutlinedIcon/> Edit Profile</a></li>
                      <li><a class="dropdown-item" onClick={goToChangePassword}><HttpsOutlinedIcon /> Change Password</a></li>
                      <li><a class="dropdown-item" onClick={goToHelp}><SettingsOutlinedIcon/> Help</a></li>
                      <li>
                        <div class="cdivider"></div>
                      </li>
                      <li>
                        {/* onClick={handleLogout} */}
                        <a class="dropdown-item" onClick={() => handleLogout()}><LogoutOutlinedIcon/> Logout</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {children}
          <AuthFooter />
        </div>
      </div>
    </div >
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
