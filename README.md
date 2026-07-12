 # Reject Me If You Can 🏃‍♀️💨

> A build-and-show job application. You're welcome to reject me — if you can catch the button.

**Live demo → https://reject-me-if-you-can-v7m2.vercel.app/**

## What is this?

Lyra doesn't ask for résumés — they ask you to *build and show*. So instead of a CV, I built a site with two buttons: **Reject Pritika** and **Hire Pritika**.

The catch: the **Reject** button doesn't *want* to be clicked. It runs from your cursor, and when you get close it throws a random obstacle at you — an error, an *"Are you sure? (No / No)"* popup, or a challenge to do **100 squats**, counted live by your webcam. The **Hire** button, meanwhile, just works: it opens a sunny form and sends me a message.

A joke wrapped around real engineering.

## ✨ Features

- **A reject button that dodges your cursor** (and reacts to taps on mobile too).
- **Randomized obstacles** on every reject attempt — error popups, an "Are you sure?" with two *No* buttons, and a squat gate.
- **🏋️ Real-time AI squat counter** *(the fun part)* — opens your webcam, tracks your body with a pose-detection model, measures your knee angles, and counts squats. Do 100 to unlock rejection. (You'll probably give up and hire me.)
- **Hire flow** — a warm animated form that sends a message straight to my inbox, with a confetti payoff. 🎉

## 🛠️ Tech Stack

| Framework | **Next.js** (App Router) |
| Language | **TypeScript** |
| UI | **React** · **Tailwind CSS** |
| Computer vision | **TensorFlow.js** + **MoveNet** (pose detection) |
| Messaging | **Formspree** |
| Delight | **canvas-confetti** |
| Hosting | **Vercel** |

## 🤖 The interesting part: real-time squat detection

The `/squats` route is a from-scratch computer-vision pipeline:

1. **Webcam** access via `getUserMedia`, streamed into a `<video>`.
2. **MoveNet** (TensorFlow.js, WebGL backend) runs pose detection each frame → 17 body keypoints.
3. A `<canvas>` overlay draws the live **skeleton**.
4. The **knee angle** is computed from hip/knee/ankle keypoints (`atan2`), averaged across both legs, and gated on keypoint confidence.
5. A small **state machine** — *arm on the way down, fire on the way up* — counts a rep only on a full standing → squatting → standing cycle.

## 🚀 Running locally

```bash
git clone https://github.com/pri-gression/Reject-Me-If-You-Can.git
cd Reject-Me-If-You-Can
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> **Note:** this project builds with **webpack**, not Turbopack (`next dev --webpack`) — TensorFlow.js's MediaPipe dependency doesn't bundle cleanly under Turbopack. The npm scripts are already configured for this.

No environment variables required — the Formspree endpoint is public-safe.

## 📁 Structure

```
app/
  page.tsx          # main page — reject/hire buttons, obstacles, hire form
  squats/page.tsx   # the AI squat-counter challenge
```

