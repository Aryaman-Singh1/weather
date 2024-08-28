async function getWeather() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (!latitude || !longitude) {
        alert('Please enter both latitude and longitude.');
        return;
    }

    const url = `https://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=civil&output=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        document.getElementById('weather-info').innerText = 'Failed to fetch weather data.';
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    
    if (!data || !data.dataseries || data.dataseries.length === 0) {
        weatherInfo.innerText = 'No weather data available.';
        return;
    }

    const currentDate = new Date(); // Get current date and time

    let html = '<h2>Weather Forecast</h2>';
    data.dataseries.forEach((entry) => {
        const hoursFromNow = entry.timepoint; // timepoint is in hours from now
        const forecastDate = new Date(currentDate.getTime() + hoursFromNow * 60 * 60 * 1000); // Add hours to current date
        const formattedDate = forecastDate.toLocaleDateString(); // Format date as "MM/DD/YYYY"
        const time = forecastDate.toLocaleTimeString(); // Format time
        const temperature = entry.temp2m;
        const weather = entry.weather.toLowerCase(); // Convert to lowercase to match the keys in weatherIcons

        html += `<p>Date: ${formattedDate}<br>Time: ${time}<br>Temperature: ${temperature}°C<br>Weather: ${weather}</p>`;
    });

    weatherInfo.innerHTML = html;
}
