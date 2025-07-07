 🚀 Indian Hackathon Explorer & Smart Route Planner 🌍

An interactive web application that allows users to explore upcoming hackathons across India and visualize optimized travel routes from their current location to the hackathon venue. 
The platform helps participants plan their journey better by comparing multiple route options with cost and time estimations.
 
 🌟 Features
- 🔍 Search hackathons by name
- 📍 Fetch real-time user location
- 🗺️ Display venue location using Leaflet.js and OpenStreetMap
- 🛣️ Compare multiple route options (Highway, City, Local)
- 💰 Estimate travel costs (fuel + additional)
- ⏱️ Calculate estimated travel time
- 🚦 View traffic levels (Low/Medium/High)
- 🌗 Toggle between dark and light themes
- 🧭 View interactive maps with route visualization

 🧰 Technologies Used
- HTML5, CSS3, JavaScript (Vanilla)
- Leaflet.js for maps and routing
- OpenStreetMap for map tiles
- Geolocation API for detecting user location
- Custom distance calculator using Haversine formula
- Route simulation logic inspired by Dijkstra’s algorithm

🚦 How It Works
1. When the user opens the application, a list of upcoming hackathons is displayed.
2. Clicking on **"Show Path"** fetches the user’s current geolocation using the browser’s location services.
3. The application calculates three possible routes (highway, city, and local) between the user’s location and the selected hackathon venue.
4. Each route is evaluated based on:
   - Distance
   - Fuel Cost (₹2.5/km assumed)
   - Additional Costs
   - Estimated Time (based on average speed)
   - Traffic Level
5. The best route is highlighted and all route options are shown in a comparison layout.




