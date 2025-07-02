import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router';
import HomePage from "./pages/HomePage"
import CallPage from "./pages/CallPage"
import LoginPage from "./pages/LoginPage"
import NotificationsPage from "./pages/NotificationsPage"
import OnBoardingPage from "./pages/OnBoardingPage"
import SignUpPage from "./pages/SignUpPage"
import ChatPage from "./pages/ChatPage"
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from "./lib/axios.js";
import PageLoader from './components/PageLoader.jsx';
import Layout from './components/Layout.jsx';
import { getAuthUser } from './lib/api.js';
import useAuthUserHooks from './hooks/useAuthUser.js';
import FriendsPage from "./pages/FriendsPage.jsx";
import { useThemeStore } from './store/useThemeStore.js';
import GroupChatPage from './pages/GroupChatPage.jsx';

export const App = () => {
  //tanstack
  const {isLoading, authUser } = useAuthUserHooks()

  const { theme } = useThemeStore()

  const isAuthenticated = Boolean(authUser)

  const isOnboarded = authUser?.isOnboarded

  

  if(isLoading) return <PageLoader/>;

  
  
  

  return (
    <div className='h-screen' data-theme={theme}>

<Routes>
  <Route path="*" element={<div>404 Not Found</div>} />


  <Route path="/" element={isAuthenticated && isOnboarded ? (<Layout showSidebar = {true}><HomePage/></Layout>) : (
    <Navigate to ={!isAuthenticated ? "login" : "/onboarding"}/>
  ) } />



  <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to={ isOnboarded ? "/" : "/onboarding" } />} />



  <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={ isOnboarded ? "/" : "/onboarding" } />} />



   <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

<Route
  path="/friends"
  element={
    isAuthenticated && isOnboarded ? (
      <Layout showSidebar={true}>
        <FriendsPage />
      </Layout>
    ) : (
      <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
    )
  }
/>


<Route
  path="/group/:id"
  element={
    isAuthenticated && isOnboarded ? (
      <Layout showSidebar={false}> {/* Navbar will appear, sidebar is hidden */}
        <GroupChatPage />
      </Layout>
    ) : (
      <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
    )
  }
/>



  <Route path="/notifications" element={isAuthenticated && isOnboarded ? (<Layout showSidebar = {true}><NotificationsPage /></Layout>) : (
    <Navigate to = {!isAuthenticated ? "/login" : "/onboarding"} />
  )} />




  <Route path="/onboarding" element={isAuthenticated ? (!isOnboarded ? (<OnBoardingPage/>) : (<Navigate to ="/"/>)) : (<Navigate to = "/login"/>)} />
</Routes>

      <Toaster />
  </div>
  )
}

export default App;