import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

const MyPlans = () => {
  const router = useRouter();
  const [plans, setPlans] = useState([
    { id: 1, name: "Game Day Travel", date: "2025-03-15", time: "10:00 AM", destination: "Penn State Stadium" },
    { id: 2, name: "Away Game Trip", date: "2025-03-02", time: "8:30 AM", destination: "Ohio State Arena" },
  ]);
  const [sortOrder, setSortOrder] = useState("newest");

  const toggleSortOrder = () => {
    const sortedPlans = [...plans].sort((a, b) =>
      sortOrder === "newest"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );
    setPlans(sortedPlans);
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  const deletePlan = (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter((plan) => plan.id !== id));
    }
  };

  return (
    <Container>
      <Header>
        <Title>My Plans</Title>
        <SortButton onClick={toggleSortOrder}>
          Sort by Date: {sortOrder === "newest" ? "Newest → Oldest" : "Oldest → Newest"}
        </SortButton>
      </Header>

      <PlansGrid>
        {plans.length > 0 ? (
          plans.map((plan) => (
            <PlanCard key={plan.id}>
              <PlanTitle>{plan.name}</PlanTitle>
              <PlanInfo>
                <strong>Date:</strong> {plan.date}
              </PlanInfo>
              <PlanInfo>
                <strong>Time:</strong> {plan.time}
              </PlanInfo>
              <PlanInfo>
                <strong>Destination:</strong> {plan.destination}
              </PlanInfo>
              <ButtonContainer>
                <ViewButton onClick={() => router.push(`/view-plan?id=${plan.id}`)}>🔍 View</ViewButton>
                <EditButton onClick={() => router.push(`/create-plan?id=${plan.id}`)}>📝 Edit</EditButton>
                <DeleteButton onClick={() => deletePlan(plan.id)}>🗑️ Delete</DeleteButton>
              </ButtonContainer>
            </PlanCard>
          ))
        ) : (
          <NoPlansMessage>No saved plans yet.</NoPlansMessage>
        )}
      </PlansGrid>
    </Container>
  );
};

export default MyPlans;

const Container = styled.div`
  width: 80%;
  margin: auto;
  padding: 50px 20px;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
`;

const SortButton = styled.button`
  background: #4CC9F0;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  transition: background 0.3s ease;

  &:hover {
    background: #3BA6D2;
  }
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const PlanCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  text-align: left;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PlanTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const PlanInfo = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  margin: 5px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const ViewButton = styled.button`
  background: #4CC9F0;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  border: none;

  &:hover {
    background: #3BA6D2;
  }
`;

const EditButton = styled(ViewButton)`
  background: #FFD166;
  &:hover {
    background: #E6B800;
  }
`;

const DeleteButton = styled(ViewButton)`
  background: #EF476F;
  &:hover {
    background: #D43B5F;
  }
`;

const NoPlansMessage = styled.p`
  font-size: 1.2rem;
  opacity: 0.8;
  margin-top: 20px;
`;
