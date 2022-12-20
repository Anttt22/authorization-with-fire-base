import { useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
const history= useHistory();

  const newPasswordInputRef= useRef()

  const authCtx= useContext(AuthContext)

  const submitHandler=(event)=>{
    event.preventDefault();
    const enteredNewPassword=newPasswordInputRef.current.value;
    //validation
    
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyA-MoAlUhECDzfKHvVPIpeO4b-z3kgN1kQ',
    {
      method: 'POST',
      body:JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false,

      }),
      headers: {
        'Content-Type' : 'application/json',
      }
    }
    ).then(res=>{
      //asssume always no error..
      history.replace('/')

    });
  };

  return (
    <form on onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input ref={newPasswordInputRef} minLength="7" type='password' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
