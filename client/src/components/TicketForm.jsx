import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TicketForm = () => {
    const url = process.env.REACT_APP_API_URL || window.REACT_APP_API_URL;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const requestData = { ...formData, status: "new" };

            const response = await fetch(`${url}/api/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Form submitted successfully:", data);
    
            toast.success('your request has been submitted', {
                autoClose: 2000,
            }); 
    
            // reseting form
            setFormData({
                name: "",
                email: "",
                message: "",
            });
        } catch (error) {
            console.error("Form submission error:", error);
        }
    };    

    console.log(formData);
    return (
        <form onSubmit={handleSubmit} className="ticket-form">
            <ToastContainer/>
                <div className="form-field">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        />
                </div>
                <div className="form-field">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />
                </div>
                <div className="form-field">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        />
                </div>
                <button type="submit" className="submit-button">Submit</button>
        </form>
    );
    
};

export default TicketForm;
