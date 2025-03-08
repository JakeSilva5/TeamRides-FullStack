import React, { useState, useRef } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRouter } from "next/router";
import { validateAddress } from "@/backend/Geocode";
import { savePlan } from "@/backend/Database";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/backend/Firebase";
import { useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";

const CreatePlan = () => {
 const router = useRouter();
 const { id } = router.query;


 const [eventName, setEventName] = useState("");
 const [date, setDate] = useState("");
 const [time, setTime] = useState("");
 const [destination, setDestination] = useState("");
 const [destinationCoords, setDestinationCoords] = useState(null);
 const [isDestinationValid, setIsDestinationValid] = useState(null);

const destinationAutocompleteRef = useRef(null);
const driverAutocompleteRef = useRef(null);
const passengerAutocompleteRef = useRef(null);

const handleDestinationSelect = () => {
  const place = destinationAutocompleteRef.current.getPlace();
  if (!place.geometry) return;

  setDestination(place.formatted_address);
};

const handlePassengerAddressSelect = () => {
  const place = passengerAutocompleteRef.current.getPlace();
  if (!place.geometry) return;

  setPassengerAddress(place.formatted_address);
};

const handleDriverAddressSelect = () => {
  const place = driverAutocompleteRef.current.getPlace();
  if (!place.geometry) return;

  setDriverAddress(place.formatted_address);
};


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
      passengers: [],
    },
  ]);

  setDriverName("");
  setCarCapacity("");
  setCarName("");
  setDriverAddress("");
  setIsDriverAddressValid(true);
};

const addPassenger = async () => {
  if (!passengerName || !passengerAddress) return;

  const result = await validateAddress(passengerAddress);
  if (!result.valid) {
    setIsPassengerAddressValid(false);
    return;
  }

  setUnassignedPassengers([
    ...unassignedPassengers,
    {
      id: `passenger-${unassignedPassengers.length}`,
      name: passengerName,
      address: passengerAddress,
      coords: { lat: result.lat, lng: result.lng },
    },
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
      await setDoc(doc(db, "plans", id), planData, { merge: true }); // Update existing plan
    } else {
      await savePlan(planData);
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
    const { source, destination, draggableId } = result;
    if (!destination) return; // Do nothing if dropped outside
  
    const sourceDriver = source.droppableId === "unassigned"
      ? null
      : drivers.find(driver => driver.id === source.droppableId);
    const destinationDriver = destination.droppableId === "unassigned"
      ? null
      : drivers.find(driver => driver.id === destination.droppableId);
  
    let updatedDrivers = [...drivers];
    let updatedUnassigned = [...unassignedPassengers];
  
    // Find the passenger being moved
    let movedPassenger = sourceDriver
      ? sourceDriver.passengers.find(p => p.id === draggableId)
      : unassignedPassengers.find(p => p.id === draggableId);
  
    if (!movedPassenger) return; // Safety check
  
    // Remove passenger from original list
    if (source.droppableId === "unassigned") {
      updatedUnassigned = updatedUnassigned.filter(p => p.id !== draggableId);
    } else {
      updatedDrivers = updatedDrivers.map(driver =>
        driver.id === source.droppableId
          ? { ...driver, passengers: driver.passengers.filter(p => p.id !== draggableId) }
          : driver
      );
    }
  
    // **Ensure the car has space before adding the passenger**
    if (destination.droppableId !== "unassigned") {
      const targetDriver = updatedDrivers.find(driver => driver.id === destination.droppableId);
      if (targetDriver && targetDriver.passengers.length >= targetDriver.capacity) {
        console.warn("Car is full! Cannot add more passengers.");
        return;
      }
    }
  
    // Add passenger to new list
    if (destination.droppableId === "unassigned") {
      updatedUnassigned.splice(destination.index, 0, movedPassenger);
    } else {
      updatedDrivers = updatedDrivers.map(driver =>
        driver.id === destination.droppableId
          ? { ...driver, passengers: [...driver.passengers.slice(0, destination.index), movedPassenger, ...driver.passengers.slice(destination.index)] }
          : driver
      );
    }
  
    // Update state
    setDrivers(updatedDrivers);
    setUnassignedPassengers(updatedUnassigned);
  };
  


 return (
   
  <>
    <Title>Create a Plan</Title>

     <CheckboxContainer>
       <label>
         <input
           type="checkbox"
           checked={autoAssign}
           onChange={() => setAutoAssign(!autoAssign)}
         />
         Automatic Mode : Auto-Assign Passengers
       </label>
     </CheckboxContainer>

     <EventSection>
     <SectionTitle>Event Details</SectionTitle>

     <InputGroup>
       <Label>Event Name:</Label>
       <Input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)}placeholder="Enter event name" />
      </InputGroup>

      <InputGroup>
       <Label>Date:</Label>
       <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </InputGroup>

      <InputGroup>
       <Label>Time:</Label>
       <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </InputGroup>

      <InputGroup>
       <Label>Destination:</Label>
       <AutocompleteWrapper>
        <Autocomplete onLoad={(ref) => (destinationAutocompleteRef.current = ref)} onPlaceChanged={handleDestinationSelect}>
          <Input type="text" value={destination} onChange={handleDestinationChange} placeholder="Enter destination address" />
        </Autocomplete>
      </AutocompleteWrapper>
        {isDestinationValid === true && <ValidMessage>✅ Valid Address</ValidMessage>}
        {isDestinationValid === false && <ErrorMessage>❌ Invalid Address</ErrorMessage>}
     </InputGroup>
     </EventSection>

     <DriverPassengerSection>
     <SectionTitle>Add Driver</SectionTitle>
     <InputGroup>
      <Label>Driver Name:</Label>
      <Input type="text" value={driverName} onChange={(e) => setDriverName(e.target.value)}placeholder="Enter driver's name"/>
      </InputGroup>
      
    <InputGroup>
      <Label>Car Capacity:</Label>
      <Input type="number" value={carCapacity} onChange={(e) => setCarCapacity(e.target.value)}placeholder="Enter number of passenger seats" />
    </InputGroup>

    <InputGroup>
      <Label>Car Name (Optional):</Label>
      <Input type="text" value={carName} onChange={(e) => setCarName(e.target.value)} placeholder="Enter car nickname"/>
    </InputGroup>

    <InputGroup>
      <Label>Starting Address:</Label>
      <AutocompleteWrapper>
        <Autocomplete onLoad={(ref) => (driverAutocompleteRef.current = ref)} onPlaceChanged={handleDriverAddressSelect}>
          <Input type="text" value={driverAddress} onChange={(e) => setDriverAddress(e.target.value)} placeholder="Enter driver’s address" />
        </Autocomplete>
      </AutocompleteWrapper>
        {isDriverAddressValid === true && <ValidMessage>✅ Valid Address</ValidMessage>}
        {isDriverAddressValid === false && <ErrorMessage>❌ Invalid Address</ErrorMessage>}
    </InputGroup>
    <StyledButton onClick={addDriver}>Add Driver</StyledButton>
    

    <SectionTitle>Add Passenger</SectionTitle>
    <InputGroup>
      <Label>Passenger Name:</Label>
      <Input type="text" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} placeholder="Enter passenger's name"/>
    </InputGroup>
      
    <InputGroup>
      <Label>Passenger Address:</Label>
      <AutocompleteWrapper>
        <Autocomplete onLoad={(ref) => (passengerAutocompleteRef.current = ref)} onPlaceChanged={handlePassengerAddressSelect}>
          <Input type="text" value={passengerAddress} onChange={(e) => setPassengerAddress(e.target.value)} placeholder="Enter passenger’s address" />
        </Autocomplete>
      </AutocompleteWrapper>
        {isPassengerAddressValid === true && <ValidMessage>✅ Valid Address</ValidMessage>}
        {isPassengerAddressValid === false && <ErrorMessage>❌ Invalid Address</ErrorMessage>}
    </InputGroup>

    <StyledButton onClick={addPassenger}>Add Passenger</StyledButton>
    </DriverPassengerSection>

    <DragDropSection>
    <SectionTitle>Manual Adjustments</SectionTitle>
    <OptionalLabel>(optional)</OptionalLabel>
     <DragDropContext onDragEnd={onDragEnd}>
      <DragDropColumns>
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
        </DragDropColumns>
     </DragDropContext>
     </DragDropSection>
     <FinalizeButtonContainer>
     <StyledButton onClick={finalizePlan} disabled={isOptimizing}>
       {isOptimizing ? "Optimizing Assignments..." : "Finalize Plan"}
      </StyledButton>
    </FinalizeButtonContainer>
  </>
 );
};

export default CreatePlan;

const ValidMessage = styled.p`color: green;`;
const ErrorMessage = styled.p`color: red;`;


const EventSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  width: 60%;
  max-width: 800px;
  margin: 20px auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const DriverPassengerSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  width: 60%;
  max-width: 800px;
  margin: 20px auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const DragDropSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  width: 60%;
  max-width: 800px;
  margin: 20px auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DragDropColumns = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 20px;
  flex-wrap: wrap;
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
  min-width: 250px;
  max-width: 300px;
  min-height: ${({ maxCapacity }) => maxCapacity * 40}px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-top: 12px;
  margin-bottom: 20px;
  width: 100%;

`;

const FinalizeButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const Label = styled.label`
  font-size: 1.1rem;
  color: white;
  margin-bottom: 5px;
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 500px;
  text-align: center; 
`;

const AutocompleteWrapper = styled.div`
  width: 100%;
  max-width: 500px;
`;

const StyledButton = styled.button`
  width: 250px;
  background: #4CC9F0;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.3s;
  text-align: center;
  margin-top: 15px; 
  margin-bottom: 40px; 

  &:hover {
    background: #3BA6D2;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: white;
  margin-bottom: 15px;
  text-align: center;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 8px;
  width: 80%;
`;

const CheckboxContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 8px;
  width: 40%;
  margin: 20px auto;
  text-align: center;
`;

const OptionalLabel = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5); /* Light gray */
  font-style: italic;
  margin-top: -5px;
  text-align: center;
`;