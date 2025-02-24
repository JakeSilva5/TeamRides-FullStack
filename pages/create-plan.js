import React, { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRouter } from "next/router";

const CreatePlan = () => {
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [destination, setDestination] = useState("");

  const [drivers, setDrivers] = useState([]);
  const [unassignedPassengers, setUnassignedPassengers] = useState([]);

  const [driverName, setDriverName] = useState("");
  const [carCapacity, setCarCapacity] = useState("");
  const [carName, setCarName] = useState("");
  const [passengerName, setPassengerName] = useState("");

  const addDriver = () => {
    if (!driverName || !carCapacity) return;
    setDrivers([
      ...drivers,
      { id: `driver-${drivers.length}`, name: driverName, capacity: Number(carCapacity), carName, passengers: [] },
    ]);
    setDriverName("");
    setCarCapacity("");
    setCarName("");
  };

  const addPassenger = () => {
    if (!passengerName) return;
    setUnassignedPassengers([...unassignedPassengers, { id: `passenger-${unassignedPassengers.length}`, name: passengerName }]);
    setPassengerName("");
  };

  const removeDriver = (index) => {
    setDrivers(drivers.filter((_, i) => i !== index));
  };

  const removePassenger = (index) => {
    setUnassignedPassengers(unassignedPassengers.filter((_, i) => i !== index));
  };

  const canAddToCar = (driver, passengers) => {
    return driver.passengers.length + passengers.length <= driver.capacity;
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = source.droppableId === "unassigned" ? unassignedPassengers : drivers.find(driver => driver.id === source.droppableId).passengers;
    const finish = destination.droppableId === "unassigned" ? unassignedPassengers : drivers.find(driver => driver.id === destination.droppableId).passengers;

    const movedPassenger = start.find(passenger => passenger.id === draggableId);

    if (destination.droppableId !== "unassigned") {
      const targetDriver = drivers.find(driver => driver.id === destination.droppableId);
      if (!canAddToCar(targetDriver, [movedPassenger])) return;
    }

    if (source.droppableId === destination.droppableId) {
      const newPassengers = Array.from(start);
      newPassengers.splice(source.index, 1);
      newPassengers.splice(destination.index, 0, movedPassenger);

      if (source.droppableId === "unassigned") {
        setUnassignedPassengers(newPassengers);
      } else {
        setDrivers(drivers.map(driver =>
          driver.id === source.droppableId ? { ...driver, passengers: newPassengers } : driver
        ));
      }
    } else {
      const startPassengers = Array.from(start);
      startPassengers.splice(source.index, 1);
      const finishPassengers = Array.from(finish);
      finishPassengers.splice(destination.index, 0, movedPassenger);

      if (source.droppableId === "unassigned") {
        setUnassignedPassengers(startPassengers);
      } else {
        setDrivers(drivers.map(driver =>
          driver.id === source.droppableId ? { ...driver, passengers: startPassengers } : driver
        ));
      }

      if (destination.droppableId === "unassigned") {
        setUnassignedPassengers(finishPassengers);
      } else {
        setDrivers(drivers.map(driver =>
          driver.id === destination.droppableId ? { ...driver, passengers: finishPassengers } : driver
        ));
      }
    }
  };
  const finalizePlan = () => {
    router.push("/final-plan");
  };

  return (
    <Container>
      <Title>Create a Plan</Title>

      <Section>
        <Label>Event Name:</Label>
        <Input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />

        <Label>Date:</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <Label>Time:</Label>
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

        <Label>Destination:</Label>
        <Input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />

      </Section>

      <h2>Add Driver</h2>
      <Section>
        <Input type="text" placeholder="Driver Name" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
        <Input type="number" placeholder="Car Capacity (Passenger Spots)" value={carCapacity} onChange={(e) => setCarCapacity(e.target.value)} />
        <Input type="text" placeholder="Car Name (Optional)" value={carName} onChange={(e) => setCarName(e.target.value)} />
        <Button onClick={addDriver}>Add Driver</Button>
      </Section>

      <h2>Add Passenger</h2>
      <Section>
        <Input type="text" placeholder="Passenger Name" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} />
        <Button onClick={addPassenger}>Add Passenger</Button>
      </Section>

      <DragDropContext onDragEnd={onDragEnd}>
        <DragDropSection>
          {drivers.map(driver => (
            <Droppable key={driver.id} droppableId={driver.id}>
              {(provided) => (
                <CarBox ref={provided.innerRef} {...provided.droppableProps} maxCapacity={driver.capacity}>
                  <h3>{driver.name} {driver.carName ? `(${driver.carName})` : ""}</h3>
                  {driver.passengers.map((passenger, index) => (
                    <Draggable key={passenger.id} draggableId={passenger.id} index={index}>
                      {(provided) => (
                        <PassengerItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          {passenger.name}
                        </PassengerItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CarBox>
              )}
            </Droppable>
          ))}

          <Droppable droppableId="unassigned">
            {(provided) => (
              <CarBox ref={provided.innerRef} {...provided.droppableProps}>
                <h3>Unassigned Passengers</h3>
                {unassignedPassengers.map((passenger, index) => (
                  <Draggable key={passenger.id} draggableId={passenger.id} index={index}>
                    {(provided) => (
                      <PassengerItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        {passenger.name}
                      </PassengerItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </CarBox>
            )}
          </Droppable>
        </DragDropSection>
      </DragDropContext>

      <Button onClick={finalizePlan}>Finalize Plan</Button>
    </Container>
  );
};

export default CreatePlan;

const DragDropSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const PassengerItem = styled.div`
  padding: 10px;
  margin: 5px;
  background: #4CC9F0;
  color: white;
  border-radius: 5px;
  text-align: center;
`;

const CarBox = styled.div`
  background: rgba(76, 201, 240, 0.2);
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  min-height: ${({ maxCapacity }) => maxCapacity * 40}px;
`;


/* 🔹 Styled Components */
const Title = styled.h1`
 font-size: 2.5rem;
 font-weight: bold;
 margin-bottom: 20px; /* Adds spacing below the title */
`;


const Container = styled.div`
 width: 60%;
 margin: auto;
 padding: 20px;
 text-align: center;
`;


const Section = styled.div`
 margin-bottom: 20px;
`;


const Label = styled.label`
 display: block;
 margin-bottom: 5px;
 font-weight: bold;
`;


const Input = styled.input`
 width: 100%;
 padding: 8px;
 margin-top: 5px;
 margin-bottom: 10px;
 border: 1px solid #ccc;
 border-radius: 5px;
`;


const Button = styled.button`
 background: #4CC9F0;
 color: white;
 padding: 10px 15px;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 margin-top: 10px;
 transition: background 0.3s;


 &:hover {
   background: #3BA6D2;
 }
`;


const List = styled.ul`
 list-style-type: none;
 padding: 0;
`;


const ListItem = styled.li`
 display: flex;
 justify-content: space-between;
 align-items: center;
 background: rgba(255, 255, 255, 0.1);
 padding: 10px;
 border-radius: 5px;
 margin-bottom: 5px;
`;


const RemoveButton = styled.button`
 background: red;
 color: white;
 padding: 5px 10px;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 transition: background 0.3s;


 &:hover {
   background: darkred;
 }
`;


const ReviewSection = styled.div`
 background: rgba(255, 255, 255, 0.15);
 padding: 15px;
 border-radius: 10px;
 margin: 20px 0;
 text-align: center;
`;

const EmptyMessage = styled.p`
 color: #aaa;
 font-style: italic;
 margin-top: 10px;
`;