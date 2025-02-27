import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/backend/Firebase";
import { GoogleMap, MarkerF, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const googleMapsLibraries = ["places"];

const ViewPlan = () => {
  const router = useRouter();
  const { id } = router.query;
  const [plan, setPlan] = useState(null);
  const [directions, setDirections] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  });

  useEffect(() => {
    if (id) {
      const fetchPlan = async () => {
        const docRef = doc(db, "plans", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPlan(docSnap.data());
        } else {
          console.error("No such plan found!");
        }
      };
      fetchPlan();
    }
  }, [id]);

  useEffect(() => {
    if (isLoaded && plan && plan.drivers?.length > 0) {
      calculateRoute();
    }
  }, [isLoaded, plan]);

  const calculateRoute = () => {
    if (!plan || !isLoaded) return;

    const driver = plan.drivers[0];
    if (!driver?.startCoords || !plan.destinationCoords) return;

    const start = driver.startCoords;
    const destination = plan.destinationCoords;
    const waypoints = driver.passengers?.map((passenger) => ({
      location: passenger.coords,
      stopover: true,
    })) || [];

    if (waypoints.length === 0) return;

    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded yet.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: start,
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  };

  if (loadError) return <p>Error loading Google Maps</p>;
  if (!isLoaded) return <p>Loading Google Maps...</p>;
  if (!plan) return <p>Loading plan...</p>;

  return (
    <Container>
      <Title>{plan.eventName}</Title>
      <p><strong>Date:</strong> {plan.date}</p>
      <p><strong>Time:</strong> {plan.time}</p>
      <p><strong>Destination:</strong> {plan.destination}</p>

      <h2>Drivers</h2>
      {plan.drivers.map((driver, index) => (
        <DriverCard key={index}>
          <p><strong>{driver.name}</strong> ({driver.carName || "No Car Name"})</p>
          <p><strong>Starting Location:</strong> {driver.startAddress}</p>
          <p>Capacity: {driver.capacity}</p>
          <p><strong>Passengers:</strong></p>
          <ul>
            {driver.passengers.length > 0 ? (
              driver.passengers.map((passenger, idx) => (
                <li key={idx}>{passenger.name} - {passenger.address}</li>
              ))
            ) : (
              <p>No passengers assigned.</p>
            )}
          </ul>
        </DriverCard>
      ))}

      <h2>Unassigned Passengers</h2>
      {plan.passengers?.length > 0 ? (
        <ul>
          {plan.passengers.map((passenger, index) => (
            <li key={index}>{passenger.name} - {passenger.address}</li>
          ))}
        </ul>
      ) : (
        <p>No unassigned passengers.</p>
      )}

      {/* Map Section */}
      <MapContainer>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={plan.destinationCoords} zoom={10}>
          {directions && <DirectionsRenderer directions={directions} />}
          
          {/* Driver Marker */}
          {plan.drivers.map((driver, index) => (
            driver.startCoords && (
              <MarkerF key={index} position={driver.startCoords} title={`Driver: ${driver.name}`} />
            )
          ))}

          {/* Passenger Markers */}
          {plan.drivers[0]?.passengers.map((passenger, index) => (
            passenger.coords && (
              <MarkerF key={index} position={passenger.coords} title={`Passenger: ${passenger.name}`} />
            )
          ))}

          {/* Destination Marker */}
          {plan.destinationCoords && <MarkerF position={plan.destinationCoords} title="Destination" />}
        </GoogleMap>
      </MapContainer>
    </Container>
  );
};

export default ViewPlan;

const Container = styled.div`
  width: 70%;
  margin: auto;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const DriverCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: left;
`;

const MapContainer = styled.div`
  margin-top: 30px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;
