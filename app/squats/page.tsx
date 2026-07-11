"use client";

import {useRef, useEffect} from "react";
import * as poseDetection from '@tensorflow-models/pose-detection'; // Importing the model 
import * as tf from "@tensorflow/tfjs";

export default function SquatGate() {
    
    const videoRef = useRef<HTMLVideoElement>(null); //video box/variable where live camera stream will be passed 
    const canvasRef = useRef<HTMLCanvasElement>(null); //a transparent drawing board, same size as the video where skeleton will be drawn
    const detectorRef = useRef<poseDetection.PoseDetector | null>(null); //it stores the pose detector box/variable where model will be loaded 

    const detectPose = async () => { //async function because it awaits poses by the model

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const detector = detectorRef.current;

        if (video && canvas && detector && video.videoWidth > 0 && video.videoHeight) { 

            const pose = await detector.estimatePoses(video); // detect the 17 points 

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
            
            const pairs = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet); 
            
            if (ctx && pose.length > 0) { // A check to avoid the crash if the person is moving out of the frame 
                for (const [i,j] of pairs){
                    const kp1 = pose[0].keypoints[i];
                    const kp2 = pose[0].keypoints[j]; 
                    if (kp1.score > 0.3 && kp2.score > 0.3){
                        ctx.beginPath();
                        ctx.moveTo(kp1.x, kp1.y);
                        ctx.lineTo(kp2.x, kp2.y);
                        ctx.strokeStyle = "lime";
                        ctx.lineWidth = 3;
                        ctx.stroke();
                    }
                }
            }

            if (ctx && pose.length > 0) { 
                const leftHip   = pose[0].keypoints[11];
                const leftKnee  = pose[0].keypoints[13];
                const leftAnkle = pose[0].keypoints[15];
                const rightHip   = pose[0].keypoints[12];
                const rightKnee  = pose[0].keypoints[14];
                const rightAnkle = pose[0].keypoints[16];

                if (leftHip.score > 0.3 && leftKnee.score > 0.3 && leftAnkle.score > 0.3) {

                    const leftAngle = calculateAngle(pose[0].keypoints[11], pose[0].keypoints[13],pose[0].keypoints[15]);
                    console.log("LA: ", leftAngle)
                }

                if (rightHip.score > 0.3 && rightKnee.score > 0.3 && rightAnkle.score > 0.3) {

                    const rightAngle = calculateAngle(pose[0].keypoints[12],pose[0].keypoints[14],pose[0].keypoints[16]); 
                    console.log("RA: ", rightAngle)
                }
            }
        }

        requestAnimationFrame(detectPose); // scheduled loop for detect pose 
    };

    // Calculate angle between line segments/keypoints 

    const calculateAngle = (firstPoint: poseDetection.Keypoint, vertex:poseDetection.Keypoint , secondPoint:poseDetection.Keypoint): number => {
            // Hip to Knee 
            const angle1 = Math.atan2(vertex.y - firstPoint.y, vertex.x - firstPoint.x);
            // Knee to Angle 
            const angle2 = Math.atan2(vertex.y - secondPoint.y, vertex.x - secondPoint.x);

            let diff = Math.abs((angle2 - angle1) * (180 / Math.PI)); 

            // Normalise between 0 to 360 
            if (diff > 180) diff = 360 - diff

            return diff
        }

    useEffect(() => { // use effect to start the camera feed into video
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
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, []); 

    useEffect(() => {
        async function loadModel(){
            await tf.setBackend("webgl");
            await tf.ready();
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