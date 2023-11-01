
import './CSS/Login.css'
import {Link, useNavigate} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
const Login = () => {

    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");

    // for local storage info
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem('user-info'))
        {
            navigate('/');
        }
    }, [])

    //login user
    async function login(){
        const item = {email, password};
        console.warn(email, password);
        let result = await fetch("http://127.0.0.1:8000/api/login",{
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify(item)
        });
        result = await result.json();
        localStorage.setItem("user-info", JSON.stringify(result));
        navigate('/');


    }
    
    return (
        <div className='loginsignup'>
          <div className="loginsignup-container">
            <h1>Login</h1>
            <div className="loginsignup-fields">
              <input type="email" placeholder='Email Address' value={email} onChange={(e) => setEmail(e.target.value)}/>
              <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <p className="loginsignup-login">Don't have an account? <Link to='/signup'><span>Sign Up here</span></Link></p>
            <div className="loginsignup-agree">
            </div>
            <button onClick={login}>Log In</button>
          </div>
        </div>
      )
}

export default Login