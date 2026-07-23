# FreeCall 📞
### A Free VoIP Web Calling App — Built with React.js + Node.js

> Call Anyone. Anytime. Free. — Browser-based voice calling with caller ID masking, ad-based free minutes, and real-time WebRTC technology.

---

## 🚀 What We Built

FreeCall is a full-stack web application inspired by **IndyCall** — a platform that lets users make free calls to real phone numbers. Instead of building a simple CRUD app, we built a **real-time communication system** that demonstrates advanced concepts like WebRTC, WebSockets, signaling servers, and PSTN bridging.

### Key Features
- 🔐 **User Authentication** — Signup, Login with JWT tokens
- 📞 **Web-to-Web Calling** — Real-time voice/video calls between browsers using WebRTC
- 🎭 **Caller ID Masking** — Receiver sees a different/custom number, not your real number
- 🔀 **Random Number Mode** — Different virtual number shown on every call
- 💰 **Wallet System** — Free minutes earned by watching ads or purchased via plans
- 📋 **Call History** — Date-wise grouped incoming, outgoing, and missed calls
- 👥 **Contacts** — Add, search, and favorite contacts
- ⚙️ **Settings** — Custom caller ID, mic, notifications, dark mode
- 👤 **Profile** — Edit name, email, phone — updates reflected everywhere in real-time

---

## 🏗️ How It Works (Architecture)

```
User A (Browser)                        User B (Browser)
     |                                        |
     |  1. Login via JWT Auth                 |
     |  2. Connect to Socket.io Server        |
     |                                        |
     |-----------> Node.js Signaling Server <------------|
     |      (exchanges SDP offer/answer + ICE candidates)
     |                                        |
     |======== Direct P2P Media Stream ========|
     |   Audio/Video flows DIRECTLY between   |
     |   browsers via WebRTC — NOT through    |
     |   your server (zero media cost)        |
     |=========================================|
     |                                        |
     STUN Server → Discovers public IP/port
     TURN Server → Relays media if P2P fails
```

### The Signaling Flow (Step by Step)

```
1. User A opens app → connects to Socket.io → registers with userId
2. User A types a number → clicks "Call Now"
3. Browser captures mic/camera via getUserMedia()
4. WebRTC creates an "offer" (SDP) describing call params
5. Offer sent to Node.js signaling server via socket
6. Server forwards offer to User B's socket
7. User B sees incoming call → accepts
8. User B creates an "answer" (SDP) → sent back via server
9. Both sides exchange ICE candidates (network paths)
10. Direct P2P connection established → audio flows freely
11. Server is no longer involved in the actual call
```

### Caller ID Masking Flow

```
User (Browser)
     |
     | — Dials +91 XXXXXXXXXX
     |
Node.js Backend
     |
     | — Calls Twilio API with:
     |     to: "+91 XXXXXXXXXX"  (receiver)
     |     from: "+91 70000 99999" (virtual/masked number)
     |     OR from: user's custom CallerID from Settings
     |
Twilio SIP Trunk
     |
     | — Routes call to real PSTN network
     |
Receiver's Phone
     | — Sees masked/virtual number, NOT caller's real number
     | — Cannot call back (temporary virtual number)
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js (Vite) | UI framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Routing | React Router DOM | Page navigation |
| State Management | React Context API | Global state (minutes, user, calls) |
| Real-time | Socket.io (client) | WebSocket signaling |
| Calling Engine | WebRTC (Browser API) | P2P audio/video |
| Backend | Node.js + Express | REST API + signaling server |
| WebSocket Server | Socket.io (server) | Real-time signaling |
| Database | MongoDB Atlas | Users, call logs, settings |
| Authentication | JWT + bcryptjs | Secure login |
| STUN Server | Google Public STUN | NAT traversal |
| TURN Server | Metered.ca / Open Relay | Fallback media relay |
| PSTN Calling | Twilio Voice API | Real phone number dial-out |
| Frontend Host | Vercel | Free deployment |
| Backend Host | Render.com | Free web service |

---

## 📁 Project Structure

```
freecall/
├── freecall-app/                   ← React Frontend
│   ├── src/
│   │   ├── context/
│   │   │   └── AppContext.jsx      ← Global state (minutes, user, calls, callerID)
│   │   ├── pages/
│   │   │   ├── Splash.jsx          ← Loading screen
│   │   │   ├── Login.jsx           ← Authentication
│   │   │   ├── Signup.jsx          ← Registration
│   │   │   ├── Home.jsx            ← Dashboard + Dialer + Recent calls
│   │   │   ├── Contacts.jsx        ← Contact list with favorites
│   │   │   ├── CallHistory.jsx     ← Date-grouped call history
│   │   │   ├── OutgoingCall.jsx    ← Calling screen with pulse animation
│   │   │   ├── IncomingCall.jsx    ← Accept/Decline screen
│   │   │   ├── ActiveCall.jsx      ← Live call with mute/hold/keypad
│   │   │   ├── CallEnded.jsx       ← Summary + rating + minutes deduction
│   │   │   ├── Wallet.jsx          ← Minutes balance + ad earning + plans
│   │   │   ├── Profile.jsx         ← Editable user profile
│   │   │   └── Settings.jsx        ← CallerID masking + preferences
│   │   ├── hooks/
│   │   │   └── useWebRTC.js        ← WebRTC logic (peer, ICE, offer/answer)
│   │   └── App.jsx                 ← Routes
│   └── package.json
│
└── freecall-server/                ← Node.js Backend
    ├── server.js                   ← Express + Socket.io entry point
    ├── config/db.js                ← MongoDB connection
    ├── models/
    │   ├── User.js                 ← User schema
    │   └── CallLog.js              ← Call history schema
    ├── controllers/
    │   ├── authController.js       ← Register, Login, JWT
    │   └── callController.js       ← Call logs, Twilio integration
    ├── routes/
    │   ├── authRoutes.js           ← /api/auth/*
    │   └── callRoutes.js           ← /api/calls/*
    ├── sockets/
    │   └── signaling.js            ← WebRTC signaling logic
    ├── middleware/auth.js           ← JWT verification middleware
    └── .env                        ← Environment variables
```

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create new account |
| POST | /api/auth/login | Login → returns JWT |
| GET | /api/auth/me | Get current user |

### Call Routes
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/calls/history | Get call history |
| POST | /api/calls/log | Save a call record |
| POST | /api/calls/pstn | Initiate Twilio PSTN call |
| GET | /api/calls/wallet | Get minutes balance |
| POST | /api/calls/wallet/add | Add minutes (after ad) |

---

## 🔧 Socket.io Events

```javascript
// CLIENT → SERVER
socket.emit('register', userId)           // Register user online
socket.emit('call-user', { to, offer })   // Initiate call
socket.emit('answer-call', { to, answer })// Accept call
socket.emit('ice-candidate', { to, candidate }) // Exchange ICE
socket.emit('end-call', { to })           // End call

// SERVER → CLIENT
socket.emit('incoming-call', { from, offer })   // Incoming call
socket.emit('call-answered', { answer })         // Call accepted
socket.emit('ice-candidate', { candidate })      // ICE candidate
socket.emit('call-ended')                        // Call terminated
```

---

## 🎭 Caller ID Masking — How It Works

This is the **core IndyCall feature** we replicated:

```javascript
// Node.js backend — Twilio outbound call
const client = require('twilio')(TWILIO_SID, TWILIO_TOKEN);

client.calls.create({
  to: receiverNumber,           // Who to call
  from: userCustomCallerID      // What number receiver sees (masked)
    || randomVirtualNumber,     // OR random number from pool
  url: 'https://yourapp.com/twiml'
});
```

- **Random mode ON** → Receiver sees a different Twilio virtual number every call → Cannot call back
- **Custom CallerID** → User sets their preferred number in Settings → Receiver always sees that number
- **Real number** is never exposed to the receiver at any point

---

## 💡 Key Concepts Demonstrated

| Concept | Where Used |
|---|---|
| WebRTC (P2P media) | ActiveCall, OutgoingCall, IncomingCall |
| WebSocket signaling | signaling.js + Socket.io |
| NAT traversal (STUN/TURN) | useWebRTC.js iceServers config |
| JWT authentication | authController.js + middleware |
| SIP/PSTN bridging | callController.js + Twilio |
| Caller ID spoofing/masking | Settings → callController |
| React Context (global state) | AppContext.jsx |
| Real-time state sync | minutes, callHistory across pages |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Twilio account (free trial — $15 credit)

### 1. Clone & Install

```bash
# Frontend
cd freecall-app
npm install
npm run dev

# Backend
cd freecall-server
npm install
npm run dev
```

### 2. Environment Variables

Create `.env` in `freecall-server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_auth_token
TWILIO_NUMBER=your_twilio_phone_number
```

### 3. Run

```bash
# Terminal 1 — Backend
cd freecall-server && npm run dev

# Terminal 2 — Frontend
cd freecall-app && npm run dev
```

Open `http://localhost:5173`

---

## 📱 Pages & Flow

```
/ (Splash) → /login → /signup
                ↓
           /home (Dashboard + Dialer)
           /contacts
           /history
           /wallet
           /profile
           /settings
                ↓
    /call/outgoing → /call/active → /call/ended
    /call/incoming ↗
```

---

## 🎯 Resume Bullet Points

```
• Built a full-stack real-time VoIP web calling app (React.js, Node.js,
  Socket.io, WebRTC) featuring custom signaling server, STUN/TURN NAT
  traversal, and end-to-end encrypted P2P audio streaming.

• Implemented Caller ID masking via Twilio Voice API — receiver sees a
  virtual/custom number instead of caller's real number on every call.

• Designed 13-page responsive UI with global state management (React
  Context) ensuring real-time sync of minutes wallet, call history,
  and user profile across all pages.

• Deployed frontend on Vercel and backend on Render with MongoDB Atlas
  as the cloud database.
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | freecall.vercel.app |
| Backend | Render.com | freecall-api.onrender.com |
| Database | MongoDB Atlas | Cloud cluster |

---

## 👨‍💻 Built By

**Zeel** — Fresher Full-Stack Developer  
Portfolio Project · 2024  
Stack: React · Node.js · Socket.io · WebRTC · MongoDB · Twilio

---

> ⚠️ **Note:** Caller ID masking is powered by Twilio and is intended for legitimate use cases like privacy protection. Always use within legal limits applicable in your region.
