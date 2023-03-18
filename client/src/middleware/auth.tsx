import * as React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from '../store/store';

interface IAppProps {
  children: React.ReactNode;
}

export const AuthorizeUser = ({ children } : IAppProps )  => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={"/"} replace={true} />
  }
  return <React.Fragment>{children}</React.Fragment>;
};

export const ProtectRoute = ({children} : IAppProps ) => {
  const username = useAuthStore(state => state.auth.username);
  if(!username){
    return <Navigate to={'/'} replace />
  }
  return <React.Fragment>{children}</React.Fragment>

}

