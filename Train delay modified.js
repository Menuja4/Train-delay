document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('delayForm');
    const resultContainer = document.getElementById('resultContainer');
    const resultValue = document.getElementById('resultValue');
    const statusContainer = document.getElementById('statusContainer');
    const statusValue = document.getElementById('statusValue');
    const hologramTrain = document.getElementById('hologramTrain');
    const hologramParticles = document.getElementById('hologramParticles');
    const trainNameSelect = document.getElementById('train_name');
    
    // Train data for holograms
    const trainData = {
        "Udarata Menike": {
            color: "#0ff0fc",
            speed: "100 KM/H",
            passengers: "400",
            power: "3.8 MW",
            reliability: "92%"
        },
        "Podi Menike": {
            color: "#ff00ff",
            speed: "90 KM/H",
            passengers: "300",
            power: "3.2 MW",
            reliability: "88%"
        },
        "Ruhunu Kumari": {
            color: "#8a2be2",
            speed: "110 KM/H",
            passengers: "450",
            power: "4.0 MW",
            reliability: "90%"
        },
        "Yal Devi": {
            color: "#00ff9d",
            speed: "120 KM/H",
            passengers: "500",
            power: "4.5 MW",
            reliability: "95%"
        },
        "Udaya Devi": {
            color: "#ffeb3b",
            speed: "95 KM/H",
            passengers: "350",
            power: "3.5 MW",
            reliability: "89%"
        },
        "Rajarata Rejini": {
            color: "#ff5722",
            speed: "105 KM/H",
            passengers: "420",
            power: "3.9 MW",
            reliability: "91%"
        },
        "Intercity Express": {
            color: "#9c27b0",
            speed: "130 KM/H",
            passengers: "320",
            power: "5.0 MW",
            reliability: "97%"
        },
        "Samudra Devi": {
            color: "#2196f3",
            speed: "115 KM/H",
            passengers: "380",
            power: "4.2 MW",
            reliability: "93%"
        }
    };

    // Sample training data (in a real app, this would come from your CSV files)
    const trainingData = {
        features: [
            // Format: [train_name_encoded, route_encoded, distance_km, departure_hour, temperature, weather_encoded]
            [0, 0, 120, 6, 25, 0], // On Time examples
            [1, 1, 150, 8, 28, 0],
            [2, 2, 200, 7, 26, 1],
            [3, 3, 180, 9, 24, 0],
            [4, 4, 220, 10, 27, 1],
            [0, 5, 130, 17, 30, 2], // Delayed examples
            [1, 6, 160, 18, 32, 2],
            [2, 7, 210, 16, 29, 1],
            [3, 0, 190, 19, 31, 2],
            [4, 1, 230, 20, 33, 1],
            [5, 2, 250, 8, 35, 2], // Severely Delayed examples
            [6, 3, 270, 18, 36, 2],
            [7, 4, 300, 17, 34, 1]
        ],
        classificationLabels: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2], // 0=On Time, 1=Delayed, 2=Severely Delayed
        regressionLabels: [5, 8, 12, 7, 15, 25, 30, 28, 32, 35, 45, 50, 55] // Delay in minutes
    };

    // Encoding mappings
    const encoders = {
        train_name: {
            "Udarata Menike": 0,
            "Podi Menike": 1,
            "Ruhunu Kumari": 2,
            "Yal Devi": 3,
            "Udaya Devi": 4,
            "Rajarata Rejini": 5,
            "Intercity Express": 6,
            "Samudra Devi": 7
        },
        route: {
            "Colombo–Kandy": 0,
            "Colombo–Badulla": 1,
            "Colombo–Matara": 2,
            "Colombo–Jaffna": 3,
            "Colombo–Batticaloa": 4,
            "Colombo–Anuradhapura": 5,
            "Kandy–Colombo": 6,
            "Matara–Colombo": 7
        },
        weather: {
            "sunny": 0,
            "cloudy": 1,
            "rainy": 2
        },
        status: {
            0: "ON TIME",
            1: "DELAYED",
            2: "SEVERELY DELAYED"
        }
    };

    // KNN Algorithm Implementation
    function knnPredict(features, labels, newPoint, k = 3) {
        // Calculate distances
        const distances = features.map((feature, index) => {
            const distance = Math.sqrt(
                feature.reduce((sum, val, i) => sum + Math.pow(val - newPoint[i], 2), 0)
            );
            return { index, distance, label: labels[index] };
        });

        // Sort by distance
        distances.sort((a, b) => a.distance - b.distance);

        // Get k nearest neighbors
        const kNearest = distances.slice(0, k);

        // For classification (mode)
        const labelCounts = {};
        kNearest.forEach(neighbor => {
            labelCounts[neighbor.label] = (labelCounts[neighbor.label] || 0) + 1;
        });

        let maxCount = 0;
        let predictedLabel = null;
        for (const [label, count] of Object.entries(labelCounts)) {
            if (count > maxCount) {
                maxCount = count;
                predictedLabel = parseInt(label);
            }
        }

        return predictedLabel;
    }

    function knnRegress(features, labels, newPoint, k = 3) {
        // Calculate distances
        const distances = features.map((feature, index) => {
            const distance = Math.sqrt(
                feature.reduce((sum, val, i) => sum + Math.pow(val - newPoint[i], 2), 0)
            );
            return { index, distance, label: labels[index] };
        });

        // Sort by distance
        distances.sort((a, b) => a.distance - b.distance);

        // Get k nearest neighbors
        const kNearest = distances.slice(0, k);

        // For regression (average)
        const average = kNearest.reduce((sum, neighbor) => sum + neighbor.label, 0) / k;
        return average;
    }

    // Create hologram particles
    function createParticles() {
        hologramParticles.innerHTML = '';
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            hologramParticles.appendChild(particle);
        }
    }
    
    // Update hologram when train selection changes
    trainNameSelect.addEventListener('change', function() {
        updateHologram(this.value);
    });
    
    // Initialize with default train
    updateHologram(trainNameSelect.value);
    createParticles();
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const trainName = document.getElementById('train_name').value;
        const route = document.getElementById('route').value;
        const distanceKm = parseInt(document.getElementById('distance_km').value);
        const departureHour = parseInt(document.getElementById('departure_hour').value);
        const temperature = parseInt(document.getElementById('temperature').value);
        const weather = document.getElementById('weather').value;
        
        // Update hologram
        updateHologram(trainName);
        
        // Show loading state
        resultValue.textContent = "ANALYZING...";
        statusValue.textContent = "PROCESSING...";
        statusValue.className = "status-value status-on-time";
        resultContainer.classList.add('visible');
        statusContainer.classList.add('visible');
        
        // Simulate processing delay
        setTimeout(() => {
            // Encode input features
            const encodedFeatures = [
                encoders.train_name[trainName],
                encoders.route[route],
                distanceKm,
                departureHour,
                temperature,
                encoders.weather[weather]
            ];

            // Make predictions using KNN
            const statusPrediction = knnPredict(
                trainingData.features,
                trainingData.classificationLabels,
                encodedFeatures,
                3
            );

            const delayPrediction = knnRegress(
                trainingData.features,
                trainingData.regressionLabels,
                encodedFeatures,
                3
            );

            // Display results
            const roundedDelay = Math.round(delayPrediction);
            resultValue.textContent = `${roundedDelay} MINUTES`;
            
            // Update status with appropriate color
            const statusText = encoders.status[statusPrediction];
            statusValue.textContent = statusText;
            
            if (statusPrediction === 0) {
                statusValue.className = "status-value status-on-time";
            } else if (statusPrediction === 1) {
                statusValue.className = "status-value status-delayed";
            } else {
                statusValue.className = "status-value status-severe";
            }
        }, 1500);
    });
    
    // Update hologram display
    function updateHologram(trainName) {
        const data = trainData[trainName];
        if (data) {
            hologramTrain.style.color = data.color;
            document.getElementById('statSpeed').textContent = data.speed;
            document.getElementById('statPassengers').textContent = data.passengers;
            document.getElementById('statPower').textContent = data.power;
            document.getElementById('statReliability').textContent = data.reliability;
            
            // Update particle colors
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => {
                particle.style.color = data.color;
            });
            
            // Add glitch effect
            hologramTrain.style.animation = 'none';
            setTimeout(() => {
                hologramTrain.style.animation = 'floatHologram 6s ease-in-out infinite';
            }, 10);
        }
    }
    
    // Add random glitch effect occasionally
    setInterval(() => {
        if (Math.random() < 0.02) { // 2% chance every interval
            document.body.style.filter = 'hue-rotate(90deg)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 100);
        }
    }, 3000);
});