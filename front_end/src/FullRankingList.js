// FullRankingList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FullRankingList() {
  const navigate = useNavigate();
  const [rankedCars, setRankedCars] = useState([]);

  useEffect(() => {
    fetchRankedCars();
  }, []);

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

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="full-ranking-list">
      <h2>Full Ranking List</h2>
      <div className="car-rank-list">
        {rankedCars.map((car, index) => (
          <div key={car[0]} className="car-rank-item">
            <span className="rank">{index + 1}</span>
            <span className="car-name">{car[1]}</span>
            <span className="total-sales">{car[2]}</span>
          </div>
        ))}
      </div>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}

export default FullRankingList;