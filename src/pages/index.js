import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const URL_LOCAL = 'http://localhost:4000';
const URL_SERVER = 'https://shafee-backend-deploy.vercel.app/'

const socket = io(URL_LOCAL, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5
});

export default function Home() {
  const [tradeDetails, setTradeDetails] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setStatus('Connected to Backend...');
    });

    socket.on('tradeDetails', (data) => {
      setLoading(false);
      setTradeDetails(data);
    });

    socket.on('disconnect', () => {
      setStatus('Disconnected from Backend... Trying to reconnect...');
    });

    socket.on('reconnect_attempt', () => {
      setStatus('Reconnecting...');
    });

    socket.on('reconnect', () => {
      setStatus('Reconnected to Backend...');
    });

    socket.on('reconnect_failed', () => {
      setStatus('Failed to reconnect. Please check your connection.');
    });

    return () => socket.disconnect();
  }, []);

  const handleTrade = () => {
    setStatus('Get Master Trade...');
    setLoading(true);
    socket.emit('trade');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Trade</h1>
      <button 
        onClick={handleTrade} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Trade'}
      </button>
      <p className="mt-4 text-lg">{status}</p>
      {loading && (
        <div className="mt-4">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
        </div>
      )}
      {tradeDetails && (
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Trade Details</h2>
          <pre className="bg-gray-200 p-2 rounded">{JSON.stringify(tradeDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
