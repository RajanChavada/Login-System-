import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function LoginCard() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loginResult, setLoginResult] = useState(false);
    const history = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault(); // Prevent default form submission
        console.log('Form data:', formData); // Log form data to console
    }

    function sendData(e) {
        e.preventDefault();
        fetch('http://127.0.0.1:5000/send-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            console.log("response: ", data);
            if (data.success) {
                setLoginResult(true);
                setTimeout(() => history("/home"), 2000);

            } else {
                setLoginResult(false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setLoginResult(false);
        });
        console.log(JSON.stringify(formData));
    }

    return (
        <div className='card-wrapper'>
            <h3>Login</h3>
            <p>Please enter your login and password</p>
            <form className='form' onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder='Email'
                    onChange={handleChange}
                    name="email"
                    value={formData.email}
                />
                <input
                    type="text"
                    placeholder='Password'
                    onChange={handleChange}
                    name="password"
                    value={formData.password}
                />
                <button type='submit' onClick={sendData}>Login</button>

                <small>Don't have an account? <a href='/Register' >Register here</a></small>

                {loginResult ? <p>Login success</p> : <p>Login Failed</p> }
            </form>
        </div>
    );
}
