import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/backend/Firebase";


const ViewPlan = () => {
  const router = useRouter();
  const { id } = router.query;
  const [plan, setPlan] = useState(null);

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

  if (!plan) return <p>Loading...</p>;

  return (
    <div>
      <h1>{plan.eventName}</h1>
      <p><strong>Date:</strong> {plan.date}</p>
      <p><strong>Time:</strong> {plan.time}</p>
      <p><strong>Destination:</strong> {plan.destination}</p>

      <h2>Drivers</h2>
      {plan.drivers.map((driver, index) => (
      <div key={index}>
        <p><strong>{driver.name}</strong> ({driver.carName || "No Car Name"})</p>
        <p><strong>Starting Location:</strong> {driver.startAddress}</p>
        <p>Capacity: {driver.capacity}</p>
        <ul>
          {driver.passengers.map((passenger, idx) => (
            <li key={idx}>{passenger.name}</li>
          ))}
        </ul>
      </div>
    ))}


      <h2>Unassigned Passengers</h2>
      <ul>
        {plan.passengers.map((passenger, index) => (
          <li key={index}>{passenger.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewPlan;

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
