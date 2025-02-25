import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

const ViewPlan = () => {
  const router = useRouter();

  // Placeholder Data (Replace with API data later)
  const eventDetails = {
    name: "Team Trip to Nationals",
    date: "2025-04-15",
    time: "08:00 AM",
    destination: "National Sports Complex",
  };

  const drivers = [
    { id: "driver-1", name: "Jake", carName: "Jaguar", passengers: ["Mitch", "Rick", "Will", "Tommy"] },
    { id: "driver-2", name: "Olivia", carName: "Lil Babe", passengers: ["Amy", "Sophia", "Emma", "Emily"] },
  ];

  const unassignedPassengers = ["Darby", "Tahir"];

  return (
    <Container>
      <Title>View Plan</Title>

      <EventDetails>
        <h2>{eventDetails.name}</h2>
        <p><strong>Date:</strong> {eventDetails.date}</p>
        <p><strong>Time:</strong> {eventDetails.time}</p>
        <p><strong>Destination:</strong> {eventDetails.destination}</p>
      </EventDetails>

      <Section>
        <h2>Driver Assignments</h2>
        {drivers.map((driver) => (
          <CarBox key={driver.id}>
            <h3>{driver.name} {driver.carName ? `(${driver.carName})` : ""}</h3>
            <PassengerList>
              {driver.passengers.length > 0 ? (
                driver.passengers.map((passenger, index) => (
                  <PassengerItem key={index}>{passenger}</PassengerItem>
                ))
              ) : (
                <EmptyMessage>No passengers assigned.</EmptyMessage>
              )}
            </PassengerList>
          </CarBox>
        ))}
      </Section>

      {unassignedPassengers.length > 0 && (
        <Section>
          <h2>Unassigned Passengers</h2>
          <PassengerList>
            {unassignedPassengers.map((passenger, index) => (
              <PassengerItem key={index}>{passenger}</PassengerItem>
            ))}
          </PassengerList>
        </Section>
      )}

      <Button onClick={() => router.push("/my-plans")}>Back to My Plans</Button>
    </Container>
  );
};

export default ViewPlan;

/* 🔹 Styled Components */
const Container = styled.div`
  width: 60%;
  margin: auto;
  padding: 50px 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const EventDetails = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 30px;
  text-align: center;

  h2 {
    margin-bottom: 10px;
  }
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
  text-align: center;
`;

const CarBox = styled.div`
  background: rgba(76, 201, 240, 0.2);
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
`;

const PassengerList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const PassengerItem = styled.div`
  background: #4CC9F0;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
`;

const EmptyMessage = styled.p`
  color: #aaa;
  font-style: italic;
`;

const Button = styled.button`
  background: #4CC9F0;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  border: none;
  margin-top: 30px;

  &:hover {
    background: #3BA6D2;
  }
`;
