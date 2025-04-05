import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Bookmark,
  Mail,
  MessageSquare,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <>
      {!isSidebarOpen && (
        <button
          onClick={openSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 bg-green-500 text-white p-2 rounded-md"
        >
          <Menu size={24} />
        </button>
      )}

      <div
        className={`bg-green-500 text-white w-72 min-h-screen p-4 fixed top-0 z-40 transition-transform duration-300
        ${isSidebarOpen ? "left-0" : "-left-80"} lg:left-0 lg:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button className="lg:hidden text-white" onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>

        <div className="space-y-2">
          <SidebarItem
            icon={<Home size={20} />}
            label="Home"
            additionalStyles="hover:bg-green-600"
          />
          <SidebarItem
            icon={<Bookmark size={20} />}
            label="Bookmark"
            additionalStyles="hover:bg-green-600"
          />
          <SidebarItem
            icon={<Mail size={20} />}
            label="Messages"
            additionalStyles="hover:bg-green-600"
          />

          <div
            className="flex items-center px-3 py-2 rounded-md hover:bg-blue-600 cursor-pointer justify-between"
            onClick={toggleDropdown}
          >
            <div className="flex items-center">
              <MessageSquare className="mr-3" size={20} />
              <span>Chatbox</span>
            </div>
            <ChevronDown
              className={`transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {isDropdownOpen && (
            <div className="ml-8 text-sm space-y-1">
              <DropdownItem label="Social" />
              <DropdownItem label="Personal" />
              <DropdownItem label="Friends" />
            </div>
          )}

          <SidebarItem
            icon={<LogOut size={20} />}
            label="Logout"
            additionalStyles="hover:bg-green-600"
            onClick={handleLogout}
          />
        </div>
      </div>
    </>
  );
};

const SidebarItem = ({ icon, label, additionalStyles = "", onClick }) => (
  <div
    className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-600 cursor-pointer ${additionalStyles}`}
    onClick={onClick}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </div>
);

const DropdownItem = ({ label }) => (
  <div className="hover:bg-gray-700 p-2 rounded-md cursor-pointer">{label}</div>
);

export default Sidebar;
