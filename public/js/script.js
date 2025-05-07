document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/weather');
        const weatherData = await response.json();
        updateWeatherUI(weatherData);
    } catch (error) {
        console.error('Error fetching weather:', error);
    }

    const aiButton = document.createElement('button');
    aiButton.id = 'ai-button';
    aiButton.textContent = 'Get AI Tips';
    document.querySelector('header').appendChild(aiButton);
  
    aiButton.addEventListener('click', async () => {
        try {
            const weatherResponse = await fetch('/api/weather');
            const weatherData = await weatherResponse.json();
      
            aiButton.textContent = 'Thinking...';
            const tips = await getAIWeatherTips(weatherData);
            alert(`🌦️ Weather Assistant Says:\n\n${tips}`);
        } catch (error) {
            alert("Sorry, couldn't connect to the weather assistant.");
        } finally {
            aiButton.textContent = 'Get AI Tips';
        }
    });
});

async function getAIWeatherTips(weatherData) {
    try {
      const response = await fetch('/api/ai-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weatherData })
      });
      
      const data = await response.json();
      return data.aiResponse || "Couldn't get weather tips right now.";
    } catch (error) {
      console.error('AI fetch error:', error);
      return "Weather assistant unavailable.";
    }
  }



function updateWeatherUI(data) {
    // Update current weather
    docume