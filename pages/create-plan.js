import React, { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRouter } from "next/router";
import { validateAddress } from "@/backend/Geocode";
import { savePlan } from "@/backend/Database";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/backend/Firebase";
import { useEffect } from "react";

const CreatePlan = () => {
  const router = useRouter();
  const { id } = router.query;

  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [isDestinationValid, setIsDestinationValid] = useState(null);

  const handleDestinationChange = async (e) => {
    const address = e.target.value;
    setDestination(address);

    if (address.trim() !== "") {
      const result = await validateAddress(address);
      setIsDestinationValid(result.valid);
      if (result.valid) {
        setDestinationCoords({ lat: result.lat, lng: result.lng });
      }
    }
  };

  const [drivers, setDrivers] = useState([]);
  const [unassignedPassengers, setUnassignedPassengers] = useState([]);
  
  const [driverName, setDriverName] = useState("");
  const [carCapacity, setCarCapacity] = useState("");
  const [carName, setCarName] = useState("");
  const [driverAddress, setDriverAddress] = useState("");
  const [isDriverAddressValid, setIsDriverAddressValid] = useState(null);

  
  const [passengerName, setPassengerName] = useState("");
  const [passengerAddress, setPassengerAddress] = useState("");
  const [passengerCoords, setPassengerCoords] = useState(null);
  const [isPassengerAddressValid, setIsPassengerAddressValid] = useState(null);

  const [autoAssign, setAutoAssign] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const addDriver = async () => {
    if (!driverName || !carCapacity || !driverAddress) return;
  
    const result = await validateAddress(driverAddress);
    if (!result.valid) {
      setIsDriverAddressValid(false);
      return;
    }
  
    setDrivers([
      ...drivers,
      {
        id: `driver-${drivers.length}`,
        name: driverName,
        capacity: Number(carCapacity),
        carName,
        startAddress: driverAddress,
        startCoords: { lat: result.lat, lng: result.lng },
        passengers: []
      }
    ]);
  
    setDriverName("");
    setCarCapacity("");
    setCarName("");
    setDriverAddress("");
    setIsDriverAddressValid(true);
  };
  

  const addPassenger = async () => {
    if (!passengerName || !passengerAddress) return;
  
    console.log("Checking address:", passengerAddress); 
  
    const result = await validateAddress(passengerAddress);
    console.log("Validation Result:", result); 
  
    if (!result.valid) {
      setIsPassengerAddressValid(false);
      return;
    }
  
    const totalPassengers = unassignedPassengers.length + drivers.reduce((sum, driver) => sum + driver.passengers.length, 0);
    const newPassengerId = `passenger-${totalPassengers}`; 
  
    setUnassignedPassengers([
      ...unassignedPassengers,
      { id: newPassengerId, name: passengerName, address: passengerAddress, coords: { lat: result.lat, lng: result.lng } }
    ]);
  
    setPassengerName("");
    setPassengerAddress("");
    setIsPassengerAddressValid(true); 
  };
  // Calculating shortest distance, may not be the most practical but after testing it still works really well.
  // If this app ever gets scaled in future, I probably look to use distance matrix api 
  const calculateDistance = (coords1, coords2) => {
    const R = 6371; // radius of earth km
    const lat1 = coords1.lat * (Math.PI / 180);
    const lat2 = coords2.lat * (Math.PI / 180);
    const dLat = lat2 - lat1;
    const dLng = (coords2.lng - coords1.lng) * (Math.PI / 180);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // distance in km
};

const optimizeAssignments = () => {
    let updatedDrivers = [...drivers]; // copying current drivers and unassigned passengers
    let remainingPassengers = [...unassignedPassengers];

    // iterate each driver to assign them passengers
    updatedDrivers = updatedDrivers.map((driver) => {
        if (remainingPassengers.length === 0) return driver;

        const availableSlots = driver.capacity - driver.passengers.length;
        
        if (availableSlots > 0) {
            // sort remaining passengers by proximity to drivers address
            remainingPassengers.sort((a, b) => 
                calculateDistance(driver.startCoords, a.coords) - calculateDistance(driver.startCoords, b.coords)
            );
            // assigning clostet passenger until car is full
            const assigned = remainingPassengers.splice(0, availableSlots);
            return { ...driver, passengers: [...driver.passengers, ...assigned] };
        }
        
        return driver;
    });
    // update state
    setDrivers(updatedDrivers);
    setUnassignedPassengers(remainingPassengers);

    return { updatedDrivers, remainingPassengers };
};

const finalizePlan = async () => {
  if (!eventName || !date || !time || !destination || drivers.length === 0) {
      alert("Please fill out all required fields before finalizing!");
      return;
  }
  // when automate button selected
  if (autoAssign) {
      setIsOptimizing(true);
      setTimeout(async () => {
          const { updatedDrivers, remainingPassengers } = optimizeAssignments();

          await saveAndRedirect(updatedDrivers, remainingPassengers); // pass updated data
      }, 1000); // needed slight delay for UI feedback
  } else {
      await saveAndRedirect(drivers, unassignedPassengers);
  }
};


const saveAndRedirect = async (updatedDrivers, remainingPassengers) => {
  const planData = {
      eventName,
      date,
      time,
      destination,
      destinationCoords,
      drivers: updatedDrivers,
      passengers: remainingPassengers,
      createdAt: new Date().toISOString(),
  };

  try {
      if (id) {
          await setDoc(doc(db, "plans", id), planData, { merge: true }); // existing plan update
      } else {
          const planId = await savePlan(planData);
          router.push(`/view-plan?id=${planId}`);
      }

      router.push("/my-plans");
  } catch (error) {
      console.error("Error saving plan:", error);
  } finally {
      setIsOptimizing(false);
  }
};

useEffect(() => {
  if (id) { // if plan ID exists in query
      const fetchPlan = async () => {
          const docRef = doc(db, "plans", id); // reference firestore doc for current plan
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
              console.error("Plan not found!");
              return;
          }

          const planData = docSnap.data(); // extract plan from firestore
          
          // create set of all passenger IDs from drivers
          const assignedPassengerIds = new Set(
              planData.drivers.flatMap(driver => driver.passengers.map(p => p.id))
          );
          // update state
          setEventName(planData.eventName);
          setDate(planData.date);
          setTime(planData.time);
          setDestination(planData.destination);
          setDestinationCoords(planData.destinationCoords);
          setDrivers(planData.drivers);
          
          // filtering unassigned
          setUnassignedPassengers(
              (planData.passengers || []).filter(p => !assignedPassengerIds.has(p.id))
          );
      };

      fetchPlan(); // fetch plan but async
  }
}, [id]); //rerun when id changes

  const removeDriver = (index) => setDrivers(drivers.filter((_, i) => i !== index));
  const removePassenger = (index) => setUnassignedPassengers(unassignedPassengers.filter((_, i) => i !== index));

  
  const canAddToCar = (driver, passengers) => driver.passengers.length + passengers.length <= driver.capacity;
  // drag and drop logic
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

    const startPassengers = [...start];
    startPassengers.splice(source.index, 1);
    const finishPassengers = [...finish];
    finishPassengers.splice(destination.index, 0, movedPassenger);

    if (source.droppableId === "unassigned") setUnassignedPassengers(startPassengers);
    else setDrivers(drivers.map(driver => driver.id === source.droppableId ? { ...driver, passengers: startPassengers } : driver));

    if (destination.droppableId === "unassigned") setUnassignedPassengers(finishPassengers);
    else setDrivers(drivers.map(driver => driver.id === destination.droppableId ? { ...driver, passengers: finishPassengers } : driver));
  };

  return (
    <Container>
      <Title>Create a Plan</Title>
      <CheckboxContainer>
        <label>
          <input
            type="checkbox"
            checked={autoAssign}
            onChange={() => setAutoAssign(!autoAssign)}
          />
          Auto-Assign Passengers
        </label>
      </CheckboxContainer>
      <Section>
        <Label>Event Name:</Label>
        <Input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />

        <Label>Date:</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <Label>Time:</Label>
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

        <Label>Destination:</Label>
        <Input type="text" value={destination} onChange={handleDestinationChange} />
        {isDestinationValid === true && <ValidMessage>✅ Valid Address</ValidMessage>}
        {isDestinationValid === false && <ErrorMessage>❌ Invalid Address</ErrorMessage>}
      </Section>

      <h2>Add Driver</h2>
      <Section>
        <Input 
          type="text" 
          placeholder="Driver Name" 
          value={driverName} 
          onChange={(e) => setDriverName(e.target.value)} 
        />
        
        <Input 
          type="number" 
          placeholder="Car Capacity" 
          value={carCapacity} 
          onChange={(e) => setCarCapacity(e.target.value)} 
        />

        <Input 
          type="text" 
          placeholder="Car Name (Optional)" 
          value={carName} 
          onChange={(e) => setCarName(e.target.value)} 
        />

        <Input 
          type="text" 
          placeholder="Starting Address" 
          value={driverAddress} 
          onChange={async (e) => {
            const address = e.target.value;
            setDriverAddress(address);

            if (address.trim() !== "") {
              const result = await validateAddress(address);
              setIsDriverAddressValid(result.valid);
            }
          }} 
        />
        {isDriverAddressValid === true && <ValidMessage>✅ Valid Address</ValidMessage>}
        {isDriverAddressValid === false && <ErrorMessage>❌ Invalid Address</ErrorMessage>}

        <Button onClick={addDriver}>Add Driver</Button>
      </Section>


      <h2>Add Passenger</h2>
      <Section>
        <Input 
          type="text" 
          placeholder="Passenger Name" 
          value={passengerName} 
          onChange={(e) => setPassengerName(e.target.value)} 
        />
        
        <Input 
          type="text" 
          placeholder="Passenger Address" 
          value={passengerAddress} 
          onChange={(e) => setPassengerAddress(e.target.value)} 
        />

        {isPassengerAddressValid === true && <ValidMessage>✅ Valid Address</ValidMessage>}
        {isPassengerAddressValid === false && <ErrorMessage>❌ Invalid Address</ErrorMessage>}  

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

      <Button onClick={finalizePlan} disabled={isOptimizing}>
        {isOptimizing ? "Optimizing Assignments..." : "Finalize Plan"}
      </Button>
    </Container>
  );
};

export default CreatePlan;

const ValidMessage = styled.p`color: green;`;
const ErrorMessage = styled.p`color: red;`;

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


const Title = styled.h1`
 font-size: 2.5rem;
 font-weight: bold;
 margin-bottom: 20px;
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
background: ${(props) => (props.disabled ? "#ccc" : "#4CC9F0")};
color: white;
padding: 10px 15px;
border: none;
border-radius: 5px;
cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
transition: background 0.3s ease;

&:hover {
  background: ${(props) => (props.disabled ? "#ccc" : "#3BA6D2")};
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

const CheckboxContainer = styled.div`
  margin-bottom: 20px;
  font-size: 1rem;
`;