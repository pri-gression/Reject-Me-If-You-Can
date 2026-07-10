"use client";

import {useRef, useEffect} from "react";
import * as poseDetection from '@tensorflow-models/pose-detection'; // Importing the model 
import "@tensorflow/tfjs";

export default function SquatGate() {
    
    const videoRef = useRef<HTMLVideoElement>(null); //video box/variable where live camera stream will be passed 
    const canvasRef = useRef<HTMLCanvasElement>(null); //a transparent drawing board, same size as the video where skeleton will be drawn
    const detectorRef = useRef<poseDetection.PoseDetector | null>(null); //it stores the pose detector box/variable where model will be loaded 

    const detectPose = async () => { //async function because it awaits poses by the model

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const detector = detectorRef.current;

        if (video && detector && video.videoWidth > 0 && video.videoHeight) { 

            const pose = await detector.estimatePoses(video); // detect the 17 points 
            console.log(pose)

            canvas.width = video.videoWidth; // cover the video with the canvas, same size 
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d"); 

            if (ctx && pose.length > 0){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (const kp of pose[0].keypoints){
                    if (kp.score && kp.score > 0.3){
                        ctx.beginPath();
                        ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
                        ctx.fillStyle = "red"; 
                        ctx.fill();
                        }
                    }
                }
            }
        requestAnimationFrame(detectPose); //recursive call to keep up with the live frame 
        };

        useEffect(() => { // use effect to start the camera feed into video
            let stream; 

            async function startCamera() {
                stream = await navigator.mediaDevices.getUserMedia({ video: true })

                if (video){
                    video.srcObject = stream 
                    video.play()       
                }
            }

            startCamera();

            return () => {
                stream?.getTracks().forEach((track) => track.stop());
            };
        }, []); 

        useEffect(() => {
            async function loadModel(){
                const detector = await poseDetection.createDetector(
                    poseDetection.SupportedModels.MoveNet,
                    { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING}
                );
                detectorRef.current = detector;
                detectPose();
            } 
            loadModel();             
        }, []); 

    return (
        <div>
            <video ref = {videoRef} className = "fixed inset-0 w-full h-full object-cover" autoPlay muted playsInline/>
            <canvas ref = {canvasRef} className = "fixed inset-0 w-full h-full object-cover z-10"/>
        </div>
    );
}