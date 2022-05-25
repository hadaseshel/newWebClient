import './Login.css';
import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';


// alert if there is wong Details
function WongDetails(){
  
  return(
    <div className="alert" role="alert">Incorrect username or password.</div>
  );
}

// alert if there is empty input
function EmptyDetails(){
  return(
    <div className="alert" role="alert">You did not enter username or password.</div>
  );
}

// if there is error in serevr
function ErrorInServer(){
  return(
    <div className="alert" role="alert">There is a problem with your server, can not login.</div>
  );
}

function Login() {
  // reference to input of user
  const usernameInput = useRef();
  const passwordInput = useRef();
  const navigate = useNavigate();

  // states for hendale errors
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState("");
  const [errorServer, setErrorServer] = useState("");

  const checkLogin = async function(){
    let userName = usernameInput.current.value;
    let password = passwordInput.current.value;
    const response = await fetch('http://localhost:5034/api/users/');
    let Users;
    if(response.status == 404){
      setError("");
      setEmpty("");
      setErrorServer("ERROR");
      return;
    }else{
      setErrorServer("");
      Users = await response.json();
    }
    //let Users = await response.json();
    for (var i in Users){
      const user = Users[i];
      // if the username and the password are correct, move to the chats page. (working!)
        if (userName === user.id && password === user.password){
          navigate("/chats",{state: {username: user.id, password: user.password, nickname: user.nickname, image: user.image, friends: user.contacts ,server:user.server}});
          return;
        }
      }
      if(userName === "" || password === ""){
        setError("");
        setEmpty("empty");
      } else{
        setEmpty("");
        setError("error");
      }
  }

    // handle the enter key , login by press in enter key
    const handleKeypress = e => {
      //it triggers by pressing the enter key to send the massage
      if (e.key === "Enter") {
        checkLogin();
      }
    };

    return (
    <div className = "container"> 
        <img src="logoHioosh.png" id ="logo" width = "170" height= "170"></img>
        <div id = "login" onKeyPress={handleKeypress}>
          {(errorServer!="")?(<ErrorInServer/>):""}
          {(error!="")?(<WongDetails/>):""}
          {(empty!="")?(<EmptyDetails/>):""}
          <div className="form-group row">
            <label className="col-sm-4 col-form-label"> Username </label>
            <div className="col-sm-8">
              <input type="text" placeholder="Enter Username" id="uname" name="uname" ref={usernameInput}></input>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-4 col-form-label"> Password </label> 
            <div className="col-sm-8">
              <input type="password" placeholder="Enter Password" id="password" name="password" ref={passwordInput}></input>
            </div>
          </div>
          
          <div>
            <button type="button" className="btn btn-success" onClick={checkLogin}>Login</button>
          </div>
          
          <div>
            <label> Not registred? </label>
            <button className="button_of_link" onClick={()=>{navigate("/regist")}}>Click here</button>
            <label>to register </label> 
          </div>

          <div>
            <label>Would you like to rate us?&nbsp; </label>
            <a className="button_of_link" href="http://localhost:5034/">Click here</a>
            <label>&nbsp;to rate the site </label> 
          </div>
        </div>
        <div className="form-group row" id="last div">&nbsp;</div>
     </div>
    );
  }

  export default Login;
  