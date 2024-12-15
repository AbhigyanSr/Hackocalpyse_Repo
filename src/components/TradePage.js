import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

function TradePage() {
  const [resource, setResource] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [unitsOffered, setUnitsOffered] = useState('');
  const { resourceId } = useParams(); // Get the resourceId from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const resourceRef = doc(firestore, 'tradeableResources', resourceId);
        const resourceDoc = await getDoc(resourceRef);
        if (resourceDoc.exists()) {
          setResource(resourceDoc.data());
        } else {
          setErrorMessage('Resource not found.');
        }
      } catch (error) {
        setErrorMessage('Error fetching resource.');
        console.error('Error fetching resource:', error);
      }
    };

    fetchResource();
  }, [resourceId]);

  const handleTradeSubmission = async () => {
    if (!unitsOffered) {
      setErrorMessage('Please specify the units you are offering.');
      return;
    }

    try {
      // Add trade logic here
      // For simplicity, we update the resource status to "Pending"
      await updateDoc(doc(firestore, 'tradeableResources', resourceId), {
        status: 'Pending', // Update resource status to 'Pending'
      });

      // Redirect to the available resources page after the trade
      navigate('/available-resources');
    } catch (error) {
      setErrorMessage('Failed to submit trade request.');
      console.error('Error submitting trade request:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Trade Resource</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {resource ? (
        <div>
          <h3>{resource.name}</h3>
          <p><strong>Description:</strong> {resource.description}</p>
          <p><strong>Units:</strong> {resource.units}</p>

          <div style={{ marginBottom: '20px' }}>
            <label>
              Units Offered:
              <input
                type="number"
                value={unitsOffered}
                onChange={(e) => setUnitsOffered(e.target.value)}
                placeholder="Enter units you are offering"
                style={{ marginLeft: '10px' }}
              />
            </label>
          </div>

          <button onClick={handleTradeSubmission} style={{ padding: '10px 20px' }}>
            Submit Trade Request
          </button>
        </div>
      ) : (
        <p>Loading resource...</p>
      )}
    </div>
  );
}

export default TradePage;
