import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "@/backend/Firebase";

const MyPlans = () => {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!auth.currentUser) {
        console.error("User not authenticated!");
        return;
      }

      const userId = auth.currentUser.uid;
      const plansRef = collection(db, "plans");
      const q = query(plansRef, where("userId", "==", userId));

      try {
        const querySnapshot = await getDocs(q);
        const userPlans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlans(userPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleDelete = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      await deleteDoc(doc(db, "plans", planId));
      setPlans(plans.filter(plan => plan.id !== planId));
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  if (loading) return <p>Loading plans...</p>;

  return (
    <Container>
      <Title>My Plans</Title>
      {plans.length === 0 ? (
        <EmptyMessage>No plans found. Create one!</EmptyMessage>
      ) : (
        plans.map((plan) => (
          <PlanCard key={plan.id}>
            <h3>{plan.eventName}</h3>
            <p><strong>Date:</strong> {plan.date}</p>
            <p><strong>Time:</strong> {plan.time}</p>
            <p><strong>Destination:</strong> {plan.destination}</p>
            <ButtonContainer>
              <ViewButton onClick={() => router.push(`/view-plan?id=${plan.id}`)}>🔍 View</ViewButton>
              <EditButton onClick={() => router.push(`/create-plan?id=${plan.id}`)}>✏️ Edit</EditButton>
              <DeleteButton onClick={() => handleDelete(plan.id)}>🗑 Delete</DeleteButton>
            </ButtonContainer>
          </PlanCard>
        ))
      )}
    </Container>
  );
};

export default MyPlans;

const Container = styled.div`
  width: 60%;
  margin: auto;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const PlanCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: left;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ViewButton = styled.button`
  background: #4CC9F0;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background: #FDCB58;
  color: black;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background: #E74C3C;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
`;

const EmptyMessage = styled.p`
  color: #aaa;
  font-style: italic;
  margin-top: 10px;
`;
