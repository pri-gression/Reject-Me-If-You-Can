"use client";

import React from "react";
import { useState } from "react";
import confetti from "canvas-confetti";

export default function App(){
    
    const [position, setPosition] = useState < {x: number, y:number} | null>(null);

    const [showForm, setShowForm] = useState(false); 
    const [message, setMessage] = useState("");

    const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqevkzpy"; 

    const [status, setStatus] = useState("idle")

    const [obstacle, setObstacle] = useState < string | null > (null); 
 
    function rejectMe(){

      const rejectArray = ["dodge", "error", "dodge", "sure", "dodge"]

      const random = rejectArray[Math.floor(Math.random() * rejectArray.length)]

      if (random == "dodge"){
        const randomX = Math.floor(Math.random() * 80) + 10;
        const randomY = Math.floor(Math.random() * 80) + 10;

        // set the position to random x and y 
        setPosition({x: randomX, y: randomY});
      }
      else if (random == "error"){
        setObstacle("error");
      }
      else if (random == "sure"){
        setObstacle("sure");
      }
    }

    async function sendMessage() {
      setStatus("sending");
      try {
        const res = await fetch (FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
          },
          body : JSON.stringify({message}),
        });

        if (res.ok) {
          setStatus("sent");
          setMessage("");
        }
        else {
          setStatus("error")
        }
      }
      catch (err) {
        setStatus("error")
      }
    }

    return (
      <div > 

            {obstacle === "error" && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <p className = "text-black"> Error 403: Rejection Rejected 😡 </p>
                  <button className = "bg-red-900 text-black rounded-lg w-20" onClick={() => setObstacle(null)}>Close</button>
                </div>
              </div> 
            )}

            {obstacle === "sure" && (
              <div className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className = "bg-white rounded-2xl shadow-xl p-8 flex gap-4 flex-row items-center"> 
                    <p className = "text-black"> Are you sure ? </p>
                    <button className = "bg-red-900 text-white rounded-lg w-20" onClick = {() => setObstacle(null)}> Nah </button>
                    <button className = "bg-green-900 text-white rounded-lg w-20" onClick = {() => setObstacle(null)}> I'm unsure </button>
                  </div>
              </div>
            )} 

          {showForm ? (
            <div className = "bg-linear-to-b from-orange-300 via-amber-200 to-amber-50 flex-col items-center flex gap-4 w-full min-h-screen justify-center" >

              <textarea className = "bg-rose-50 text-black rounded-3xl w-100 h-50 font-semibold w-50 shadow-2xl focus:ring-2 focus:ring-orange-300 focus:outline-none"
              value = {message} 
              onChange = {(e) => setMessage(e.target.value)} 
              placeholder = "   Hi Pritika...Lets give you a shot (Pretty Please 😸)"
              />

              <button onClick = {() => {sendMessage(); confetti();}}
              className = "bg-linear-to-b from-blue-300 to-green-600 text-black px-6 py-3 rounded-lg font-semibold w-20"> 
               Send 
              </button>

              {status == "sending" && <p className = "text-black"> Sending... </p>}
              {status == "sent" && <p className = "text-black">Got it — Pritika will see this 🎉</p>}
              {status == "error" && <p className = "text-black"> Oopsie, made a Whoopsie. Maybe Try Again ? </p>}

            </div>
          ) : (
            <div className = "flex flex-row items-center flex gap-15 justify-center min-h-screen py-2"> 
              <button onMouseEnter = {rejectMe} onClick = {rejectMe}
              className = "bg-linear-to-b from-orange-400 to-red-800 text-red-950 px-8 py-3 h-30 w-30 rounded-full font-semibold shadow-[6px_6px_0px_#991b1b] hover:scale-105 hover:brightness-110 transition"
              style = {position ? { position: "fixed", left: position.x + "%", top: position.y + "%"} : undefined}> 
                Reject Pritika 
              </button>

              <button onClick = {() => {setShowForm(true); }}
              className = "bg-linear-to-b from-yellow-400 to-green-800 text-green-950 px-8 py-3 h-30 w-30 rounded-full font-semibold shadow-[6px_6px_0px_#052e16] hover:scale-105 hover:brightness-110 transition"> 
                Hire Pritika 
              </button>
            </div>
          )}
      </div>
    );
}
