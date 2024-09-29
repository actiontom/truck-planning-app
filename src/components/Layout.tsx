import React, { useState } from 'react';
import ListTruck from './ListTruck';
import ListDriver from './ListDriver';
import logo from '../assets/logo.png'; // Import the logo image
import './Layout.css';

const Layout: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeComponent) {
      case 'listTrucks':
        return <ListTruck />;
      case 'listDrivers':
        return <ListDriver />;
      default:
        return <p>Welcome! Please select an option from the menu.</p>;
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar bg-primary text-white">
        {/* Logo Section */}
        <div className="logo-container p-3">
          <img src={logo} alt="App Logo" className="img-fluid" />
        </div>
        <nav className="nav flex-column p-3">
          <button
            className="btn btn-primary mb-2 text-start"
            onClick={() => setActiveComponent('listTrucks')}
          >
            Trucks
          </button>
          <button
            className="btn btn-primary mb-2 text-start"
            onClick={() => setActiveComponent('listDrivers')}
          >
            Drivers
          </button>
          <button
            className="btn btn-primary mb-2 text-start"
            onClick={() => setActiveComponent(null)}
          >
            Home
          </button>
        </nav>
      </aside>

      <main className="content p-3">
        <header className="header mb-4">
          <h1>TransPorter</h1>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

export default Layout;
