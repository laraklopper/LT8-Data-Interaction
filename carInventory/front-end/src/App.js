import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS File
import Header from './components/Header';//Import Header function component
import Form from './components/Form';//Import Form function component
import UpdateForm from './components/UpdateForm';//Import UpdateForm function component
import Container from 'react-bootstrap/Container';//Import Bootstrap Container
import Row from 'react-bootstrap/Row';//Import Bootstrap Row 
import Col from 'react-bootstrap/Col';//Import Bootstrap Colomn
import Button from 'react-bootstrap/Button';//Import Bootstrap button component


// App function component
export default function App() {//Export default App function component
  //==============STATE VARIABLES=================
  const [carData, setCarData] = useState({// State to manage the form data for adding a new car
    make: '',
    model: '',
    registration: '',
    owner: '',
    oldOwner: '',
  });
  const [error, setError] = useState(null);// State to handle errors during data fetching or car addition
  const [isLoaded, setIsLoaded] = useState(false);// State to track whether the data has been loaded
  const [cars, setCars] = useState([]);// State to store the fetched list of cars
  const [update, setUpdate] = useState(false);//State to manage display of the update form 
  const [newMake, setNewMake] = useState('');//State to store updated car make
  const [newModel, setNewModel] = useState('');//state to store updated car model
  const [newRegistration, setNewRegistration] = useState('');// State to store updated car registration
  const [newOwner, setNewOwner] = useState('');// State to store updated car owner
  const [carToUpdate, setCarToUpdate] = useState(null);// Track the ID of the car for the update form
  const [foundCars, setFoundCars] = useState([]);//State to store cars older than 5 years
  const [multipleUpdate, setMultipleUpdate] = useState(false); //State used to update multiple cars



  //===================FETCH JSON DATA=====================
  // useEffect hook to fetch the list of cars when the component mounts
  useEffect(() => {
    async function fetchCars() {//Define asynchronous function to fetch data
      try {
        // Fetch data from the server
        const response = await fetch('http://localhost:3001/findAllCars');

        // Conditional rendering to check if the response is successful
        if (!response.ok) {
          throw new Error('Failed to fetch data');//Throw an error message if the request is unsuccessful
        }

        const data = await response.json();// Parse the response data and update the state
        setCars(data);//Update the state variable cars with the parsed data 
        setIsLoaded(true);//Update the loading status to true
      } 
      catch (error) {
        // Handle errors 
        console.error('Error fetching data:', error.message);//Display error message in the console
        setError('Failed to fetch data');//Set an error message in the error state
        setIsLoaded(true);//Update the loading status to true
      }
    }

    // Invoke the fetchCars function
    fetchCars();
  }, []); // The empty dependency array ensures the effect runs only once on mount

  //============================FUNCTIONS TO HANDLE REQUESTS===============================
  //--------------------------POST REQUEST-------------------------------
  // Function to add a new car
  const addCar = async () => {//Define an async function to add a car 
    try {
      // Send a POST request to add a new car
      const response = await fetch('http://localhost:3001/addCar', {
        method: 'POST',//Request method
        headers: {
          'Content-type': 'application/json',//Type of content being passed
        },
        body: JSON.stringify(carData),// Convert carData to a JSON string and include it in the request body
      });

      //Conditional rendering to check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to add car');//Throw an error message if the request is unsuccessful
      }

      console.log('Car added successfully');//Display a success messge in the console the request POST request is successful 
    } 
    catch (error) {
      // Handle errors 
      console.error('Error adding car:', error.message);//Display error message in the console for debugging purposes
      setError('Error adding car:', error.message);//Log errors during the request process
    }
  };

  //Function to find cars older than 5 years
  const findCars = async() => {//Define an async function to find all cars older than 5 years
    try {
      //Send a request to the server
      const response = await fetch (`http://localhost:3001/findByModel`,{
        method: 'POST',//Request method
        headers: {
          'Content-Type': 'application/json',//Type of content being passed
        },
        body: JSON.stringify(carData)// Convert carData to a JSON string and include it in the request body
      }      
      )
      //Conditional rendering to check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to add find cars');//Throw an error message if the request is unsuccessful
      }

      const data = await response.json();// Parse the response and set the found cars
      setFoundCars(data); // Update state with the fetched data

    } 
    catch (error) {
      // Handle errors 
      console.error('Error finding cars older than 5 years:', error.message);//Display error in console for debugging purposes
      setError("Error finding cars older than 5 years", error.message);//Log errors during the request process

    }
  }

  //---------------------PUT REQUESTS-------------------
  // Function to update car details for a single car
  const updateCarDetails = async () => {//Define an async function to update car details
    try {
      //Send a request to the server
      const response = await fetch(`http://localhost:3001/updateById/${carToUpdate}`, {
        method: 'PUT',//Request method
        headers: {
          'Content-type': 'application/json',//Type of content being passed 
        },
        body: JSON.stringify({        // Convert the data to be updated into a JSON string
          // Include fields with new values and keep the rest unchanged
          ...(newMake && { make: newMake }),
          ...(newModel && { model: newModel }),
          ...(newRegistration && { registration: newRegistration }),
          ...(newOwner && { owner: newOwner }),

        }
        )
      })

      //Conditional rendering to check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to update car details')//Throw an error message if the request is unsuccessful
      }

      // Update the local state with modified car details
      setCars((prevCars) =>
        prevCars.map((car) =>
          // Conditional rendering to check if the current car's ID matches the ID of the car being updated (carToUpdate)
          car._id === carToUpdate 
            //If the car ID matches the car to be updated, create a new object with updated properties
              ? {...car,
              // Update only the fields with new values, keep the rest unchanged
              ...(newMake && { make: newMake }),//Logic to check the newMake
              ...(newModel && { model: newModel }),//Logic to check the newModel
              ...(newRegistration && { registration: newRegistration }),//Logic to check the newRegistration
              ...(newOwner && { owner: newOwner }),//Logic to check the newOwner
               } 
            : car   // If it's not the car to update, keep the current car object unchanged     
        )
      );
      // Reset the update state and clear the update form
            setUpdate(false); // Hide the update form
            setNewMake(''); // Clear the newMake input field
            setNewModel(''); // Clear the newModel input field
            setNewRegistration(''); // Clear the newRegistration input field
            setNewOwner(''); // Clear the newOwner input field

      console.log('Car details successfully updated');// Log a success message if the update request is successful
    }
    catch (error) {
      //Error handling
      console.error('Error updating car', error.message);//Display error message in the console for debugging purposes
      setError('Error updating car details', error.message);//Log errors during the update process
    }
  };

  //Function to update the details of multiple cars
  const updateMultipleCars = async () => {//Define an async function to update multiple car details
    try {

      // Send a PUT request to update multiple cars
      const response = await fetch('http://localhost:3001/updateMultipleCars', {
        method: 'PUT',//Request method
        headers: {
          'Content-type': 'application/json',//Type of content being passed
        },
        body: JSON.stringify({ // Convert the data to be updated into a JSON string
          owner: carData.oldOwner,// The old owner's data to identify the cars to be updated
          newOwner: newOwner,    // The new owner's data to update the cars      
        
        }),
      });
      console.log("multipleCar");
     
     
      //Conditional rendering to check if the response is successful
      if (!response.ok) {
        if (response.status === 404) //Respond with a 404 status error
        { 
          throw new Error('No cars found for update');//Throw an error message no cars are found 
        } 
        else {
          throw new Error('Failed to update car details');//Throw an error message if the PUT request is unsuccessful
        }
      }
    

      const updatedCars = await response.json();// If the response is successful, parse the JSON data returned by the server

      console.log('Cars updated successfully', updatedCars);//If the request is successful log a success message 
      // Update the multipleUpdate state to trigger re-render or update in the component
      setMultipleUpdate(!multipleUpdate);
    } 
    catch (error) {
      //Handle errors
      console.error('Error updating cars:', error.message);//Log an error message in the console for debugging purposes.
      setError('Error updating cars:', error.message);//Log errors during the update process
    }
  };

//-----------------DELETE REQUEST--------------------------
  //Function to remove a car
  const removeCar = async (carId) => {//Define an asynchronous function to remove a car from the list
    try {
      //Send delete request to server
      const response = await fetch(`http://localhost:3001/removeById/${carId}`, {
        method: 'DELETE',//Request method
        headers: {
          'Content-type': 'application/json',//Type of content being passed
        },
      });

      //Conditional rendering to check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to add car');//Throw an error message if the request is unsuccessful
      }
  
      
      setCars((prevCars) => // Update the 'cars' state 
      //prevCars represents the previous state of the cars variable
          prevCars.filter((car) => car._id !== carId));//Filter out the array of cars
      console.log('Car removed successfully');//If the request is successful log a success message
    }
    catch (error) {
      setError('Error removing car', error);//Log errors during the update process
      console.error('Error removing car:', error.message);//Display error message in the console for debugging purposes
    }
  };

 
  //===============EVENT LISTENERS================= 
  // Function to handle input changes in the form
  const handleInputChange = (event) => {
    const { name, value } = event.target;  // Extract the name and value from the event target (input element)
  
    setCarData((prevData) => ({  // Update the carData state with the new input value
      ...prevData,  // Update the carData state using the previous state (prevData)
      // Spread the previous state to keep existing values

      [name]: value,    // Update the value of the specified input field
    }));
  };

  //Function to update the owner value in the frontend
  const handleOwnerChange = (event) => {
    const {value} = event.target;
    setCarData((prevData) => ({// Update the carData state with the new input value
      ...prevData,// Update the carData state using the previous state (prevData)
      oldOwner: value,
    }));
  };

  // Function to update the owner in the frontend
  const updateOwner = (event) => {
    setNewOwner(event.target.value);
  };


  //Toggle function to update the car
  const updateCar = (carId) => {
    setUpdate(!update);    // Toggle the update state
    setCarToUpdate(carId);    // Set the carToUpdate state to the ID of the clicked car
  };


  //============JSX RENDERING=============

  return (
    <>
    {/* App Container */}
      <Container id='appContainer'>
        {/* Header */}
       <Header/>
        {/* Header */}
        <section id='section1'>
        {/* Render form component */}
          <Form
          carData={carData}
          handleInputChange={handleInputChange}
          addCar={addCar}
          />            
        </section>
        {/* section2 */}
          <section id='section2'>          
          {/* Display fetched cars */}
          {/* Row 5 */}
          <Row id='row5'>
            <Col id='section2Heading'>
              <h2 className='h2'>Fetched Cars:</h2>
            </Col>
          </Row>
          
          {/* Display output */}
            {isLoaded ? (
              <ul id='list'>                
                {/* Map through the fetched cars and display their details */}
                {cars.map((car) => (
                  <li 
                  key={car._id}
                  className='carsList'
                  >
                    {/* Row 6 */}
                    <Row id='row6'>
                      <Col className='carData'>
                        {/* car make */}
                        <label className='dataLabel'>MAKE:</label>
                        <p className='outputText'>{car.make} </p>
                        </Col>
                      <Col className='carData' >
                        {/* car model */}
                       <label className='dataLabel'>MODEL:</label>
                       <p className='outputText'>{car.model}</p>
                      </Col>
                      <Col>
                      </Col>
                    </Row>
                      {/* Row 7 */}
                      <Row id='row7'>
                      <Col className='carData'>
                        {/* Car registration */}
                        <label className='dataLabel'>REGISTRATION:</label>
                        <p className='outputText'>{car.registration}</p>
                      </Col>
                      <Col className='carData'>
                        {/* Car owner */}
                        <label className='dataLabel'>OWNER:</label>
                        <p className='outputText'>{car.owner}</p>
                      </Col>
                      <Col>
                      {/* Button to remove car from the list */}
                        <Button variant="primary" id='removeBtn'
                          onClick={() => {
                            removeCar(car._id);
                           }}
                        >
                          REMOVE CAR
                        </Button>
                      </Col>
                      </Row>
                    {/* Row 8 */}
                    <Row className='row8'>
                      <Col className='updateOpt' >
                        {/* Button to toggle update form */}
                        <Button 
                          variant='primary' 
                          onClick={() => updateCar(car._id)}//Set the click event handler to call updateCar with the car ID
                          id='toggleUpdate'
                          >
                            {/* If in update mode for the current car, show 'EXIT UPDATE', else show 'UPDATE CAR' */}
                          {update && carToUpdate === car._id ? 'EXIT UPDATE' : 'UPDATE CAR'} 
                         </Button>
                      </Col>
                    </Row>
                    <div className='update'>
                      {/* Display the update car form */}
                      {update && carToUpdate === car._id && (
                      <UpdateForm 
                      newMake={newMake}
                      setNewMake={setNewMake}
                      newModel={newModel}
                      setNewModel={setNewModel}
                      newRegistration={newRegistration}
                      setNewRegistration={setNewRegistration}
                      newOwner={newOwner}
                      setNewOwner={setNewOwner}
                      updateCarDetails={() => updateCarDetails(car._id)}
                      />
                      ) }
                    </div>                                 
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading...</p>
            )}
            {/* Display error if there's an issue with data fetching */}
            {error && <p>{error}</p>}
            </section>
            {/* section3 */}
            <section id='section3'>              
        <form onSubmit={(event) => { event.preventDefault(); (updateMultipleCars())}} id='updateMultipleForm'>
          <Row className='formRow'>
            <Col className='formCol'>
              <label><p className='labelText'>OLD OWNER:</p>
                <input
                  type='text'
                  className='formInput'
                  onChange={handleOwnerChange}
                  value={carData.oldOwner}
                  name='oldOwner' />
              </label>
            </Col>
            <Col className='formCol'>
                <label><p className='labelText'>NEW OWNER:</p>
                  <input
                    type='text'
                    className='formInput'
                    onChange={updateOwner}
                    value={newOwner}
                    name='newOwner' />
                </label>
            </Col>
            <Col className='formCol'>
              <Button variant='primary' type='submit' id='updateMany'>
                UPDATE MULTIPLE CARS
              </Button>
            </Col>
          </Row>
        </form>
        </section>
        {/* section4 */}
        <section id='section4'>
          <Row id='row14'>
            <Col>
              <h2 className='h2'>CARS OLDER THAN 5 YEARS</h2>
            </Col>
          </Row>
          {/* Row 15 */}
          <Row id='row15'>
            <Col></Col>
            <Col id='findCarsCol'>
            {/* Button to display cars older than 5 years */}
                <Button variant='primary' onClick={findCars} id='findBtn'>DISPLAY</Button>
            </Col>
            <Col></Col>
          </Row>
       <ul>
            {/* Map through cars older than 5 years and display the details */}
            {foundCars.map((foundCar) => (
              <li 
              className='carsList'
              key={foundCar._id}>
              {/*Row 16  */}
                <Row id='row13'>
                  <Col className='carData'>
                    {/* car make */}
                    <label className='dataLabel'>MAKE:</label><p className='outputText'>{foundCar.make} </p>
                  </Col>
                  <Col className='carData'>
                    {/* car model */}
                    <label className='dataLabel'>MODEL:</label><p className='outputText'>{foundCar.model}</p>
                  </Col>
                  <Col>
                  </Col>
                </Row>
                {/* Row17 */}
                <Row className='row14'>
                  <Col className='carData'>
                    {/* Car registration */}
                    <label className='dataLabel'>REGISTRATION:</label><p className='outputText'>{foundCar.registration}</p>
                  </Col>
                  <Col className='carData'>
                    {/* Car owner */}
                    <label className='dataLabel'>OWNER:</label><p className='outputText'>{foundCar.owner}</p>
                  </Col>
                  <Col></Col>
                </Row>           
              </li>
            ))}
            </ul>
        </section>
      </Container>
    </>
  );
}
