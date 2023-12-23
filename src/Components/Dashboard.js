import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { LuSlidersHorizontal } from 'react-icons/lu';
import { FaAngleDown } from 'react-icons/fa6';
import axios from 'axios';

function Dashboard() {
  const [isDarkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem('isDarkMode')) || false
  );
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(
    localStorage.getItem('selectedFilter') || 'user'
  );
  const [data, setData] = useState({ tickets: [], users: [] });
  const [orderingFilter, setOrderingFilter] = useState(
    localStorage.getItem('orderingFilter') || 'title'
  );

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setDarkMode(newMode);
    localStorage.setItem('isDarkMode', JSON.stringify(newMode));
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setSelectedFilter(newFilter);
    localStorage.setItem('selectedFilter', newFilter);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://tfyincvdrafxe7ut2ziwuhe5cm0xvsdu.lambda-url.ap-south-1.on.aws/ticketAndUsers');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filterData = () => {
    let filteredTickets = data.tickets;
  
    // Apply grouping based on selected filter
    if (selectedFilter === 'user') {
      // Group by userId and get user names
      filteredTickets = data.tickets.reduce((grouped, ticket) => {
        const userName = data.users.find((user) => user.id === ticket.userId)?.name || 'Unknown User';
        (grouped[userName] = grouped[userName] || []).push(ticket);
        return grouped;
      }, {});
    } else if (selectedFilter === 'status') {
      // Group by status with predefined order
      const statusOrder = ['Backlog', 'Todo', 'In progress', 'Done', 'Cancelled'];
      filteredTickets = data.tickets.reduce((grouped, ticket) => {
        const status = statusOrder.includes(ticket.status) ? ticket.status : 'Other';
        (grouped[status] = grouped[status] || []).push(ticket);
        return grouped;
      }, {});
  
      // Add groups with no data
      statusOrder.forEach((status) => {
        if (!filteredTickets[status]) {
          filteredTickets[status] = [];
        }
      });
  
      // Sort the groups based on the predefined order
      filteredTickets = Object.fromEntries(
        Object.entries(filteredTickets).sort((a, b) => statusOrder.indexOf(a[0]) - statusOrder.indexOf(b[0]))
      );
    } else if (selectedFilter === 'priority') {
      // Group by priority
      filteredTickets = data.tickets.reduce((grouped, ticket) => {
        (grouped[ticket.priority] = grouped[ticket.priority] || []).push(ticket);
        return grouped;
      }, {});
    }
  
    if (orderingFilter === 'title') {
      Object.keys(filteredTickets).forEach((groupKey) => {
        filteredTickets[groupKey].sort((a, b) => a.title.localeCompare(b.title));
      });
    } else if (orderingFilter === 'priority') {
      Object.keys(filteredTickets).forEach((groupKey) => {
        filteredTickets[groupKey].sort((a, b) => b.priority - a.priority);
      });
    
    }
  
    return filteredTickets;
  };
  

  const handleOrderingChange = (e) => {
    const newOrderingFilter = e.target.value;
    setOrderingFilter(newOrderingFilter);
    localStorage.setItem('orderingFilter', newOrderingFilter);
  };

  const renderGroupHeader = (groupKey) => {
    if (selectedFilter === 'user') {
      return <h3>{groupKey}</h3>;
    } else if (selectedFilter === 'priority') {
      return <h3>{getPriorityLabel(groupKey)}</h3>;
    } else if (selectedFilter === 'status') {
      return <h3>{groupKey}</h3>;
    }
  
    return null;
  };
  

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case '0':
        return 'No Priority';
      case '1':
        return 'Low';
      case '2':
        return 'Medium';
      case '3':
        return 'High';
      case '4':
        return 'Urgent';
      default:
        return '';
    }
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
                <select className='select-options' onChange={handleFilterChange} value={selectedFilter}>
                  <option value='user'>User</option>
                  <option value='status'>Status</option>
                  <option value='priority'>Priority</option>
                </select>
              </div>
              <div className='ordering-filters'>
                <span className='filter-text'>Ordering</span>
                <select className='select-options' onChange={handleOrderingChange} value={orderingFilter}>
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
        <div className='user-row'>
          {Object.keys(filterData()).map((groupKey) => (
            <div key={groupKey} className='column'>
              <div className='card-header'>{renderGroupHeader(groupKey)}</div>
              {filterData()[groupKey].map((ticket) => (
                <div key={ticket.id} className='ticket-card'>
                  <h>{ticket.title}</h>
                  <p>Status: {ticket.status}</p>
                  <p>Priority: {ticket.priority}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
