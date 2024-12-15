import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';

function ResourceTrading({ user }) {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    name: '',
    quantity: 0,
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch resources in real-time from Firestore
  useEffect(() => {
    const resourcesQuery = query(collection(firestore, 'resources'));

    const unsubscribe = onSnapshot(
      resourcesQuery,
      (snapshot) => {
        const resourceList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResources(resourceList);  // Update state with fetched resources
        setLoading(false);  // Stop loading spinner
      },
      (error) => {
        console.error('Error fetching resources:', error);  // Log errors
        setLoading(false);  // Stop loading on error
        alert('Error loading resources');
      }
    );

    return () => unsubscribe();  // Cleanup listener on unmount
  }, []);

  // Add a new resource to Firestore
  const addResource = async (e) => {
    e.preventDefault();

    if (newResource.quantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }

    try {
      const docRef = await addDoc(collection(firestore, 'resources'), {
        ...newResource,
        traderEmail: user.email,
        status: 'pending',
        timestamp: new Date(),
      });

      // Optimistically update state with the new resource
      setResources((prevResources) => [
        ...prevResources,
        {
          id: docRef.id,
          ...newResource,
          traderEmail: user.email,
          status: 'pending',
          timestamp: new Date(),
        }
      ]);

      // Clear the form
      setNewResource({ name: '', quantity: 0, description: '' });
    } catch (error) {
      console.error('Error adding resource:', error);
      alert('Error adding resource');
    }
  };

  return (
    <div>
      <h2>Resource Trading</h2>
      
      {/* Form to add a new resource */}
      <form onSubmit={addResource}>
        <input
          type="text"
          value={newResource.name}
          onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
          placeholder="Resource Name"
          required
        />
        <input
          type="number"
          value={newResource.quantity}
          onChange={(e) => setNewResource({ ...newResource, quantity: parseInt(e.target.value) })}
          placeholder="Quantity"
          required
        />
        <textarea
          value={newResource.description}
          onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
          placeholder="Description"
          required
        />
        <button
          type="submit"
          disabled={!newResource.name || !newResource.description || newResource.quantity <= 0}
        >
          List Resource
        </button>
      </form>

      {/* Display resources or loading state */}
      {loading ? (
        <p>Loading resources...</p>
      ) : resources.length === 0 ? (
        <p>No resources available</p>
      ) : (
        <div>
          <h3>Available Resources</h3>
          {resources.map((resource) => (
            <div key={resource.id} style={{ marginBottom: '20px' }}>
              <h4>{resource.name}</h4>
              <p>Quantity: {resource.quantity}</p>
              <p>{resource.description}</p>
              <p>Trader: {resource.traderEmail}</p>

              {resource.status === 'pending' && (
                <button onClick={() => navigate(`/trade/${resource.id}`)}>
                  Request Trade
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResourceTrading;
