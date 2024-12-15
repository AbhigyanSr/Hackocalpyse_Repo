import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function AvailableResources() {
  const [resources, setResources] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, 'tradeableResources'), where('status', '==', 'Pending')),
      (snapshot) => {
        const resourcesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResources(resourcesList);
      },
      (error) => {
        setErrorMessage('Error loading resources.');
        console.error('Error fetching resources:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleTradeRequest = (resourceId) => {
    // Redirect to TradePage with resourceId to initiate trade
    navigate(`/trade/${resourceId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Resources</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Description</th>
            <th>Units</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Trade</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id}>
              <td>{resource.type}</td>
              <td>{resource.name}</td>
              <td>{resource.description}</td>
              <td>{resource.units}</td>
              <td>{resource.status}</td>
              <td>{resource.username}</td>
              <td>
                {/* Trade button to redirect to TradePage */}
                <button onClick={() => handleTradeRequest(resource.id)}>
                  Request Trade
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AvailableResources;
