import React, { useEffect, useState } from "react";
import L, { icon, marker } from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const MapComponent = ({
  onRouteCalculated, // Callback for when a route is finalised.
  resetMap, // Flag to trigger map reset.
  setResetMap, // Function to update the resetMap state.
  onMapReset, // Callback for when the map is reset.
}) => {
  const [waypoints, setWaypoints] = useState([]); // State to manage waypoints on the map
  const [routingControl, setRoutingControl] = useState(null); // State to manage the routing control object
  const [map, setMap] = useState(null); // State to hold the map instance
  const [isWaypointMode, setIsWaypointMode] = useState(false); // State to toggle waypoint addition mode

  // Function to initialize the routing control
  const initializeRoutingControl = (mapInstance) => {
    const newRoutingControl = L.Routing.control({
      waypoints: [], // Initial empty array of waypoints
      routeWhileDragging: true, // Allow route calculation while dragging waypoints
      addWaypoints: false, // Disable adding new waypoints
      geocoder: L.Control.Geocoder.nominatim(), // Use Nominatim geocoder
      router: L.Routing.osrmv1({ profile: "car" }), // Use OSRM with car profile
    }).addTo(mapInstance);

    newRoutingControl.on("routesfound", function (e) {
      onRouteCalculated(e.routes[0]); // Call the onRouteCalculated callback with the first found route
    });

    return newRoutingControl; // Return the created routing control
  };

  useEffect(() => {
    // Initialize the map only if it doesn't already exist
    if (!L.DomUtil.get("map") || !L.DomUtil.get("map")._leaflet_id) {
      const newMap = L.map("map").locate({ setView: true, maxZoom: 16 }); // Create new map instance
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(newMap); // Add OpenStreetMap tile layer

      const newRoutingControl = initializeRoutingControl(newMap); // Initialize routing control
      setRoutingControl(newRoutingControl); // Set the state with the new routing control
      setMap(newMap); // Set the state with the new map
    }
  }, [onRouteCalculated]); // Depend on onRouteCalculated to avoid unnecessary re-renders

  useEffect(() => {
    // Clear waypoints and reset routing control when the resetMap flag is true
    if (resetMap) {
      waypoints.forEach((marker) => map.removeLayer(marker)); // Remove all waypoints from the map
      setWaypoints([]); // Clear the waypoints state

      // Reinitialize the routing control if both map and routing control exist
      if (map && routingControl) {
        map.removeControl(routingControl); // Remove existing routing control from the map
        const newRoutingControl = initializeRoutingControl(map); // Create a new routing control
        setRoutingControl(newRoutingControl); // Update the state with the new routing control.
      }

      setResetMap(false); // Set resetMap state to false after reset is complete
      onMapReset(); // Call the onMapReset callback
    }
  }, [resetMap, map, routingControl, waypoints]); // Depend on resetMap, map, routingControl, and waypoints

  // Handler for map click events, adds a marker at the clicked location.
  const handleMapClick = (e) => {
    // Check if waypoint mode is enabled and the map instance is available.
    if (!isWaypointMode || !map) return;
    // Create a new marker at the clicked latitude and longitude.
    const latLng = L.latLng(e.latlng.lat, e.latlng.lng);
    // Define a custom icon for the marker.
    const customIcon = new L.Icon({
      iconUrl: "/markerIcon.png", // Path to the icon image.
      iconSize: [25, 30], // Size of the icon.
      iconAnchor: [12, 30], // Anchor point of the icon.
    });
    // Add the marker to the map and make it draggable.
    const marker = L.marker(latLng, { icon: customIcon, draggable: true })
      .addTo(map)
      .on("dragend", function () {
        // Update waypoints when the marker is dragged.
        updateWaypoints();
      });

    // Add a click event listener to the marker for removal.
    marker.on("click", () => {
      // Remove the marker from the map.
      map.removeLayer(marker);
      // Update waypoints after marker removal.
      updateWaypoints(marker, true);
    });

    // Update the waypoints state by adding the new marker.
    setWaypoints((prevWaypoints) => [...prevWaypoints, marker]);
  };

  // Updates the list of waypoints, optionally removing a specified marker.
  const updateWaypoints = (removedMarker = null, isRemoval = false) => {
    // Update the waypoints state. If isRemoval is true, filter out the removedMarker. If isRemoval is false, return true for each and include the waypoints.
    setWaypoints((prevWaypoints) =>
      prevWaypoints.filter((wp) => (isRemoval ? wp !== removedMarker : true))
    );
  };

  // Finalizes the route based on the current waypoints.
  const finalizeRoute = () => {
    // Ensure there are at least two waypoints before finalizing the route.
    if (waypoints.length < 2) {
      alert("Please add at least two waypoints before finalizing the route.");
      return;
    }
    // If routing control is available and there are sufficient waypoints, update the routing control with these waypoints.
    if (routingControl && !(waypoints.length < 2)) {
      routingControl.setWaypoints(waypoints.map((wp) => wp.getLatLng()));
    }
  };

  // Toggles the waypoint mode on and off.
  const toggleWaypointMode = () => {
    setIsWaypointMode(!isWaypointMode);
  };

  // Effect to handle map click events based on waypoint mode.
  useEffect(() => {
    // If the map instance is available, adjust the click handlers and cursor style.
    if (map) {
      // Remove the existing click event listener.
      map.off("click", handleMapClick);
      // If waypoint mode is enabled, add the click event listener and change cursor style.
      if (isWaypointMode) {
        map.on("click", handleMapClick);
        map.getContainer().style.cursor = "crosshair";
      } else {
        // Reset cursor style when waypoint mode is disabled.
        map.getContainer().style.cursor = "";
      }
    }
  }, [map, isWaypointMode]);

  return (
    <div>
      {/* Map container with a fixed height and full width */}
      <div id="map" style={{ height: "500px", width: "100%" }}></div>
      {/* Container for map control buttons */}
      <div className="map-controls">
        {/* Button to toggle waypoint mode. Text changes based on isWaypointMode state */}
        <button onClick={toggleWaypointMode}>
          {isWaypointMode ? "Exit Waypoint Mode" : "Enter Waypoint Mode"}
        </button>
        {/* Button to finalize and calculate the route */}
        <button onClick={() => finalizeRoute()}>Finalize Route</button>
        {/* Button to reset the map, which sets resetMap state to true */}
        <button onClick={() => setResetMap(true)}>Reset Map</button>
      </div>
    </div>
  );
};

export default MapComponent;
