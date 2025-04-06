import React from "react";
import Sidebar from "../components/SideBar";
import Navabar from "../components/Navabar";
import UserList from "../components/UserList";
const Adminpage = () => {
  return (
    <div>
      <Sidebar />
      <UserList />
    </div>
  );
};

export default Adminpage;
