import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "@/backend/Firebase";

const MyPlans = () => {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      const user = auth.currentUser;

      if (!user) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true); 

      const plansRef = collection(db, "plans");
      const q = query(plansRef, where("userId", "==", user.uid));

      try {
        const querySnapshot = await getDocs(q);
        const userPlans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlans(userPlans);
        console.log("Fetched plans:", userPlans);
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

  if (!isAuthenticated) {
    return (
      <Container>
        <Title>My Plans</Title>
        <EmptyMessage>You need to log in to view your plans.</EmptyMessage>
      </Container>
    );
  }

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
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    filter: brightness(1.1);
  }
`;

const ViewButton = styled(Button)`
  background: #4CC9F0;
  color: white;

  &:hover {
    background: #3BA6D2;
  }
`;

const EditButton = styled(Button)`
  background: #FDCB58;
  color: black;

  &:hover {
    background: #E6B453;
  }
`;

const DeleteButton = styled(Button)`
  background: #E74C3C;
  color: white;

  &:hover {
    background: #C0392B;
  }
`;

const EmptyMessage = styled.p`
  color: #aaa;
  font-style: italic;
  margin-top: 10px;
  font-size: 1.2rem;
`;
