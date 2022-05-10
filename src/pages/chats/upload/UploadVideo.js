import { useRef, useState } from "react";
import CameraReels from "../icons/CameraReels";
import "./Upload.css";

function UploadVideo({send}){
    const[video,setVideo] = useState(null);
    const target = useRef(null);

    const HandelUpload = (e) => {
        const uploaded = e.target.files[0];
        setVideo(URL.createObjectURL(uploaded));
    }

    return(
        <div className="upladeVideo">
        <button type="button" className="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#uploadVideo">
            <CameraReels /> Video
        </button>

        <div className="modal fade" id="uploadVideo" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Upload Video</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group row">
                            <div className="col-sm-12">
                                {/* errors here */}
                            </div>
                            <div className="col-sm-12">
                                <label htmlFor="video" className="btn btn-primary"><CameraReels/> Select video</label>
                                <input type="file" id="video" accept="video/*" ref={target} onChange={(e)=>HandelUpload(e)}/>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary" 
                        onClick={() => {send({msgType: "Video", msg: video})}}>
                            Send</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default UploadVideo;