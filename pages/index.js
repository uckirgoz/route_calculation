import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import MapComponent and RouteForm with server-side rendering disabled, because leaflet does not allow ssr.
const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
});
const RouteForm = dynamic(() => import("../components/RouteForm"), {
  ssr: false,
});

// Main Home component for the application.
const Home = () => {
  // State to store route information.
  const [routeInfo, setRouteInfo] = useState(null);
  // State to trigger map reset, prop to pass MapComponent.
  const [resetMap, setResetMap] = useState(false);
  // State to indicate when the map has been reset, prop to pass RouteForm.
  const [mapReset, setMapReset] = useState(false);

  // Handler for route calculation.
  const handleRouteCalculation = (route) => {
    setRouteInfo(route);
  };

  // Handler for resetting the map. Triggers reset in RouteForm.
  const handleMapReset = () => {
    setMapReset(true);
  };

  // Effect for handling map reset.
  useEffect(() => {
    if (mapReset) {
      setRouteInfo(null); // Reset the route information.
      setMapReset(false); // Reset the mapReset state.
    }
  }, [mapReset]); // Trigger when map reset changes.

  // Render the application layout.
  return (
    <div className="app-container">
      <h1>DYNAMON Coding Challenge - Route Calculator</h1>
      <div className="map-container">
        {/* MapComponent with props for route calculation and reset handling. */}
        <MapComponent
          onRouteCalculated={handleRouteCalculation}
          resetMap={resetMap}
          setResetMap={setResetMap}
          onMapReset={handleMapReset}
        />
      </div>
      {/* Flex container for controls and saved routes */}
      <div className="route-and-saved-container">
        {/* RouteForm with props for route information and reset state. */}
        <RouteForm routeInfo={routeInfo} reset={mapReset} />
      </div>
    </div>
  );
};

export default Home;
