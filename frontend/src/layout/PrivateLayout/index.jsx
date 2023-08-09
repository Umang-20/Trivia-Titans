import React from "react";
import Header from "../../components/Header";

const PrivateLayout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default PrivateLayout;
