import AvatarPlusIcon from "./icons/AvatarPlusIcon";
import Users from '../../Users.js';
import { useRef ,useState} from "react";

// alert if The user who enterd does not exist
function ErrorUserIsNotExist(){
    return(
      <div className="alert" role="alert">The user you entered does not exist.</div>
    );
}

// alert if The user try to add himself as contact.
function ErrorCanotAddMySelf(){
    return(
      <div className="alert" role="alert">You can not add yourself as a contact.</div>
    );
}

// alert if The user try to add contact that he already have.
function ErrorAlreadyHaveTheContact(){
    return(
      <div className="alert" role="alert">You already have this contact.</div>
    );
}


export default function NewChat( {addChat,user}) {

    // reference to input of user
    const contactInput = useRef();

    // state to hendle error
    const [errorUserIsNotExist, setErrorUserIsNotExist] = useState("");
    const [errorCanotAddMySelf, setErrorCanotAddMySelf] = useState("");
    const [errorAlreadyHaveTheContact, setErrorAlreadyHaveTheContact] = useState("");

    const clearErorrs = function(){
        setErrorCanotAddMySelf("");
        setErrorUserIsNotExist("");
        setErrorAlreadyHaveTheContact("");
        document.getElementById('newcontant').value = '';
    }

    const addContact = function(){
        // the input of the new contact
        let contactName = contactInput.current.value;
        if(contactName === user.username){
            setErrorUserIsNotExist("");
            setErrorAlreadyHaveTheContact("");
            setErrorCanotAddMySelf("error");
            return;

        }
    
        // find the new contact in the Users list. if it exists, add it to the user's friends.
        for (var key in Users) {
            if (key == contactName) {
                // check if the user try to add contact that already exsit.
                for (var index = 0; index < user.friends.length; index++) {
                    if (user.friends[index].username===key){
                        setErrorCanotAddMySelf("");
                        setErrorUserIsNotExist("");
                        setErrorAlreadyHaveTheContact("eroor");
                        return;
                    }
                }
                addChat({username:key, nickname: Users[key].nickname, image: Users[key].image, chat: []});
                document.getElementById('newcontant').value = '';
                setErrorCanotAddMySelf("");
                setErrorUserIsNotExist("");
                setErrorAlreadyHaveTheContact("");
                return;
            }
        }
        if(contactName===""){
            setErrorCanotAddMySelf("");
            setErrorUserIsNotExist("");
            setErrorAlreadyHaveTheContact("");
            return;
        }
        setErrorAlreadyHaveTheContact("");
        setErrorCanotAddMySelf("");
        setErrorUserIsNotExist("not exist");
    }


    // Returns a button that pops up a modal that allows you to add a new contact.
    return (
        <div className="newchat">
            <button type="button" className="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#addChat">
                <AvatarPlusIcon />
            </button>

            <div className="modal fade" id="addChat" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                 <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add new contact</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={clearErorrs}></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group row">
                                <div className="col-sm-12">
                                    {(errorUserIsNotExist!="")?(<ErrorUserIsNotExist/>):""}
                                    {(errorAlreadyHaveTheContact!="")?(<ErrorAlreadyHaveTheContact/>):""}
                                    {(errorCanotAddMySelf!="")?(<ErrorCanotAddMySelf/>):""}
                                </div>
                                <div className="col-sm-12">
                                    <input placeholder="contact's identifier" id="newcontant" name="nwecontant" ref={contactInput}></input>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={clearErorrs}>Close</button>
                            <button type="submit" className="btn btn-primary" onClick={addContact}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}