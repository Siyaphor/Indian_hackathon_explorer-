// Dummy hackathon data
const hackathons = [
    {
        id: 1,
        name: "TechCrunch Disrupt India",
        date: "May 15-17, 2025",
        location: { lat: 28.6139, lng: 77.2090, address: "Pragati Maidan, New Delhi, India" },
        description: "One of the biggest tech conferences featuring a hackathon focused on disruptive technologies.",
        link: "https://devpost.com",
        image: "#3498db"
    },
    {
        id: 2,
        name: "HackIIT Delhi",
        date: "June 8-10, 2025",
        location: { lat: 28.5450, lng: 77.1926, address: "IIT Delhi Campus, New Delhi, India" },
        description: "Annual student-run hackathon at the Indian Institute of Technology Delhi.",
        link: "https://devpost.com",
        image: "#e74c3c"
    },
    {
        id: 3,
        name: "Jaipur DevHack",
        date: "July 20-22, 2025",
        location: { lat: 26.9124, lng: 75.7873, address: "JECRC Foundation, Jaipur, Rajasthan, India" },
        description: "Student developer hackathon hosted in the Pink City.",
        link: "https://devpost.com",
        image: "#9b59b6"
    },
    {
        id: 4,
        name: "Chandigarh AI Hackathon",
        date: "August 5-7, 2025",
        location: { lat: 30.7333, lng: 76.7794, address: "Chandigarh University, Punjab, India" },
        description: "Focused on artificial intelligence innovation and real-world applications.",
        link: "https://devpost.com",
        image: "#1abc9c"
    },
    {
        id: 5,
        name: "Dehradun Blockchain Summit",
        date: "September 12-14, 2025",
        location: { lat: 30.3165, lng: 78.0322, address: "DIT University, Dehradun, Uttarakhand, India" },
        description: "Blockchain and web3 hackathon nestled in the Himalayan foothills.",
        link: "https://devpost.com",
        image: "#f39c12"
    },
    {
        id: 6,
        name: "MedHacks Lucknow",
        date: "October 3-5, 2025",
        location: { lat: 26.8467, lng: 80.9462, address: "SGPGI, Lucknow, Uttar Pradesh, India" },
        description: "Healthcare innovation hackathon solving real-world medical challenges.",
        link: "https://devpost.com",
        image: "#2ecc71"
    },
    {
        id: 7,
        name: "ClimateHack NCR",
        date: "November 8-10, 2025",
        location: { lat: 28.4089, lng: 77.3178, address: "Expocentre, Noida, Uttar Pradesh, India" },
        description: "Building sustainable tech solutions to address climate challenges in urban India.",
        link: "https://devpost.com",
        image: "#16a085"
    }
];

// DOM Elements
const hackathonListEl = document.getElementById('hackathon-list');
const mapModal = document.getElementById('mapModal');
const closeMapModal = document.getElementById('closeMapModal');
const modalTitle = document.getElementById('modalTitle');
const locationStatus = document.getElementById('locationStatus');

// Map variables
let map;
let routingControl;
let locationRetryCount = 0;
const MAX_RETRIES = 3;

// Initialize the app
function initApp() {
    renderHackathonList();
    setupEventListeners();
}

// Render the list of hackathons
function renderHackathonList() {
    hackathons.forEach(hackathon => {
        const card = createHackathonCard(hackathon);
        hackathonListEl.appendChild(card);
    });
}

// Create a hackathon card element
function createHackathonCard(hackathon) {
    const card = document.createElement('div');
    card.className = 'hackathon-card';

    const cardImage = document.createElement('div');
    cardImage.className = 'card-image';
    cardImage.style.backgroundColor = hackathon.image;
    cardImage.textContent = hackathon.name.split(' ')[0];

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    const nameEl = document.createElement('h3');
    nameEl.className = 'hackathon-name';
    nameEl.textContent = hackathon.name;

    const detailsEl = document.createElement('div');
    detailsEl.className = 'hackathon-details';

    const dateEl = document.createElement('p');
    dateEl.innerHTML = `<strong>Date:</strong> ${hackathon.date}`;

    const locationEl = document.createElement('p');
    locationEl.innerHTML = `<strong>Location:</strong> ${hackathon.location.address}`;

    const descriptionEl = document.createElement('p');
    descriptionEl.innerHTML = `<strong>Description:</strong> ${hackathon.description}`;

    const btnContainer = document.createElement('div');
    btnContainer.className = 'btn-container';

    const viewBtn = document.createElement('a');
    viewBtn.className = 'btn btn-view';
    viewBtn.textContent = 'View Post';
    viewBtn.href = hackathon.link;
    viewBtn.target = '_blank';

    const mapBtn = document.createElement('button');
    mapBtn.className = 'btn btn-map';
    mapBtn.textContent = 'Show Path';
    mapBtn.dataset.id = hackathon.id;
    mapBtn.addEventListener('click', () => showPath(hackathon));

    // const compareBtn = document.createElement('button');
    // compareBtn.className = 'btn btn-compare';
    // compareBtn.textContent = 'Compare Routes';
    // compareBtn.addEventListener('click', () => {
    //     const routes = calculatePathCosts(
    //         { lat: 0, lng: 0 }, // Default start point
    //         { lat: hackathon.location.lat, lng: hackathon.location.lng }
    //     );
    //     window.availableRoutes = routes; // Store routes globally
    //     showComparisonModal(routes);
    // });

    detailsEl.appendChild(dateEl);
    detailsEl.appendChild(locationEl);
    detailsEl.appendChild(descriptionEl);

    btnContainer.appendChild(viewBtn);
    btnContainer.appendChild(mapBtn);
    // btnContainer.appendChild(compareBtn);

    cardContent.appendChild(nameEl);
    cardContent.appendChild(detailsEl);
    cardContent.appendChild(btnContainer);

    card.appendChild(cardImage);
    card.appendChild(cardContent);

    return card;
}

// Setup event listeners
function setupEventListeners() {
    closeMapModal.addEventListener('click', () => {
        mapModal.style.display = 'none';
        if (map) {
            // Reset the map
            map.remove();
            map = null;
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === mapModal) {
            mapModal.style.display = 'none';
            if (map) {
                // Reset the map
                map.remove();
                map = null;
            }
        }
    });
}

// Show path to hackathon
function showPath(hackathon) {
    modalTitle.textContent = `Route to ${hackathon.name}`;
    mapModal.style.display = 'block';
    
    // Clear any existing map
    if (map) {
        map.remove();
        map = null;
    }

    // Get user location and initialize map
    getUserLocation(hackathon);
}

// Path finding algorithms
class Graph {
    constructor() {
        this.nodes = new Map();
        this.edges = [];
    }

    addNode(id, lat, lng) {
        this.nodes.set(id, { id, lat, lng, edges: [] });
    }

    addEdge(from, to, cost, time) {
        this.edges.push({ from, to, cost, time });
        this.nodes.get(from).edges.push({ to, cost, time });
        this.nodes.get(to).edges.push({ from, cost, time });
    }
}

function calculatePathCostsUsingDijkstra(start, end) {
    // Get actual available routes based on location
    const routes = [];
    
    // Calculate distance first
    const distance = calculateDistance(start, end);
    
    // Check for highway route
    if (hasHighwayAccess(start, end)) {
        routes.push({
            name: "Highway Route",
            cost: Math.round(Math.random() * 30) + 50,
            time: Math.round(distance * 0.8), // 0.8 minutes per km (75 km/h average)
            traffic: "Low",
            description: "Express highway route with minimal traffic",
            type: "highway"
        });
    }

    // Check for city route
    if (hasCityRoute(start, end)) {
        routes.push({
            name: "City Route",
            cost: Math.round(Math.random() * 20) + 30,
            time: Math.round(distance * 1.2), // 1.2 minutes per km (50 km/h average)
            traffic: "Medium",
            description: "Through city center with moderate traffic",
            type: "city"
        });
    }

    // Check for local route
    if (hasLocalRoute(start, end)) {
        routes.push({
            name: "Local Route",
            cost: Math.round(Math.random() * 25) + 40,
            time: Math.round(distance * 1.5), // 1.5 minutes per km (40 km/h average)
            traffic: "High",
            description: "Through local streets with more traffic",
            type: "local"
        });
    }

    // Calculate distance-based costs for available routes
    routes.forEach(route => {
        route.distance = distance;
        route.fuelCost = Math.round(distance * 2.5); // Assuming ₹2.5 per km
        route.totalCost = route.cost + route.fuelCost;
    });

    return routes;
}

function hasHighwayAccess(start, end) {
    // Simulate checking if highway route is available
    return Math.random() > 0.3; // 70% chance of highway access
}

function hasCityRoute(start, end) {
    // Simulate checking if city route is available
    return Math.random() > 0.2; // 80% chance of city route
}

function hasLocalRoute(start, end) {
    // Simulate checking if local route is available
    return Math.random() > 0.1; // 90% chance of local route
}

function calculateDistance(start, end) {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Earth's radius in km
    const dLat = toRad(end.lat - start.lat);
    const dLon = toRad(end.lng - start.lng);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(start.lat)) * Math.cos(toRad(end.lat)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(value) {
    return value * Math.PI / 180;
}

// Initialize map with fallback location
function initMap(hackathon, userLocation = null) {
    try {
        const defaultCenter = [hackathon.location.lat, hackathon.location.lng];
        map = L.map('map').setView(defaultCenter, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const hackathonMarker = L.marker(defaultCenter)
            .addTo(map)
            .bindPopup(`
                <div>
                    <b class='map-color'>${hackathon.name}</b><br>
                    ${hackathon.location.address}
                </div>
            `);

        if (userLocation) {
            const userMarker = L.marker([userLocation.lat, userLocation.lng])
                .addTo(map)
                .bindPopup('Your Location')
                .openPopup();

            const bounds = L.latLngBounds([
                [userLocation.lat, userLocation.lng],
                [hackathon.location.lat, hackathon.location.lng]
            ]);
            map.fitBounds(bounds, { padding: [50, 50] });

            // Calculate and display route options
            const routes = calculatePathCostsUsingDijkstra(
                { lat: userLocation.lat, lng: userLocation.lng },
                { lat: hackathon.location.lat, lng: hackathon.location.lng }
            );

            // Display route comparison
            const algorithmResults = document.getElementById('algorithmResults');
            algorithmResults.innerHTML = `
                <h3 style="color: #ff69b4; margin-bottom: 15px;">Route Options</h3>
                ${routes.map((route, index) => `
                    <div class="algorithm-result ${index === 0 ? 'best-path' : ''}">
                        <strong style="color: #ff69b4;">${route.name}</strong>
                        <div class="cost-details">
                            <p>🛣️ Distance: ${route.distance.toFixed(1)} km</p>
                            <p>⛽ Fuel Cost: ₹${route.fuelCost}</p>
                            <p>💰 Additional Costs: ₹${route.cost}</p>
                            <p>💵 Total Cost: ₹${route.totalCost}</p>
                            <p>⏱️ Estimated Time: ${route.time} minutes</p>
                            <p>🚦 Traffic Level: ${route.traffic}</p>
                            <p>ℹ️ ${route.description}</p>
                        </div>
                    </div>
                `).join('')}
            `;

            // Add routing control for the selected route
            if (routingControl) {
                map.removeControl(routingControl);
            }

            routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(userLocation.lat, userLocation.lng),
                    L.latLng(hackathon.location.lat, hackathon.location.lng)
                ],
                routeWhileDragging: false,
                showAlternatives: true,
                altLineOptions: {
                    styles: [
                        { color: 'black', opacity: 0.15, weight: 9 },
                        { color: 'white', opacity: 0.8, weight: 6 },
                        { color: 'blue', opacity: 0.5, weight: 2 }
                    ]
                }
            }).addTo(map);

            locationStatus.textContent = "Route calculated! Showing the path from your location to the hackathon venue.";
        } else {
            locationStatus.textContent = "Using default location. Enable location services for personalized routing.";
        }
    } catch (error) {
        console.error("Error initializing map:", error);
        locationStatus.textContent = "Error loading map. Please try again.";
    }
}

// Get user location with retry mechanism
function getUserLocation(hackathon) {
    if (!navigator.geolocation) {
        locationStatus.textContent = "Geolocation is not supported by your browser. Using default location.";
        initMap(hackathon);
        return;
    }

    const locationOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    function handleLocationSuccess(position) {
        const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        initMap(hackathon, userLocation);
        locationRetryCount = 0; // Reset retry count on success
    }

    function handleLocationError(error) {
        console.error("Location error:", error);
        locationRetryCount++;

        if (locationRetryCount < MAX_RETRIES) {
            locationStatus.textContent = `Retrying to get your location... (Attempt ${locationRetryCount + 1}/${MAX_RETRIES})`;
            setTimeout(() => getUserLocation(hackathon), 2000);
        } else {
            locationStatus.textContent = "Unable to get your location. Using default location.";
            initMap(hackathon);
        }
    }

    locationStatus.textContent = "Getting your location...";
    navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError,
        locationOptions
    );
}

// Show comparison modal
function showComparisonModal(routes) {
    const modal = document.getElementById('comparisonModal');
    const comparisonDiv = document.getElementById('routeComparison');
    
    if (routes.length === 0) {
        comparisonDiv.innerHTML = `
            <div class="no-routes">
                <h3 style="color: #ff69b4;">No Routes Available</h3>
                <p>Sorry, no routes are currently available for this location.</p>
            </div>
        `;
    } else {
        comparisonDiv.innerHTML = `
            <div class="route-selection">
                <h3 style="color: #ff69b4; margin-bottom: 15px;">Available Routes</h3>
                ${routes.map((route, index) => `
                    <div class="route-option ${index === 0 ? 'best' : ''}" 
                         onclick="selectRoute(${index}, ${JSON.stringify(route)})">
                        <h3 style="color: #ff69b4;">${route.name}</h3>
                        <div class="cost-breakdown">
                            <div class="cost-item">
                                <span>🛣️ Distance:</span>
                                <span>${route.distance.toFixed(1)} km</span>
                            </div>
                            <div class="cost-item">
                                <span>⛽ Fuel Cost:</span>
                                <span>₹${route.fuelCost}</span>
                            </div>
                            <div class="cost-item">
                                <span>💰 Additional Costs:</span>
                                <span>₹${route.cost}</span>
                            </div>
                            <div class="cost-item">
                                <span>⏱️ Estimated Time:</span>
                                <span>${route.time} minutes</span>
                            </div>
                            <div class="cost-item">
                                <span>🚦 Traffic Level:</span>
                                <span>${route.traffic}</span>
                            </div>
                            <div class="total-cost">
                                Total Cost: ₹${route.totalCost}
                            </div>
                            <p style="margin-top: 10px; font-style: italic;">ℹ️ ${route.description}</p>
                        </div>
                        <button class="select-route-btn">Select This Route</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    modal.style.display = 'block';
}

function selectRoute(index, route) {
    // Show selected route details
    const modal = document.getElementById('comparisonModal');
    const comparisonDiv = document.getElementById('routeComparison');
    
    comparisonDiv.innerHTML = `
        <div class="selected-route">
            <h3 style="color: #ff69b4;">Selected Route: ${route.name}</h3>
            <div class="cost-breakdown">
                <div class="cost-item">
                    <span>🛣️ Distance:</span>
                    <span>${route.distance.toFixed(1)} km</span>
                </div>
                <div class="cost-item">
                    <span>⛽ Fuel Cost:</span>
                    <span>₹${route.fuelCost}</span>
                </div>
                <div class="cost-item">
                    <span>💰 Additional Costs:</span>
                    <span>₹${route.cost}</span>
                </div>
                <div class="cost-item">
                    <span>⏱️ Estimated Time:</span>
                    <span>${route.time} minutes</span>
                </div>
                <div class="cost-item">
                    <span>🚦 Traffic Level:</span>
                    <span>${route.traffic}</span>
                </div>
                <div class="total-cost">
                    Total Cost: ₹${route.totalCost}
                </div>
                <p style="margin-top: 10px; font-style: italic;">ℹ️ ${route.description}</p>
            </div>
            <div class="route-actions">
                <button onclick="showComparisonModal(window.availableRoutes)" class="back-btn">Back to Routes</button>
                <button onclick="confirmRoute(${index})" class="confirm-btn">Confirm Route</button>
            </div>
        </div>
    `;
}

function confirmRoute(index) {
    const route = window.availableRoutes[index];
    // Here you can add code to handle the confirmed route
    alert(`Route confirmed: ${route.name}\nTotal Cost: ₹${route.totalCost}\nEstimated Time: ${route.time} minutes`);
    closeComparisonModal();
}

function closeComparisonModal() {
    document.getElementById('comparisonModal').style.display = 'none';
}

// Search functionality
function searchHackathon() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    hackathonListEl.innerHTML = ''; // Clear current list

    const filtered = hackathons.filter(h => h.name.toLowerCase().includes(query));

    if (filtered.length > 0) {
        filtered.forEach(h => {
            const card = createHackathonCard(h);
            hackathonListEl.appendChild(card);
        });
    } else {
        hackathonListEl.innerHTML = `<p style="color: #ff69b4;">No hackathon found matching "${query}"</p>`;
    }
}

// Theme toggle
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('themeToggle');

    body.classList.toggle('light-theme');

    if (body.classList.contains('light-theme')) {
        body.style.backgroundColor = '#ffffff';
        body.style.color = '#000000';
        btn.textContent = '☀️';
    } else {
        body.style.backgroundColor = '#0a0a0a';
        body.style.color = '#ffffff';
        btn.textContent = '🌙';
    }
}

// Add error handling for map loading
window.addEventListener('load', function() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error("Leaflet library not loaded");
        locationStatus.textContent = "Error: Map library not loaded. Please refresh the page.";
    }
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp); 