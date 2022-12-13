import { useEffect } from "react";
import { useRef } from "react";

const NeuriCamera = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 900 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  };

  return(
    <div id="NeuriCamDiv">
      <video ref={videoRef}/>
    </div>
  )
}

export default NeuriCamera