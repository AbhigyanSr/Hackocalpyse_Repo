import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase'; // Firebase configuration file
import { useNavigate } from 'react-router-dom';

function TradingResource() {
  const [resourceType, setResourceType] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [units, setUnits] = useState(''); // Units of the resource
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // Resource types available
  const resourceTypes = [
    'Food Supplies',
    'Purified Water',
    'Ammunition',
    'Medical Supplies',
    'Repair Components',
    'Survival Gear',
  ];

  // Add resource to Firestore
  const handleListResource = async () => {
    if (!resourceType || !name || !description || !units) {
      setErrorMessage('All fields are required!');
      return;
    }
    try {
      await addDoc(collection(firestore, 'tradeableResources'), {
        type: resourceType,
        name: name,
        description: description,
        units: units,
        status: 'Pending', // Default trade status
        timestamp: serverTimestamp(),
      });
      setSuccessMessage('Resource listed successfully!');
      setErrorMessage('');
      setResourceType('');
      setName('');
      setDescription('');
      setUnits('');
    } catch (error) {
      console.error('Error adding resource:', error);
      setErrorMessage('Failed to list resource. Check Firestore configuration and rules.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tradeable Resources</h2>
      <p>Add a resource to the list for trading.</p>

      {/* Resource Type Dropdown */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Resource Type:
          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            style={{ marginLeft: '10px' }}
          >
            <option value="">Select Resource Type</option>
            {resourceTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Resource Name Input */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Resource Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter resource name"
            style={{ marginLeft: '10px', width: '200px' }}
          />
        </label>
      </div>

      {/* Resource Description Input */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Resource Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter resource description"
            style={{ marginLeft: '10px', width: '300px', height: '80px' }}
          />
        </label>
      </div>

      {/* Units Input */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Units:
          <input
            type="text"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            placeholder="Enter units (e.g., 10 kg)"
            style={{ marginLeft: '10px', width: '200px' }}
          />
        </label>
      </div>

      {/* Submit Button */}
      <button onClick={handleListResource} style={{ padding: '10px 20px' }}>
        List Resource
      </button>

      {/* Success and Error Messages */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* View Available Resources Button */}
      <button onClick={() => navigate('/available-resources')} style={{ marginTop: '20px' }}>
        View Available Resources
      </button>
    </div>
  );
}

export default TradingResource;
