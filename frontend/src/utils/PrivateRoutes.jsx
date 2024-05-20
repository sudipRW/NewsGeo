import React from 'react'
import {Outlet,Navigate} from 'react-router-dom'
import { useAuth } from './AuthContext'
export const PrivateRoutes = () => {
    const {isSignedIn}= useAuth()
  return (
    isSignedIn ? <Outlet/> : <Navigate to='/signin'/>
  )
}
