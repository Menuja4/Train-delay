// Train Delay Predictor JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const trainName = formData.get('train_name');
        const route = formData.get('route');
        const distance = parseInt(formData.get('distance_km'));
        const departureHour = parseInt(formData.get('departure_hour'));
        const temperature = parseInt(formData.get('temperature'));
        const weather = formData.get('weather');
        
        // Simple delay prediction algorithm
        let delay = calculateDelay(trainName, route, distance, departureHour, temperature, weather);
        
        // Display result
        displayResult(delay);
    });
    
    function calculateDelay(trainName, route, distance, departureHour, temperature, weather) {
        let baseDelay = 0;
        
        // Base delay based on distance
        baseDelay += distance * 0.1;
        
        // Rush hour adjustments
        if ((departureHour >= 7 && departureHour <= 9) || (departureHour >= 16 && departureHour <= 18)) {
            baseDelay += 15;
        }
        
        // Weather adjustments
        if (weather === 'rainy') {
            baseDelay += 20;
        } else if (weather === 'cloudy') {
            baseDelay += 5;
        }
        
        // Temperature adjustments
        if (temperature > 30) {
            baseDelay += 10;
        } else if (temperature < 10) {
            baseDelay += 8;
        }
        
        // Route-specific adjustments
        if (route.includes('Badulla') || route.includes('Kandy')) {
            baseDelay += 25; // Mountain routes
        }
        
        // Train-specific adjustments
        if (trainName.includes('Intercity')) {
            baseDelay -= 10; // Intercity trains are faster
        }
        
        // Ensure minimum delay of 0
        return Math.max(0, Math.round(baseDelay));
    }
    
    function displayResult(delay) {
        // Remove existing result if any
        const existingResult = document.querySelector('h3');
        if (existingResult) {
            existingResult.remove();
        }
        
        // Create and display new result
        const result = document.createElement('h3');
        result.textContent = `Predicted Delay: ${delay} minutes`;
        result.style.color = delay > 30 ? '#dc3545' : '#28a745';
        result.style.fontWeight = 'bold';
        result.style.marginTop = '20px';
        result.style.padding = '15px';
        result.style.backgroundColor = '#f8f9fa';
        result.style.borderRadius = '5px';
        result.style.border = `2px solid ${delay > 30 ? '#dc3545' : '#28a745'}`;
        
        form.parentNode.insertBefore(result, form.nextSibling);
        
        // Add animation
        result.style.animation = 'fadeIn 0.5s ease-in';
    }
});

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
