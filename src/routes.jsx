import React, { Suspense, lazy } from 'react';
import { Routes, Navigate, Route, useLocation } from 'react-router-dom';

import SiteLayout from './layouts/SiteLayout';
import MainLayout from './layouts/MainLayout';
// import HomeLayout from './layouts/HomeLayout';

import GuestGuard from './guards/GuestGuard';
import UserGuard from './guards/UserGuard';

import LoadingScreen from './components/LoadingScreen';
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import Dashboard from './views/user/Dashboard/Dashboard';
import AllAccount from './views/user/All Account/AllAccount';
import LandingPage from './views/auth/LandingPage';
import Page404 from './views/errors/Page404';
import VerifyAccountPassword from './views/auth/ForgetPass/VerifyAccountPassword';
import ForgetPass from './views/auth/ForgetPass';
import EditProfile from './views/user/EditProfile/EditProfile';
import ChangePassword from './views/user/ChangePasssword/ChangePasssword';
import Help from './views/user/Help/help';
import LoginWithOtp from './views/auth/Login/LoginWithOtp';
import AddAdmin from './views/user/Add-Admin';
import AddStaf from './views/user/Staf/AddStaf';
import StafList from './views/user/Staf/StafList';
import AddCollege from './views/user/College/AddCollege';
import CollegeList from './views/user/College/CollegeList';
import EditCollege from './views/user/College/EditCollege';
import AddStream from './views/user/Stream/AddStream';
import EditStream from './views/user/Stream/EditStream';
import StreamList from './views/user/Stream/StreamList';
import AddSemester from './views/user/Semester/AddSemester';
import EditSemester from './views/user/Semester/EditSemester';
import SemesterList from './views/user/Semester/SemesterList';
import AddCourse from './views/user/Course/AddCourse';
import EditCourse from './views/user/Course/EditCourse';
import CourseList from './views/user/Course/CourseList';
import LogoList from './views/user/Logo/LogoList';
import EditLogo from './views/user/Logo/EditLogo';
// import Home from './views/Home';


export const renderRoutes = (routes = []) => (
  <Suspense fallback={<LoadingScreen />}>

    <Routes>
      {routes.map((route, i) => {
        const location = useLocation();
        // const Guard = route.guard || Fragment;
        // const Layout = route.layout || Fragment;
        // const Component = route.component;
        let UNAUTH_ROUTE = ["/", "/login", "/register", "/forget-pass", "/login-with-otp", "/otp-verification"]
        let AUTH_ROUTE = ["/user/dashboard", "/user/all-accounts","/user/edit-profile","/user/add-admin",
          "/user/change-password","/user/help","/user","/user/add-staf","/user/all-staf",
          "/user/add-college","/user/all-college","/user/edit-college","/user/add-stream","/user/all-stream","/user/edit-stream",
        "/user/add-semester","/user/all-semester","/user/edit-semester",
        "/user/add-course","/user/all-course","/user/edit-course","/user/logo","/user/edit-logo"
        ]
        // console.log(location, route.path)
        return (
          // location.pathname === "/" 
          // || location.pathname === "/login" 
          // || location.pathname === "/register" 
          // || location.pathname === "/forget-pass" 
          // || location.pathname === "/otp-verification" 
          UNAUTH_ROUTE.includes(location.pathname)
            ?
            <Route
              key={i}
              path={location.pathname}
              // exact={route.exact}
              exact={true}
              element={
                <GuestGuard>
                  <SiteLayout>
                    {(
                      // location.pathname === "/") ? <LandingPage />
                      location.pathname === "/") ? <Navigate to="/login" />
                      : (location.pathname === "/login") ? <Login />
                        : location.pathname === "/register" ? <Register />
                          : location.pathname === "/forget-pass" ? <ForgetPass />
                          : location.pathname === "/login-with-otp" ? <LoginWithOtp />
                            : location.pathname === "/otp-verification" ? <VerifyAccountPassword />
                              : ""
                    }
                  </SiteLayout>
                </GuestGuard>
              }
            />
            //   : (location.pathname.includes("/user/dashboard")
            //   || location.pathname.includes("/user")
            // )
            : AUTH_ROUTE.includes(location.pathname) ?
              <Route
                key={i}
                path={location.pathname}
                // exact={route.exact}
                exact={true}
                element={
                  <UserGuard>
                    <MainLayout>
                      {location.pathname.includes("/user/dashboard") ? <Dashboard />
                        : location.pathname.includes("/user/all-accounts") ? <AllAccount />
                        : location.pathname.includes("/user/edit-profile") ? <EditProfile />
                        : location.pathname.includes("/user/add-admin") ? <AddAdmin />
                        : location.pathname.includes("/user/add-staf") ? <AddStaf />
                        : location.pathname.includes("/user/all-staf") ? <StafList />
                        : location.pathname.includes("/user/add-college") ? <AddCollege />
                        : location.pathname.includes("/user/edit-college") ? <EditCollege />
                        : location.pathname.includes("/user/all-college") ? <CollegeList />
                        : location.pathname.includes("/user/add-stream") ? <AddStream />
                        : location.pathname.includes("/user/edit-stream") ? <EditStream />
                        : location.pathname.includes("/user/all-stream") ? <StreamList />
                        : location.pathname.includes("/user/add-semester") ? <AddSemester />
                        : location.pathname.includes("/user/edit-semester") ? <EditSemester />
                        : location.pathname.includes("/user/all-semester") ? <SemesterList />
                        : location.pathname.includes("/user/add-course") ? <AddCourse />
                        : location.pathname.includes("/user/edit-course") ? <EditCourse />
                        : location.pathname.includes("/user/all-course") ? <CourseList />
                        : location.pathname.includes("/user/change-password") ? <ChangePassword />
                        : location.pathname.includes("/user/help") ? <Help />
                        : location.pathname.includes("/user/logo") ? <LogoList />
                        : location.pathname.includes("/user/edit-logo") ? <EditLogo />
                        : location.pathname.includes("/user") ? <Navigate to="/user/dashboard" />
                        
                          : <Navigate to="/404" />
                      }
                    </MainLayout>
                  </UserGuard>
                }
              />
              :
              <Route
                key={i}
                path={location.pathname}
                // exact={route.exact}
                exact={true}
                element={
                  <>
                    <>
                      <Navigate to="/404" />
                      <Page404 />
                    </>
                  </>
                }
              />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  // anonymous routes
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('./views/errors/Page404'))
  },
  {
    exact: true,
    layout: SiteLayout,
    guard: GuestGuard,
    path: '/',
  },
  {
    exact: true,
    layout: SiteLayout,
    guard: GuestGuard,
    path: '/login',
    // component: lazy(() => import('./views/auth/Login'))
  },
  {
    exact: true,
    layout: SiteLayout,
    guard: GuestGuard,
    path: '/register',
    // component: lazy(() => import('./views/auth/Register'))
  },
  {
    exact: true,
    layout: SiteLayout,
    guard: GuestGuard,
    path: '/otp-verification',
    // component: lazy(() => import('./views/auth/ForgetPass/VerifyAccountPassword'))
  },
  {
    exact: true,
    layout: SiteLayout,
    guard: GuestGuard,
    path: '/forget-pass',
    // component: lazy(() => import('./views/auth/ForgetPass'))
  },
  {
    exact: true,
    path: '/user',
    guard: UserGuard,
    layout: MainLayout,
    component: () => <Navigate to="/user/dashboard" />
  },
  {
    exact: true,
    path: '/user/dashboard',
    guard: UserGuard,
    layout: MainLayout,
    // component: React.lazy(() => import('./views'))
  },
  {
    exact: true,
    path: '/user/all-accounts',
    guard: UserGuard,
    layout: MainLayout,
    // component: React.lazy(() => import('./views'))
  },

];

export default routes;
