# cryptoTracker-ionic

A live crypto coin rate tracker made with Ionic/Angular frameworks.
I used ng2-charts/Charts.js to visualize the data retrieved from servers.
Data is coming from a live websocket server.
Frontend uses rxjs/websocketsubject to get the live data.
Users can see live data of the coin of their choice from 7 different ones.

Requirements:
- Node and npm environmets
- Ionic CLI

To run the project on your local:
- Clone the repository
- Install npm packages via => 'npm install' in the cli
- Inside the project directory run 'ionic serve' in the cli 


The realtime data of the coins is retrieved from coincap.io
