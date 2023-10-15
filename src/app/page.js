"use client";

import { useState, useEffect } from "react";

function getRandomMovie(movies) {
  const randomIndex = Math.floor(Math.random() * movies.length);
  const movie = movies[randomIndex];
  const title = movie.title;
  const releaseYear = new Date(movie.release_date).getFullYear();
  return { title, releaseYear };
}

export default function Page() {
  const [randomMovieData, setRandomMovieData] = useState({
    title: "",
    releaseYear: "",
  });

  const [timer, setTimer] = useState(null);
  const [countdown, setCountdown] = useState(180); // 3 minutes in seconds
  const [timerEnded, setTimerEnded] = useState(false); // New state variable to track timer end

  const [fetchDataEnabled, setFetchDataEnabled] = useState(false); // Flag to enable/disable API calls

  const fetchData = async () => {
    try {
      if (fetchDataEnabled) {
        const randomNum = Math.random();
        const randomYear = Math.floor(randomNum * (2023 - 2000 + 1)) + 2000;
        const randomPage = Math.floor(randomNum * 2) + 1;

        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&page=${randomPage}&sort_by=popularity.desc&with_origin_country=IN&with_original_language=hi&year=${randomYear}&api_key=accf62ca83ae182fcf9ecf5b37611297`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        const movies = data.results;
        const { title, releaseYear } = getRandomMovie(movies);
        setRandomMovieData({ title, releaseYear });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStartClick = () => {
    if (!timer) {
      const newTimer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000); // Update countdown every 1 second (1000 milliseconds)
      setTimer(newTimer);
      setFetchDataEnabled(true); // Enable API calls
    }
  };

  const handleResetClick = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
      setCountdown(180); // Reset countdown to 3 minutes (180 seconds)
    }
    setFetchDataEnabled(false); // Disable API calls
    setRandomMovieData({ title: "", releaseYear: "" }); // Clear movie data
    setTimerEnded(false); // Reset timerEnded state
  };

  const handleRefreshClick = () => {
    fetchData();
  };

  useEffect(() => {
    if (countdown === 0) {
      clearInterval(timer);
      setTimer(null);
      setCountdown(180); // Reset countdown to 3 minutes (180 seconds)
      setTimerEnded(true); // Set timerEnded state to true when the countdown ends
    }
  }, [countdown, timer]);

  return (
    <div>
      <p className="title">{randomMovieData.title}</p>
      <p className="year">{randomMovieData.releaseYear}</p>
      <p className="timer">
        <b>{countdown}</b> seconds remaining
      </p>
      <button
        className="start-button"
        onClick={handleStartClick}
        disabled={timerEnded}
      >
        Start Timer
      </button>
      <br></br>
      <button
        className="play-button"
        onClick={handleRefreshClick}
        disabled={timerEnded}
      >
        Play
      </button>
      <br></br>
      <button className="reset-button" onClick={handleResetClick}>
        Reset
      </button>
    </div>
  );
}
