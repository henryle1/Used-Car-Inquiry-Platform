// CarSearch.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

function CarSearch({ user }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [profile, setProfile] = useState(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({ username: '', gender: '', state: '', password: '' });
  const [states, setStates] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [rankedCars, setRankedCars] = useState([]);
  const [carPrice, setCarPrice] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);

  const [popularCarsByState, setPopularCarsByState] = useState([]);
  const [selectedStateForPopularCars, setSelectedStateForPopularCars] = useState('');



  useEffect(() => {
    if (user && user.isLoggedIn) {
      fetchProfile();
      fetchStates();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setEditProfile({
        username: profile.username,
        gender: profile.gender,
        state: profile.state,
        password: ''
      });
    }
  }, [profile]);

  useEffect(() => {
    fetchRankedCars();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/profile?username=${encodeURIComponent(user.username)}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/states');
      if (response.ok) {
        const data = await response.json();
        setStates(data);
      } else {
        console.error('Failed to fetch states');
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleMyListClick = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-favorites?username=${encodeURIComponent(user.username)}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
        setShowFavorites(true);
      } else {
        console.error('Failed to fetch favorites');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const removeFromFavorites = async (carID) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/delete-favorite', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${user.token}`,
        },
        body: `username=${encodeURIComponent(user.username)}&car_id=${encodeURIComponent(carID)}`,
      });
  
      if (response.ok) {
        console.log('Car removed from favorites');
        setFavorites(favorites.filter(car => car.CarID !== carID));
      } else {
        console.error('Failed to remove car from favorites');
      }
    } catch (error) {
      console.error('Error removing car from favorites:', error);
    }
  };

  const handleSearchClick = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/search-cars?name=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results.map(car => ({
          carid: car[0],
          carname: car[1],
          year: car[2],
          sellingprice: car[3],
          fuel: car[4],
          transmission: car[5]
        })));
      } else {
        console.error('Failed to search cars');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching cars:', error);
      setSearchResults([]);
    }
  };

  const handleProfileModalToggle = () => {
    setProfileModalOpen(!isProfileModalOpen);
    setEditMode(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleProfileChange = (e) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const submitEditProfile = async () => {
    try {
      const selectedState = states.find(state => state.State === editProfile.state);
      const stateID = selectedState ? selectedState.StateID : null;

      if (!stateID) {
        setErrorMessage('Please select a valid state');
        return;
      }

      const response = await fetch('http://127.0.0.1:5000/edit-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ ...editProfile, stateID, current_username: user.username }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        setEditMode(false);
        setSuccessMessage('Profile updated successfully');
        fetchProfile();

        setTimeout(() => {
          setSuccessMessage('');
          setProfileModalOpen(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('An error occurred while updating profile');
    }
  };

  const addToFavorite = async (car) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/add-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${user.token}`,
        },
        body: `username=${encodeURIComponent(user.username)}&car_id=${encodeURIComponent(car.carid)}`,
      });
  
      if (response.ok) {
        console.log('Car added to favorites');
      } else {
        console.error('Failed to add car to favorites');
      }
    } catch (error) {
      console.error('Error adding car to favorites:', error);
    }
  };

  const fetchRankedCars = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/ranked_cars');
      if (response.ok) {
        const data = await response.json();
        setRankedCars(data.ranked_cars);
      } else {
        console.error('Failed to fetch ranked cars');
      }
    } catch (error) {
      console.error('Error fetching ranked cars:', error);
    }
  };

  const handleViewMoreClick = () => {
    navigate('/full-ranking');
  };

  const calculateTotalPrice = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/calculate-tax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `state_id=${encodeURIComponent(selectedState)}&price=${encodeURIComponent(carPrice)}`,
      });
  
      if (response.ok) {
        const result = await response.json();
        setCalculationResult(result);
      } else {
        console.error('Failed to calculate total price');
        setCalculationResult(null);
      }
    } catch (error) {
      console.error('Error calculating total price:', error);
      setCalculationResult(null);
    }
  };

  // -------------------------------------------------------------------------------

  const fetchPopularCarsByState = async () => {
    try {
      const userPassword = user.password;
      const response = await fetch(`http://127.0.0.1:5000/popular-cars-by-state?username=${encodeURIComponent(user.username)}&password=${encodeURIComponent(userPassword)}`);

      if (response.ok) {
        const data = await response.json();
        setPopularCarsByState(data);
      } else if (response.status === 401) {
        console.error('Invalid username or password');
      } else {
        console.error('Failed to fetch popular cars by state');
      }
    } catch (error) {
      console.error('Error fetching popular cars by state:', error);
    }
  };

  const closePopularCarsByState = () => {
    setPopularCarsByState([]);
  };
  //-------------------------------------------------------------------------------

  return (
    <div className="car-search">
      <div className="login-button">
        {user && user.isLoggedIn ? (
          <div>
            <p>Welcome, {user.username}!</p>
            <button onClick={handleProfileModalToggle}>{isProfileModalOpen ? 'Close Profile' : 'View Profile'}</button>
          </div>
        ) : (
          <button onClick={handleLoginClick}>Log in & Register</button>
        )}
      </div>
      <div className="search-container">
        <h2>Find your favorite cars</h2>
        <input
          type="text"
          placeholder="Search for cars by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearchClick}>Search</button>
      </div>
      <div className="my-list">
        <h3>My List</h3>
        <button onClick={handleMyListClick}>Go to My List</button>
      </div>
      <div className="sample-cars">
        <h3>Search Results</h3>
        <div className="car-grid">
          {searchResults.map(car => (
            <div key={car.carid} className="car-card">
              <h4>{car.carname}</h4>
              <p>Year: {car.year}</p>
              <p>Selling Price: {car.sellingprice}</p>
              <p>Fuel: {car.fuel}</p>
              <p>Transmission: {car.transmission}</p>
              <button onClick={() => addToFavorite(car)}>Add to Favorite</button>
            </div>
          ))}
        </div>
      </div>

      <div className="ranked-cars">
        <h3>Top 10 Best Selling Cars</h3>
        <div className="car-rank-list">
          {rankedCars.slice(0, 10).map((car, index) => (
            <div key={car[0]} className="car-rank-item">
              <span className="rank">{index + 1}</span>
              <span className="car-name">{car[1]}</span>
              <span className="total-sales">{car[2]}</span>
            </div>
          ))}
        </div>
        <button onClick={handleViewMoreClick}>View More</button>
      </div>



      <div className="popular-cars-by-state">
        <div className="header">
          <h3>Popular Cars by State</h3>
          <div className="buttons">
            <button onClick={fetchPopularCarsByState}>Search</button>
            <button onClick={closePopularCarsByState}>Close</button>
          </div>
        </div>
        <div className="popular-cars-list">
          {popularCarsByState.map(car => (
            <div key={car.carName} className="popular-car-item">
              <span className="car-name">{car.carName}</span>
              <span className="popularity-score">Popularity Score: {car.popularityScore}</span>
            </div>
          ))}
        </div>
      </div>



      <div className="price-calculator">
        <h3>Price Calculator</h3>
        <input
          type="number"
          placeholder="Enter car price"
          value={carPrice}
          onChange={(e) => setCarPrice(e.target.value)}
        />
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">Select a state</option>
          {states.map(state => (
            <option key={state.StateID} value={state.StateID}>
              {state.State}
            </option>
          ))}
        </select>
        <button onClick={calculateTotalPrice}>Calculate</button>
        {calculationResult && (
          <div>
            <p>Tax: {calculationResult.tax}</p>
            <p>Total Price: {calculationResult.total_price}</p>
          </div>
        )}
      </div>

      {showFavorites && (
        <div className="favorite-cars">
          <div className="favorite-cars-header">
            <h3>My Favorite Cars</h3>
            <button onClick={() => setShowFavorites(false)}>Close</button>
          </div>
          <div className="car-grid">
            {favorites.map(car => (
              <div key={car.CarID} className="car-card">
                <h4>{car.CarName}</h4>
                <p>Year: {car.Year}</p>
                <p>Selling Price: ${car.SellingPrice}</p>
                <p>Fuel: {car.Fuel}</p>
                <p>Transmission: {car.Transmission}</p>
                <button onClick={() => removeFromFavorites(car.CarID)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isProfileModalOpen && (
        <Modal onClose={handleProfileModalToggle}>
          <div>
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="error-message">{errorMessage}</p>
            )}
            <h2>Profile Information</h2>
            <form onSubmit={(e) => { e.preventDefault(); submitEditProfile(); }}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={editProfile.username}
                onChange={handleProfileChange}
                placeholder="Username"
                disabled={!editMode}
              />
              <label htmlFor="gender">Gender</label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={editProfile.gender}
                onChange={handleProfileChange}
                placeholder="Gender"
                disabled={!editMode}
              />
              <label htmlFor="state">State</label>
              <select
                id="state"
                name="state"
                value={editProfile.state}
                onChange={handleProfileChange}
                disabled={!editMode}
              >
                <option value="">Select a state</option>
                {states.map(state => (
                  <option key={state.StateID} value={state.State}>
                    {state.State}
                  </option>
                ))}
              </select>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={editProfile.password}
                onChange={handleProfileChange}
                placeholder="Password"
                disabled={!editMode}
              />
              {!editMode && !successMessage && (
                <button type="button" onClick={handleEditClick}>Edit</button>
              )}
              {editMode && (
                <button type="submit">Save Changes</button>
              )}
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CarSearch;




