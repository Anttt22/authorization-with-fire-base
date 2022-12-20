import { useRef, useState, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const history= useHistory();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx=useContext(AuthContext)

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const EmailRef = useRef();
  const PasswordRef = useRef()

  const submitHander = (event) => {
    event.preventDefault();
    const enteredEmail = EmailRef.current.value
    const enteredPassword = PasswordRef.current.value
    //validation can be added

    setIsLoading(true)
    let url;
    if (isLogin) {
      url= 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA-MoAlUhECDzfKHvVPIpeO4b-z3kgN1kQ'
    } else {
      url='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA-MoAlUhECDzfKHvVPIpeO4b-z3kgN1kQ';
    }
    fetch(url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json'
        }

      }).then(res => {
        setIsLoading(false) 
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(data => {
            let errorMessage='authentication failed';
            //show errror modal
          
            throw new Error(errorMessage)
          });
        }
      }).then(data=>{
        const expirationTime= new Date(new Date().getTime()+(+data.expiresIn*1000))
        authCtx.login(data.idToken, expirationTime.toISOString() );
        history.replace('/')
      }).catch(err=>{
        alert(err.message);
      })
  }


    return (
      <section className={classes.auth}>
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={submitHander}>
          <div className={classes.control}>
            <label htmlFor='email'>Your Email</label>
            <input ref={EmailRef} type='email' id='email' required />
          </div>
          <div className={classes.control}>
            <label htmlFor='password'>Your Password</label>
            <input ref={PasswordRef} type='password' id='password' required />
          </div>
          <div className={classes.actions}>
            {!isLoading&& <button>{isLogin ? 'Login' : 'Create Account'}</button>}
            {isLoading &&<p>Loading ...</p>}
            <button
              type='button'
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? 'Create new account' : 'Login with existing account'}
            </button>
          </div>
        </form>
      </section>
    );

  };

  export default AuthForm;
