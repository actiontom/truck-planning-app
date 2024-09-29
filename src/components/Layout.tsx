import React, { useState } from 'react';
import ListTruck from './ListTruck';
import './Layout.css'; // Import the custom CSS for additional styling

const Layout: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeComponent) {
      case 'listTrucks':
        return <ListTruck />;
      default:
        return <p>Welcome! Please select an option from the menu.</p>;
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar bg-primary text-white">
        <h2 className="p-3">App Logo</h2>
        <nav className="nav flex-column p-3">
        <button
            className="btn btn-primary mb-2 text-start"
            onClick={() => setActiveComponent(null)}
          >
            Home
          </button>
          <button
            className="btn btn-primary mb-2 text-start"
            onClick={() => setActiveComponent('listTrucks')}
          >
            Trucks
          </button>
          {/* Placeholder for more buttons */}
          
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="content p-3">
        <header className="header mb-4">
          <h1>Truck Planning Application</h1>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

export default Layout;
