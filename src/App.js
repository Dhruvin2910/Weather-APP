import React, { useEffect, useState } from 'react';
import raindrop from './raindrop.jpg';
import Clock from 'react-live-clock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudShowersHeavy, faCircle, faSun, faCloud, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function App() {
  const [temperature, setTemperature] = useState(0);
  const [weather, setWeather] = useState("");
  const [humidity, setHumidity] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [feels_like, setFeelslike] = useState(0);
  const [visibility, setVisibility] = useState(0);
  const [wind, setWind] = useState(0);
  const [discription, setDiscription] = useState("");
  const [cloud, setClouds] = useState(0);
  const [seaLevel, setSeaLevel] = useState(0);
  const [rainLevel, setRain] = useState(0);
  const [change, setChange] = useState("");
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");

   const apiKey = process.env.REACT_APP_WEATHER_API
   const fetchURL = async (url) => {
    try {
      let data = await fetch(url);
      if (!data.ok) {
        throw new Error('Network response was not ok');
      }
      let parsedData = await data.json();
      if (parsedData.main && parsedData.weather) {
        setTemperature(Math.round(parsedData.main.temp - 273));
        setWeather(parsedData.weather[0].main); // Change index to 0
        setHumidity(parsedData.main.humidity);
        setPressure(parsedData.main.pressure);
        setFeelslike(Math.round(parsedData.main.feels_like - 273));
        setVisibility(parsedData.visibility / 1000);
        setWind(parsedData.wind.speed);
        setDiscription(parsedData.weather[0].description);
        setClouds(parsedData.clouds.all);
        setSeaLevel(parsedData.main.grnd_level);
        setRain(parsedData.rain ? parsedData.rain['1h'] : 0);
        setCityName(parsedData.name);
        setCountry(parsedData.sys.country);
    
        if(parsedData.message) {
          setMessage(parsedData.message);
        }
      } else {
        throw new Error('Data format is incorrect');
      }
    } catch (error) {
      console.error('Fetch error: ', error);
    }
  };
  
  const handleChange = (e) => {
    setChange(e.target.value);
  }
  const handleSearch = (e) => {
    e.preventDefault();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(change)}&appid=${apiKey}`;
    fetchURL(url);
  }

  const success = (position) => {
    const { latitude, longitude } = position.coords;
    let url;
    
    if (cityName.trim() !== "") {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    }
  
    fetchURL(url);
  }
  

  const error = () => {
    console.error("Unable to retrieve your location");
  }

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  }

  const weatherIcons = {
    Clear: faSun,
    Haze: faSun,
    Mist: faCloud,
    Rain: faCloudShowersHeavy,
    Clouds: faCloud
  };

  const weatherIcon = weatherIcons[weather] || faCloud;
  
  useEffect(() => {
    handleLocation();
    // eslint-disable-next-line
  }, [])
  return (
    <div className='flex flex-col items-center justify-center h-screen mx-2'>
      <div className='mb-3'>
        <form className='flex' onSubmit={handleSearch}>
            <input onChange={handleChange} className='bg-white mx-2 rounded-2xl w-72 py-1.5 px-2.5 shadow-md focus:outline-slate-400 outline-1' placeholder='Search location or a city name' value={change} type="text" />
            <button type='submit' className='bg-white mx-3 py-1.5 px-2.5 rounded-3xl shadow-md hover:bg-gray-100 active:bg-gray-200'>
              <FontAwesomeIcon icon={faSearch}/>
            </button>
        </form>
      </div>
      <div className='mb-3 rounded-lg bg-white'>
      <p className='text-blue-800 text-xl font-semibold px-4 py-1 shadow-lg'>{message || `${cityName}, ${country}`}</p>
      </div>
      <div className='relative bg-gray-800 rounded-lg h-96 w-96'>
          <img className='opacity-40 absolute inset-0 z-0' src={raindrop} alt="raindrop" />
        <div className='relative z-10 p-4'>
          <h1 className='text-white text-2xl font-semibold'>Current Weather</h1>
          <div>
            <Clock className='text-white' format={'h:mm:ss A'} ticking={true} timezone={'Asia/Kolkata'} />
          </div>
          <div className='mt-10 ml-7 flex'>
            <div>
              <FontAwesomeIcon icon={weatherIcon} size="3x" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <div className='flex'>
                <p className='text-white text-4xl font-semibold pl-5 pr-2'>{temperature}</p>
                <div className='flex'>
                  <div>
                    <FontAwesomeIcon icon={faCircle} size="2xs" style={{ color: '#ffffff' }} />
                  </div> 
                  <p className='text-white text-4xl font-semibold'>C</p>
                </div>
            </div>
              <div className='ml-5'>
                  <p className='text-2xl text-white font-semibold'>{weather}</p>
              </div>
            </div>
          </div>
          <div className='mt-2 flex justify-center'>
            <p className='text-white text-md font-semibold ml-5 bg-white shadow-md rounded-md px-3 py-1 bg-opacity-15'>{discription.charAt(0).toUpperCase() + discription.slice(1)}</p>
          </div>
          <div className='mt-7 flex flex-col'>
            <div className='flex'>
              <div className='mx-3'>
                  <p className='text-white text-sm font-semibold'>Feels Like</p>
                  <div className='flex'>
                    <p className='text-white text-sm font-semibold'>{feels_like}</p>
                    <p className='text-white text-sm font-semibold pl-1'>C</p>
                  </div>
                </div>
              <div className='mx-3'>
                <p className='text-white text-sm font-semibold'>Clouds</p>
                <div>
                  <p className='text-white text-sm font-semibold'>{cloud} %</p>
                </div>
              </div>
              <div className='mx-3'>
                <p className='text-white text-sm font-semibold'>Humidity</p>
                <div>
                  <p className='text-white text-sm font-semibold'>{humidity} %</p>
                </div>
              </div>
              <div className='mx-3'>
                <p className='text-white text-sm font-semibold'>Wind</p>
                <div className='flex'>
                  <p className='text-white text-sm font-semibold'>{wind} KM/H</p>
                </div>
              </div>
            </div>
            <div className='flex mt-5'>
              <div className='mx-3'>
                <p className='text-white text-sm font-semibold'>Visibility</p>
                <div>
                  <p className='text-white text-sm font-semibold'>{visibility} KM</p>
                </div>
              </div>
              <div className='mx-3'>
                <p className='text-white text-sm font-semibold'>Pressure</p>
                <div>
                  <p className='text-white text-sm font-semibold'>{pressure} mb</p>
                </div>
              </div>
              <div className='mx-3'>
                <p className='text-white text-sm font-semibold'>Rain(Last 1h)</p>
                <div>
                  <p className='text-white text-sm font-semibold'>{rainLevel} mm</p>
                </div>
              </div>
              <div className='mx-3'>
                <p className='text-white text-sm font-semibold'>Sea Level</p>
                <div>
                  <p className='text-white text-sm font-semibold'>{seaLevel} hPa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
