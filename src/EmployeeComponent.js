import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Table, Alert } from 'react-bootstrap'; 
import './EmployeeComponent.css'; 

const EmployeeComponent = () => {
    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState('');
    const [designation, setDesignation] = useState('');
    const [ctc, setCtc] = useState('');
    const [email, setEmail] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showList, setShowList] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const toggleForm = () => {
        setShowForm(!showForm);
        setShowList(false); 
    };

    const toggleList = () => {
        setShowList(!showList);
        setShowForm(false); 
    };

    const addEmployee = async () => {
        if (!name.trim() || !email.trim()) {
            alert('Name and Email are required.');
            return;
        }

        const newEmployee = { name, designation, ctc: parseFloat(ctc), email };
        try {
            await axios.post('http://localhost:8080/api/employees', newEmployee);
            fetchEmployees();
            setName('');
            setDesignation('');
            setCtc('');
            setEmail('');
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000); 
            setShowForm(false);
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };

    return (
        <div className="employee-container">
            <center><h2>Employees</h2></center>
            <div className="button-container">
                <Button variant="primary" onClick={toggleForm}>Add Employee</Button>
                <Button variant="success" onClick={toggleList}>List Employees</Button>
            </div>
            {showSuccessMessage && (
                <Alert variant="success" className="success-message">
                    Employee added successfully!
                </Alert>
            )}
            {showForm && (
                <Form className="add-employee-form">
                    <h3>Add Employee</h3>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formDesignation">
                        <Form.Label>Designation</Form.Label>
                        <Form.Control type="text" placeholder="Enter designation" value={designation} onChange={e => setDesignation(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formCTC">
                        <Form.Label>CTC</Form.Label>
                        <Form.Control type="number" placeholder="Enter CTC" value={ctc} onChange={e => setCtc(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" onClick={addEmployee}>Submit</Button>
                </Form>
            )}
            {showList && (
                <div className="employee-list">
                    <h3>Employees</h3>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Designation</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(employee => (
                                <tr key={employee.id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.designation}</td>
                                    <td>{employee.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default EmployeeComponent;
