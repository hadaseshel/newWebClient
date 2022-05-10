import { useState } from "react";
import UseRecorder from "./UseRecorder";
import Mic from "../icons/Mic";

function UploadAudio({send}){

    let [audioURL, isRecording, startStopRecording] = UseRecorder();

    // in order to change the caption on the record button
    const [recordState, setRecordState] = useState("Record Audio");


    return(
        
        <div className="upladeAudio">
        <button type="button" className="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#uploadAudio">
            <Mic /> Audio
        </button>

        <div className="modal fade" id="uploadAudio" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Upload Audio</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group row">
                            <div className="col-sm-12">
                                {/* errors here*/ }
                            </div>
                            <div className="col-sm-12">
                                <label htmlFor="audio" className="btn btn-primary" onClick={() => {startStopRecording({setRecordState: setRecordState})}}><Mic/> {recordState} </label>
                        
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary" onClick={() => {send({msgType: "Audio", msg: audioURL})}}>Send</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
    
}


export default UploadAudio;