import {useNavigate} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './CSS/Login.css';

const Signup = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem('user-info'))
        {
            navigate('/');
        }
    }, [])
    
    const [name, setName]=useState("")
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    
    
    async function signUp() {
        const item = { name, email, password }
        console.warn(item)

        //fetch from db
        let result = await fetch("http://127.0.0.1:8000/api/register", {
            method: 'POST', 
            body: JSON.stringify(item),
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            }
        })
        result = await result.json()
        localStorage.setItem("user-info", JSON.stringify(result))
        navigate('/')
    }
    return (
        <div className='loginsignup'>
          <div className="loginsignup-container">
            <h1>Register</h1>
            <div className="loginsignup-fields">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="Name"></input>
              <input type="email" placeholder='Email Address' value={email} onChange={(e) => setEmail(e.target.value)}/>
              <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="loginsignup-agree">
            </div>
            <button onClick={signUp}>Sign Up</button>
          </div>
        </div>
      )
}

export default Signup