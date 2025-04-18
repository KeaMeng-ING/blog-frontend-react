import React from "react";
import { useAuthContext } from "../hook/useAuthContext";

const ProfileDetail = () => {
  const { user } = useAuthContext();

  console.log(user);

  return <div>ProfileDetail</div>;
};

export default ProfileDetail;
