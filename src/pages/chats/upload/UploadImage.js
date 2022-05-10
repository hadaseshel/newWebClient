import { useRef, useState } from "react";
import Image from "../icons/Image";
import "./Upload.css";

function UploadImage({send}){
    const[photo,setPhoto] = useState(null);
    const target = useRef(null);

    const HandelUpload = (e) => {
        const uploaded = e.target.files[0];
        setPhoto(URL.createObjectURL(uploaded));
    }

    return(
        <div className="upladeImage">
        <button type="button" className="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#uploadImage">
            <Image /> Image
        </button>

        <div className="modal fade" id="uploadImage" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Upload Image</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group row">
                            <div className="col-sm-12">
                                {/* errors here */}
                            </div>
                            <div className="col-sm-12">
                                <label htmlFor="img" className="btn btn-primary"><Image /> Select image</label>
                                <input type="file" id="img" accept="image/*" ref={target} onChange={(e)=>HandelUpload(e)}/>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary" onClick={() => {send({msgType: "Image", msg: photo})}}>Send</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default UploadImage;