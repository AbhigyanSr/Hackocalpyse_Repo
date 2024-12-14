import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';

function TradeRequests({ user }) {
  const [resource, setResource] = useState(null);
  const [tradeDetails, setTradeDetails] = useState({
    offeredResourceId: '',
    quantity: 0
  });
  const [loading, setLoading] = useState(true);
  const { resourceId } = useParams();  // Get the resource ID from the URL
  const navigate = useNavigate();

  // Fetch the resource details based on the resourceId
  useEffect(() => {
    const getResource = async () => {
      const resourceDoc = await getDoc(doc(firestore, 'resources', resourceId));
      if (resourceDoc.exists()) {
        setResource(resourceDoc.data());
        setLoading(false);
      } else {
        console.error("Resource not found!");
      }
    };

    getResource();
  }, [resourceId]);

  const handleTradeRequest = async () => {
    if (tradeDetails.quantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }

    try {
      // Create a new trade request
      const tradeRequest = {
        resourceId,
        senderEmail: user.email,
        receiverEmail: resource.traderEmail,
        status: 'pending',
        tradeDetails: {
          offeredResourceId: tradeDetails.offeredResourceId,
          quantity: tradeDetails.quantity,
        },
        timestamp: new Date(),
      };

      await addDoc(collection(firestore, 'trades'), tradeRequest);

      // Update the status of the resource to reflect it has been requested
      await updateDoc(doc(firestore, 'resources', resourceId), {
        status: 'requested'
      });

      navigate('/'); // Redirect to home or resources list
    } catch (error) {
      console.error('Error creating trade request:', error);
    }
  };

  const handleCancelRequest = () => {
    navigate('/'); // Cancel trade request and redirect back
  };

  return (
    <div>
      {loading ? (
        <p>Loading resource...</p>
      ) : resource ? (
        <div>
          <h2>Request Trade for {resource.name}</h2>
          <p>{resource.description}</p>
          <p>Quantity: {resource.quantity}</p>
          <p>Trader: {resource.traderEmail}</p>

          <h3>Offer Your Resource</h3>
          <input 
            type="number"
            value={tradeDetails.quantity}
            onChange={(e) => setTradeDetails({
              ...tradeDetails,
              quantity: parseInt(e.target.value)
            })}
            placeholder="Quantity to offer"
            required
          />
          <input
            value={tradeDetails.offeredResourceId}
            onChange={(e) => setTradeDetails({
              ...tradeDetails,
              offeredResourceId: e.target.value
            })}
            placeholder="Offer resource ID"
            required
          />
          <button onClick={handleTradeRequest}>Send Trade Request</button>
          <button onClick={handleCancelRequest}>Cancel</button>
        </div>
      ) : (
        <p>Resource not found</p>
      )}
    </div>
  );
}

export default TradeRequests;
