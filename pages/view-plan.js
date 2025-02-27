import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/backend/Firebase";
import { GoogleMap, MarkerF, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "10px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
};

const libraries = ["places"];

const ViewPlan = () => {
  const router = useRouter();
  const { id } = router.query;
  const [plan, setPlan] = useState(null);
  const [directions, setDirections] = useState({});

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
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
    if (isLoaded && plan?.drivers?.length > 0) {
      plan.drivers.forEach((driver, index) => calculateRoute(driver, index));
    }
  }, [isLoaded, plan]);

  const calculateRoute = (driver, index) => {
    if (!driver?.startCoords || !plan.destinationCoords) return;

    const waypoints = driver.passengers?.map((passenger) => ({
      location: passenger.coords,
      stopover: true,
    })) || [];

    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded yet.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: driver.startCoords,
        destination: plan.destinationCoords,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections((prev) => ({ ...prev, [index]: result }));
        } else {
          console.error(`Error fetching directions for driver ${index}:`, status);
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
      <Details>
        <p><strong>Date:</strong> {plan.date}</p>
        <p><strong>Time:</strong> {plan.time}</p>
        <p><strong>Destination:</strong> {plan.destination}</p>
      </Details>

      <h2>Drivers</h2>
      {plan.drivers.map((driver, index) => (
        <DriverCard key={index}>
          <DriverDetails>
            <h3>{driver.name} <span>({driver.carName || "No Car Name"})</span></h3>
            <p><strong>Starting Location:</strong> {driver.startAddress}</p>
            <p><strong>Capacity:</strong> {driver.capacity}</p>
            <p><strong>Passengers:</strong></p>
            <PassengerList>
              {driver.passengers.length > 0 ? (
                driver.passengers.map((passenger, idx) => (
                  <li key={idx}>{passenger.name} - {passenger.address}</li>
                ))
              ) : (
                <p>No passengers assigned.</p>
              )}
            </PassengerList>
          </DriverDetails>

          {/* adding map for each driver */}
          <MapContainer>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={driver.startCoords}
              zoom={12}
            >
              {directions[index] && <DirectionsRenderer directions={directions[index]} />}
              <MarkerF position={driver.startCoords} title={`Driver: ${driver.name}`} />
              {driver.passengers.map((passenger, idx) => (
                <MarkerF key={idx} position={passenger.coords} title={`Passenger: ${passenger.name}`} />
              ))}
              <MarkerF position={plan.destinationCoords} title="Destination" />
            </GoogleMap>
          </MapContainer>
        </DriverCard>
      ))}

      <h2>Unassigned Passengers</h2>
      {plan.passengers?.length > 0 ? (
        <PassengerList>
          {plan.passengers.map((passenger, index) => (
            <li key={index}>{passenger.name} - {passenger.address}</li>
          ))}
        </PassengerList>
      ) : (
        <p>No unassigned passengers.</p>
      )}
    </Container>
  );
};

export default ViewPlan;

const Container = styled.div`
  width: 80%;
  margin: auto;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: bold;
  margin-bottom: 15px;
`;

const Details = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const DriverCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 25px;
  text-align: left;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const DriverDetails = styled.div`
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
  }
`;

const PassengerList = styled.ul`
  list-style-type: none;
  padding: 0;

  li {
    padding: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    margin-bottom: 5px;
  }
`;

const MapContainer = styled.div`
  margin-top: 15px;
  border-radius: 10px;
  overflow: hidden;
`;

