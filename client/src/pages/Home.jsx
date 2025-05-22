import React, { useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import BorrowRequests from "../components/BorrowRequests";
import MyBorrowRequests from "../components/MyBorrowRequests";
import Borrowings from "../components/Borrowings";
import PopupContainer from "../components/PopupContainer";
import UserProfile from "../components/UserProfile";
import AdminProfile from "../components/AdminProfile";
import ActionNotification from "../components/ActionNotification";
import { resetAllPopups } from "../store/slices/popUpSlice";

const Home = () => {
  const [issidebaropen, setissidebaropen] = useState(false);
  const [selectedcomponent, setselectedcomponent] = useState("Dashboard");
  const dispatch = useDispatch();

  const { user, authenticated } = useSelector(state => state.auth);
  
  // Reset all popups when Home component mounts
  useEffect(() => {
    dispatch(resetAllPopups());
  }, [dispatch]);
  
  if (!authenticated) {
    return <Navigate to={"/login"} />;
  }

  const renderComponent = () => {
    switch (selectedcomponent) {
      case "Dashboard":
        return user?.roll === "Admin" ? 
          <AdminDashboard setSelectedComponent={setselectedcomponent} /> : 
          <UserDashboard setSelectedComponent={setselectedcomponent} />;
      case "Books":
        return <BookManagement />;
      case "Catalog":
        return <Catalog setSelectedComponent={setselectedcomponent} />;
      case "Users":
        return <Users />;
      case "My Borrowed Books":
        return <MyBorrowedBooks />;
      case "Borrowings":
        return <Borrowings />;
      case "Borrow Requests":
        return <BorrowRequests />;
      case "My Borrow Requests":
        return <MyBorrowRequests setSelectedComponent={setselectedcomponent} />;
      case "Profile":
        return user?.roll === "Admin" ? 
          <AdminProfile /> : 
          <UserProfile />;
      default:
        return user?.roll === "Admin" ? 
          <AdminDashboard setSelectedComponent={setselectedcomponent} /> : 
          <UserDashboard setSelectedComponent={setselectedcomponent} />;
    }
  };

  return (
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
      {/* Action notifications for persistent messages */}
      <ActionNotification />
      
      <div className="md:hidden fixed top-4 left-4 z-10">
        <GiHamburgerMenu className="text-2xl" onClick={() => setissidebaropen(!issidebaropen)} />
      </div>
      <SideBar 
        isSideBarOpen={issidebaropen} 
        setIsSideBarOpen={setissidebaropen} 
        setSelectedComponent={setselectedcomponent}
      />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {renderComponent()}
        </div>
      </main>
      
      {/* Render all popups */}
      <PopupContainer />
    </div>
  );
};

export default Home;
