import React, { useState, useEffect } from "react";

const RouteForm = ({ routeInfo, reset }) => {
  const [speed, setSpeed] = useState(50); // Default speed in km/h
  const [distanceUnit, setDistanceUnit] = useState("km"); // km, m, or miles
  const [routeName, setRouteName] = useState(""); // Route name input
  const [savedRoutes, setSavedRoutes] = useState([]); // Array to store saved routes
  const [shouldCalculateTime, setShouldCalculateTime] = useState(false); // Toggle for triggering calculation

  const handleSaveRoute = () => {
    // Check if the route name is empty and alert the user if so.
    if (!routeName.trim()) {
      alert("Please enter a route name.");
      return;
    }

    // Check if the route has been created to do the calculations.
    if (!shouldCalculateTime) {
      alert("Please calculate the time before saving the route.");
      return;
    }

    // Validate route details and save the route if all conditions are met.
    if (routeName && routeInfo && speed >= 1) {
      const time = calculateTime(); // Calculate the time based on current speed and route info.
      const newRoute = { name: routeName, speed, time, routeInfo }; // Create a new route object.
      setSavedRoutes((prevRoutes) => [...prevRoutes, newRoute]); // Add the new route to the saved routes.
      setRouteName(""); // Reset the route name field after saving.
    }
  };

  const calculateTime = () => {
    // Check if route information is available and speed is valid.
    if (routeInfo && speed >= 1) {
      let totalDistance = routeInfo.summary.totalDistance; // This returns meters.

      // Convert the distance to the selected unit (km or miles).
      if (distanceUnit === "km") {
        totalDistance /= 1000; // Convert meters to kilometers.
      } else if (distanceUnit === "miles") {
        totalDistance /= 1609.34; // Convert meters to miles.
      }

      // Calculate the total time based on distance and speed.
      let totalTimeInHours = totalDistance / speed;
      let hours = Math.floor(totalTimeInHours);
      let minutes = Math.floor((totalTimeInHours - hours) * 60);
      let seconds = Math.floor(((totalTimeInHours - hours) * 3600) % 60);
      let fractionalMinutes = seconds / 60;

      // Return the formatted time string.
      return `${hours.toString().padStart(2, "0")}H ${(
        minutes + fractionalMinutes
      )
        .toFixed(1)
        .padStart(4, "0")}M`;
    }
    // Handle cases where the speed is invalid or no route info is available.
    return speed < 1 ? "Invalid speed (must be ≥ 1)" : "N/A";
  };

  useEffect(() => {
    // When the reset prop changes, reset the state related to time calculation, so that it goes to initial stage.
    if (reset) {
      setShouldCalculateTime(false);
    }
  }, [reset]);

  // Handler for the Calculate Time button.
  const handleCalculateClick = () => {
    // Check if the route has been finalized before calculation.
    if (!routeInfo) {
      alert("Please finalize the route before calculating time.");
      return;
    }
    // Toggle the state for whether time should be calculated.
    setShouldCalculateTime(!shouldCalculateTime);
  };

  // JSX for the RouteForm component.
  return (
    <div className="route-form">
      <div className="container">
        <div className="section">
          {/* Speed input field */}
          <div className="form-row">
            <input
              className="speed-input"
              type="number"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              placeholder="Enter speed"
            />
            {/* Button to trigger time calculation */}
            <button
              className="calculate-time-btn"
              onClick={handleCalculateClick}
            >
              Calculate Time
            </button>
            {/* Dropdown to select distance unit */}
            <select
              className="distance-unit-select"
              onChange={(e) => setDistanceUnit(e.target.value)}
            >
              <option value="km">km/h</option>
              <option value="m">meters/h</option>
              <option value="miles">mph</option>
            </select>
          </div>
          {/* Display estimated travel time */}
          <div className="form-row">
            <p className="estimated-time">
              Estimated travel time:{" "}
              {shouldCalculateTime
                ? calculateTime()
                : "Waiting for calculation"}
            </p>
          </div>
          {/* Input for route name and save button */}
          <div className="form2-row">
            <input
              className="route-name-input"
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Route Name"
            />
            <button className="save-route-btn" onClick={handleSaveRoute}>
              Save Route
            </button>
          </div>
        </div>
        {/* Section to display saved routes */}

        <div>
          <div className="saved-routes-section">
            <h3>Saved Routes:</h3>
            <ul>
              {savedRoutes.map((route, index) => (
                <li key={index}>
                  Name: {route.name}, Speed: {route.speed}, Time: {route.time}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteForm;
