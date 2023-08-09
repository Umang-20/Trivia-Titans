import React from "react";
import AuthHeader from "../../components/AuthHeader";

const AuthLayout = ({ children }) => {
  return (
    <div>
      <AuthHeader />
      {children}
    </div>
  );
};

export default AuthLayout;
