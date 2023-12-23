import React, { useState } from 'react';
import './Dashboard.css';
import { LuSlidersHorizontal } from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa6";

function Dashboard() {
  const [isDarkMode, setDarkMode] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className={`dashboard ${isDarkMode ? 'dark' : 'light'}`}>
      <div className='nav-bar'>
        <div className='filter'>
          <div className='display-filter' onClick={toggleDropdown}>
            <LuSlidersHorizontal />
            <span className='display-text'>Display</span>
            <FaAngleDown />
            <div className={`dropdown ${isDropdownVisible ? 'active' : ''}`}>
              <div className='grouping-filters'>
                <span className='filter-text'>Grouping</span>
                <select className='select-options'>
                  <option value='user'>User</option>
                  <option value='status'>Status</option>
                  <option value='priority'>Priority</option>
                </select>
              </div>
              <div className='ordering-filters'>
                <span className='filter-text'>Ordering</span>
                <select className='select-options'>
                  <option value='title'>Title</option>
                  <option value='priority'>Priority</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className='dark-mode-toggle' onClick={toggleDarkMode}>
          {isDarkMode ? '🌞' : '🌜'}
        </div>
      </div>
      <div className='main-body'>
        {/* Your main content goes here */}
      </div>
    </div>
  );
}

export default Dashboard;
