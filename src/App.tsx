import { useState } from 'react';
import './App.css';

// 1. Define the Interface (The "Shape" of the data)
interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number };
  weather: { main: string; icon: string; description: string }[];
  wind: { speed: number };
}

function App() {
  const [query, setQuery] = useState<string>('');
  // 2. Fix State: Tell TS this can be WeatherData OR null
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');

  const api = {
    key: "d74225b440a457b11a7d73c69a6a15ab", // Replace with your key from the screenshot
    base: "https://api.openweathermap.org/data/2.5/"
  };

  // 3. Fix Event Type: Tell TS this is a Keyboard Event
  const search = async (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      try {
        const res = await fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`);
        const result = await res.json();

        if (res.status !== 200) { // Check status code directly
          setError(result.message);
          setWeather(null); // Set to null, not empty object {}
        } else {
          setWeather(result); // Now TS knows this matches WeatherData
          setError('');
          setQuery('');
        }
      } catch (err) {
        setError('Failed to fetch data');
        setWeather(null);
      }
    }
  };

  const dateBuilder = (d: Date) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  }

  return (
    // 4. Safe checks using optional chaining (?.)
    <div className={(typeof weather?.main !== "undefined") ? ((weather!.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyDown={search} // onKeyDown is better for React than onKeyPress
          />
        </div>
        
        {error && <div className="error-msg">{error}</div>}

        {weather ? (
          <div>
            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}°c
              </div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        ) : (
          <div className="welcome-msg"></div>
        )}
      </main>
    </div>
  );
}

export default App;