"use client";

import {useRef, useEffect} from "react";

export default function SquatGate(){
    const videoRef = useRef<HTMLVideoElement>(null)

     useEffect(() => {
                let stream; 

                async function startCamera() {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true })

                    if (videoRef.current){
                        videoRef.current.srcObject = stream 
                        videoRef.current.play()       
                    }
                }

                startCamera();

                return () => {
                    stream?.getTralcks().forEach((track) => track.stop());
                };
            }, []); 

    return(
        <div>
            <video ref = {videoRef} className = "fixed inset-0 w-full h-full object-cover" autoPlay muted playsInline/>
        </div>
    )
} 