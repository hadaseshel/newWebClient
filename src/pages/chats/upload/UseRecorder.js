import { useEffect, useState } from "react";

async function requestRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream);
}

function UseRecorder() {
    const [audioURL, setAudioURL] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);
  
    useEffect(() => {
      // Lazily obtain recorder first time we're recording.
        if (recorder === null) {
            if (isRecording) {
                requestRecorder().then(setRecorder, console.error);
            }
            return;
        }
  
        // Manage recorder state.
        if (isRecording) {
            recorder.start();
        } else {
            recorder.stop();
        }
  
        // Obtain the audio when ready.
        const handleData = e => {
            setAudioURL(URL.createObjectURL(e.data));
        };
  
        recorder.addEventListener("dataavailable", handleData);
        return () => recorder.removeEventListener("dataavailable", handleData);
    }, [recorder, isRecording]);
  
    // A function that is activated by pressing the record button and changing the recording mode
    const startStopRecording = function({setRecordState}){
        if (!isRecording) {
            setIsRecording(true);

            // Change the caption on the record button
            setRecordState("Recording... Click To Stop");
        } else {
            setIsRecording(false);
            setRecordState("Record Audio");
        }
    }
  
    return [audioURL, isRecording, startStopRecording];
};
  
export default UseRecorder;
  