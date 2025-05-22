import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { FaUser, FaExchangeAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearAutoLogout } from "../utils/autoLogout";

// Import the popup actions from popupSlice
import { toggleAddNewAdminPopup, toggleSettingPopup, showActionMessage, toggleDismissAdminPopup } from "../store/slices/popUpSlice";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const { addNewAdminPopup, settingPopup } = useSelector((state) => state.popup);

  const { loading, error, message, authenticated, user } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    // Show a loading toast
    toast.info("Logging out...");
    
    
    // Manually clear any local data as fallback
    setTimeout(() => {
      if (localStorage.getItem('user')) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }, 2000);
  };

  // Check authentication status
  const checkAuthentication = () => {
    const userData = localStorage.getItem('user');
    if (!userData && window.location.pathname !== '/login') {
      // Redirect to login page if not authenticated
      window.location.href = '/login';
    }
  };

  // Force logout on tab/window close but not on refresh
  const handleBeforeUnload = (e) => {
    // Set a timestamp in sessionStorage to detect refreshes
    sessionStorage.setItem('pageUnloadTime', Date.now().toString());
  };

  // Handle Add New Admin button click
  const handleAddNewAdmin = (e) => {
    e.preventDefault(); // Prevent default behavior
    dispatch(toggleAddNewAdminPopup());
  };
  
  // Handle Settings button click
  const handleSettings = (e) => {
    e.preventDefault(); // Prevent default behavior
    dispatch(toggleSettingPopup());
  };

  // Handle Dismiss Admin button click
  const handleDismissAdmin = (e) => {
    e.preventDefault();
    dispatch(toggleDismissAdminPopup());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, authenticated, error, loading, message]);

  useEffect(() => {
    // Set a unique tab ID in sessionStorage if not already set
    if (!sessionStorage.getItem('tabID')) {
      sessionStorage.setItem('tabID', Math.random().toString(36).substring(2, 15));
    }

    // Handle page load or reload
    const handlePageLoad = () => {
      const unloadTime = sessionStorage.getItem('pageUnloadTime');
      
      if (unloadTime) {
        // This is a page refresh (the unload time exists in this session)
        // Keep the user logged in by doing nothing
        sessionStorage.removeItem('pageUnloadTime');
      } else {
        // This is a new page visit (no unload time in this session)
        // Check if the user needs to log in
        const userData = localStorage.getItem('user');
        if (!userData && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageshow', handlePageLoad);
    
    // Execute the page load handler on mount
    handlePageLoad();
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageshow', handlePageLoad);
    };
  }, []);

  // Second useEffect to handle visibility changes separately
  useEffect(() => {
    // Handle tab visibility changes (switching between tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Tab is now hidden (user switched away)
        sessionStorage.setItem('tabHiddenTime', Date.now().toString());
      } else if (document.visibilityState === 'visible') {
        // Tab is now visible (user switched back)
        const hiddenTime = sessionStorage.getItem('tabHiddenTime');
        const threshold = 30 * 60 * 1000; // 30 minutes in milliseconds
        
        if (hiddenTime && (Date.now() - parseInt(hiddenTime)) > threshold) {
          // User has been away for more than the threshold
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-black text-white flex-col h-full overflow-y-auto scrollbar-hide`}
        style={{ position: "fixed" }}
      >
        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="logo" />
        </div>
        <nav className="flex-1 px-6 space-y-2">
          <button
            onClick={() => setSelectedComponent("Dashboard")}
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
          >
            <img src={dashboardIcon} alt="dashboard" /> <span>Dashboard</span>
          </button>
          <button
            onClick={() => setSelectedComponent("Books")}
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
          >
            <img src={bookIcon} alt="books" /> <span>Books</span>
          </button>
          {authenticated && (
            <>
              {user?.roll === "Admin" && (
                <>
                  <button
                    onClick={() => setSelectedComponent("Catalog")}
                    className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                  >
                    <img src={catalogIcon} alt="catalog" /> <span>Catalog</span>
                  </button>
                  <button
                    onClick={() => setSelectedComponent("Users")}
                    className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                  >
                    <img src={usersIcon} alt="users" /> <span>Users</span>
                  </button>
                  {/* <button
                    onClick={handleDismissAdmin}
                    className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                  >
                    <RiAdminFill className="w-6 h-6" /> <span>Dismiss Admin</span>
                  </button> */}
                  <button
                    onClick={() => setSelectedComponent("Borrowings")}
                    className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                  >
                    <FaExchangeAlt className="w-5 h-5" /> <span>Borrowings</span>
                  </button>
                  <button
                    onClick={() => setSelectedComponent("Borrow Requests")}
                    className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                  >
                    <img src={bookIcon} alt="requests" /> <span>Borrow Requests</span>
                  </button>
                  <button
                    onClick={handleAddNewAdmin}
                    className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                  >
                    <RiAdminFill className="w-6 h-6" /> <span>Add New Admin</span>
                  </button>
                </>
              )}
              {user?.roll === "User" && (
                <>
                  <button
                    onClick={() => setSelectedComponent("My Borrowed Books")}
                    className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                  >
                    <img src={catalogIcon} alt="my-borrowed-books" />
                    <span>My Borrowed Books</span>
                  </button>
                  <button
                    onClick={() => setSelectedComponent("My Borrow Requests")}
                    className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                  >
                    <img src={bookIcon} alt="my-requests" />
                    <span>My Requests</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedComponent("Profile")}
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              >
                <FaUser className="w-5 h-5" /> <span>Profile</span>
              </button>
            </>
          )}
          <button
            onClick={handleSettings}
            className="md:hidden w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
          >
            <img src={settingIcon} alt="setting" />{" "}
            <span>Update Credentials</span>
          </button>
        </nav>
        <div className="px-6 py-4">
          <button
            className="py-2 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex items-center justify-center space-x-5 mb-7 mx-auto w-fit"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="logout" /> <span>Log Out</span>
          </button>
        </div>
        <img
          src={closeIcon}
          alt="closeIcon"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden"
        />
      </aside>
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </>
  );
};

export default SideBar;
