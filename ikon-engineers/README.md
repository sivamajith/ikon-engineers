# IKON Engineers website (MERN + Three.js)

## Run locally
1. Install Node 18+ and MongoDB (local) or use a MongoDB Atlas URI
2. `npm run install:all`
3. Edit `server/.env` (set `MONGO_URI` and a long random `ADMIN_KEY`)
4. `npm run dev` then open http://localhost:5173

## Production
1. `npm run build`
2. `npm start` (serves API and website on one port, default 5000)

## View enquiries
`curl -H "x-admin-key: YOUR_ADMIN_KEY" http://localhost:5000/api/enquiries`
