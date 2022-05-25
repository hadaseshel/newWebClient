import AvatarPlusIcon from "./icons/AvatarPlusIcon";
import { useRef ,useState} from "react";

// alert if There was a problem with the contact's server
function ErrorServerNotAilability(){
    return(
      <div className="alert" role="alert">There was a problem with your server, the new contact could not be added.</div>
    );
}

// alert if There was a problem with the contact's server
function ErrorNoContactsInServer(){
    return(
      <div className="alert" role="alert">There is no contact with the user name you entered in the server you entered.</div>
    );
}

// alert if There was a problem with the contact's server
function ErrorContactsServerNotAilability(){
    return(
      <div className="alert" role="alert">There is a problem connecting to the contact's server, please check if the server address is accurate.</div>
    );
}

// alert if The user who enterd does not exist
function ErrorEmptyFields(){
    return(
      <div className="alert" role="alert">You must fill in all the fields.</div>
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


export default function NewChat( {addChat,user,chatList}) {

    // reference to input of user
    const idInput = useRef();
    const nicknameInput = useRef();
    const serverInput = useRef();

    // state to hendle error
    const [errorServerNotAilability, setErrorServerNotAilability] = useState("");
    const [errorContactsServerNotAilability, setErrorContactsServerNotAilability] = useState("");
    const [errorEmptyFields, setErrorEmptyFields] = useState("");
    const [errorCanotAddMySelf, setErrorCanotAddMySelf] = useState("");
    const [errorAlreadyHaveTheContact, setErrorAlreadyHaveTheContact] = useState("");
    const [errorNoContactsInServer, setErrorNoContactsInServer] = useState("");

    const clearErorrs = function(){
        setErrorNoContactsInServer("");
        setErrorServerNotAilability("");
        setErrorContactsServerNotAilability("");
        setErrorCanotAddMySelf("");
        setErrorEmptyFields("");
        setErrorAlreadyHaveTheContact("");
    }

    const clearField = function(){
        document.getElementById('idcontant').value = '';
        document.getElementById('nicknamecontant').value = '';
        document.getElementById('servercontant').value = '';
    }

    const addContact = function(){
        // the input of the new contact
        let contactName = idInput.current.value;
        let nicknamecontant = nicknameInput.current.value;
        let servercontant = serverInput.current.value;
        if(contactName === user.username){
            clearErorrs();
            setErrorCanotAddMySelf("error");
            return;

        }
        if(contactName==="" || nicknamecontant ==="" || servercontant === ""){
            clearErorrs();
            setErrorEmptyFields("error");
            return;
        }
        // check if the user try to add contact that already exsit.
        for (var item in chatList) {
            if (chatList[item].id === contactName){
                clearErorrs();
                setErrorAlreadyHaveTheContact("eroor");
                return;
            }
        }
        addChat({id:contactName, nickname: nicknamecontant, server: servercontant,
            setConEr: setErrorContactsServerNotAilability, setSerEr:setErrorServerNotAilability, setConExitEr: setErrorNoContactsInServer});
        clearErorrs();
        clearField();
        return;        
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
                                    {(errorEmptyFields!="")?(<ErrorEmptyFields/>):""}
                                    {(errorAlreadyHaveTheContact!="")?(<ErrorAlreadyHaveTheContact/>):""}
                                    {(errorCanotAddMySelf!="")?(<ErrorCanotAddMySelf/>):""}
                                    {(errorServerNotAilability!="")?(<ErrorServerNotAilability/>):""}
                                    {(errorContactsServerNotAilability!="")?(<ErrorContactsServerNotAilability/>):""}
                                    {(errorNoContactsInServer!="")?(<ErrorNoContactsInServer/>):""}
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-12">
                                        <input placeholder="Enter the user name of the new contact" id="idcontant" name="idcontant" ref={idInput}></input>
                                    </div>
                                </div>
                                <div>&nbsp;</div>
                                <div className="form-group row">
                                    <div className="col-sm-12">
                                        <input placeholder="Enter the nickname of the new contact" id="nicknamecontant" name="nicknamecontant" ref={nicknameInput}></input>
                                    </div>
                                </div>
                                <div>&nbsp;</div>
                                <div className="form-group row">
                                    <div className="col-sm-12">
                                        <input placeholder="Enter the server of the new contact" id="servercontant" name="servercontant" ref={serverInput}></input>
                                    </div>
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