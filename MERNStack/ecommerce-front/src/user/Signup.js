// using react hook and using function usestate to manipulate state
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { signup } from '../auth';


const Signup = () => {
	  //instead of doing for each field is const [name, setName] = useState('') we can do in below way
	  const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });


	const { name, email, password, success, error } = values;  

	//A higher order(handleChange) function is a function returning another higher order function
	const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    

    const clickSubmit = event => {
      	//Using event.preventDefault() we are preventing the browsers default action of reload
        event.preventDefault();
        setValues({ ...values, error: false });
        signup({ name, email, password }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    success: true
                });
            }
        });

    };


    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            New account is created. Please <Link to="/signin">Signin</Link>
        </div>
    );



	const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" className="form-control" value={email}  />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" className="form-control" value={password}/>
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

	return(
    // 8 grids and offset-md-2 means 2 cols both towards left and right which is total 4.
	<Layout title= "Signup" description = "Signup to Node React E-Comm App" className="container col-md-8 offset-md-2">
         {showSuccess()}
         {showError()}
         {signUpForm()}
         
	 </Layout>
	 );
}



export default Signup;
