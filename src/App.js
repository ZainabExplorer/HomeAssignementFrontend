import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; 
import EmployeeComponent from './EmployeeComponent';
import VendorComponent from './VendorComponent';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <header className="app-header">
                    <h1 className="dashboard-link"><Link to="/">Admin Dashboard</Link></h1>
                    
                    <nav>
                      
                        <ul className="nav-links">
                            <li><Link to="/employees">Employees</Link></li>
                            <li><Link to="/vendors">Vendors</Link></li>
                        </ul>
                    </nav>
                    
                </header>

                <main className="app-main">

                    <Routes>
                        <Route path="/employees" element={<EmployeeComponent />} />
                        <Route path="/vendors" element={<VendorComponent />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
