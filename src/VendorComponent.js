import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Table, Alert } from 'react-bootstrap'; 
import './VendorComponent.css'; 

const VendorComponent = () => {
    const [vendors, setVendors] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [upi, setUpi] = useState('');
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showList, setShowList] = useState(false);
    const [showAlert, setShowAlert] = useState(false); 
    const [sentEmails, setSentEmails] = useState([]); 
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [upiError, setUpiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vendors');
            setVendors(response.data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    const toggleForm = () => {
        setShowForm(!showForm);
        setShowList(false); 
    };

    const toggleList = () => {
        setShowList(!showList);
        setShowForm(false); 
        setSelectedVendors([]);
    };

    const addVendor = async () => {
        setNameError('');
        setEmailError('');
        setUpiError('');
        setSuccessMessage('');

        let valid = true;
        if (!name.trim()) {
            setNameError('Please enter a name.');
            valid = false;
        }
        if (!email.trim()) {
            setEmailError('Please enter an email address.');
            valid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setEmailError('Please enter a valid email address.');
                valid = false;
            }
        }
        if (!upi.trim()) {
            setUpiError('Please enter a UPI.');
            valid = false;
        }

        if (!valid) {
            return;
        }

        const newVendor = { name, email, upi };
        try {
            await axios.post('http://localhost:8080/api/vendors', newVendor);
            fetchVendors();
            setName('');
            setEmail('');
            setUpi('');
            setSuccessMessage('Vendor added successfully!');
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                setSuccessMessage('');
            }, 3000); 
            setShowList(true);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                if (error.response.data && error.response.data.message === 'Email already exists') {
                    setShowAlert(true);
                    setSuccessMessage('Email already exists. Please use a different email.');
                    setTimeout(() => {
                        setShowAlert(false);
                        setSuccessMessage('');
                    }, 3000); 
                } else {
                    console.error('Error adding vendor:', error.response.data);
                }
            } else {
                console.error('Error adding vendor:', error);
            }
        }
    };

    const sendEmail = async () => {
        if (selectedVendors.length === 0) {
            alert('Please select at least one vendor to send emails.');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/vendors/send-email', selectedVendors);
           
            fetchSentEmails(); 
            setSelectedVendors([]);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000); 
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const fetchSentEmails = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vendors/sent-emails');
            setSentEmails(response.data);
        } catch (error) {
            console.error('Error fetching sent emails:', error);
        }
    };

    const handleVendorSelect = (vendorId) => {
        setSelectedVendors(prev => prev.includes(vendorId) ? prev.filter(id => id !== vendorId) : [...prev, vendorId]);
    };

    const handleNameChange = (value) => {
        setName(value);
        if (nameError) {
            setNameError('');
        }
    };

    const handleEmailChange = (value) => {
        setEmail(value);
        if (emailError) {
            setEmailError('');
        }
    };

    const handleUpiChange = (value) => {
        setUpi(value);
        if (upiError) {
            setUpiError('');
        }
    };

    return (
        <div className="vendor-container">
            <center><h2>Vendors</h2></center>
            <div className="button-container">
                <Button variant="primary" onClick={toggleForm}>Add Vendor</Button>
                <Button variant="success" onClick={toggleList}>List Vendors</Button>
            </div>
            {showForm && (
                <Form className="add-vendor-form">
                    <h3>Add Vendor</h3>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" value={name} onChange={e => handleNameChange(e.target.value)} />
                        {nameError && <Form.Text className="text-danger">{nameError}</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => handleEmailChange(e.target.value)} />
                        {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="formUPI">
                        <Form.Label>UPI</Form.Label>
                        <Form.Control type="text" placeholder="Enter UPI" value={upi} onChange={e => handleUpiChange(e.target.value)} />
                        {upiError && <Form.Text className="text-danger">{upiError}</Form.Text>}
                    </Form.Group>
                    <Button variant="primary" onClick={addVendor}>Submit</Button>
                </Form>
            )}
            {showList && (
                <div className="vendor-list">
                    <h3>Vendors</h3>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>UPI</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map(vendor => (
                                <tr key={vendor.id}>
                                    <td>{vendor.name}</td>
                                    <td>{vendor.email}</td>
                                    <td>{vendor.upi}</td>
                                    <td>
                                        <input type="checkbox" checked={selectedVendors.includes(vendor.id)} onChange={() => handleVendorSelect(vendor.id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button variant="primary" onClick={sendEmail}>Send Email to Selected Vendors</Button>
                </div>
            )}
            {showAlert && (
                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                    {successMessage}
                </Alert>
            )}
            {showList && (
                <div className="sent-emails">
                    <center><h1>Sent Emails</h1></center>
                    <ul>
                        {sentEmails.map((email, index) => (
                            <li key={index}>{email}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default VendorComponent;
