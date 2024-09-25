'use client';
import withRole from '@/hoc/roleGuard';
import axios from 'axios';
import { useRouter } from 'next/router'; // Use Next.js router
import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import React from 'react';

type Props = {
  params: { id: number; userId: number };
};
type Transaction = {
  id: number;
  userId: string;
  eventId: string;
  qty: string;
  total: string;
  status: string;
  transactionDate: string;
};
const Balance: React.FC = () => {
  const [error, setError] = useState('');
  const [data, setData] = useState({
    address: '',
    image: '',
    dateOfBirth: '',
    firstName: '',
    lastName: '',
    gender: '',
    user: { balance: '', points: '', email: '', identificationId: '' },
    location: { locationName: '' },
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<Transaction[]>([]); // Ensure array type for transactions
  const [balance, setBalance] = useState(true);
  const [balanceValue, setBalanceValue] = useState('');
  // const router = useRouter();

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:8000/api/user/profile',
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setData(response.data.result[0]);
    } catch (error) {
      setError('Failed to fetch profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchTransactions = async () => {
    const token = localStorage.getItem ('token') ;
    try {
      const response = await axios.get(
        `http://localhost:8000/api/transaction/transaction/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTransaction(response.data.data);
    } catch (error) {
      setError('Failed to fetch transactions');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const updateBalance = async () => {
    const token = localStorage.getItem('token');
    if (!balanceValue) {
      setError('Please enter a valid balance');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/balance-point/user/`,
        { balance: parseFloat(balanceValue) }, // Parse balance value to float
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchUser(); // Refresh profile data after updating balance
    } catch (error) {
      setError('Failed to update balance');
      console.error(error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBalanceValue(e.target.value);
  };

  return (
    <div className="h-full pt-20 px-32">
      {loading && <p>Loading...</p>}
      <div className="h-72">
        {data ? (
          <div className="h-72">
            <h3>Profile Information</h3>
            <h1>
              Name: {data.firstName} {data.lastName}
            </h1>
            <p>Gender: {data.gender}</p>
            <p>Address: {data.address}</p>
            <p>Phone: {data.phoneNumber}</p>
            <p>
              Date of Birth: {new Date(data.dateOfBirth).toLocaleDateString()}
            </p>
            <p>Balance: {data.user.balance}</p>
            <p>Point: {data.user.points}</p>
            <p>Identification: {data.user.identificationId}</p>
            <p>Email: {data.user.email}</p>
            <p>Location : {data.location.locationName || 'data error'}</p>
          </div>
        ) : (
          <p>No profile data available.</p>
        )}
      </div>
      <div>
        <h3>Add balance</h3>
        {balance && (
          <div>
            <input
              type="number"
              name="Balance"
              placeholder="Add your balance"
              value={balanceValue}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button onClick={updateBalance} disabled={loading}>
              {loading ? 'Adding...' : 'Add Balance'}
            </button>
          </div>
        )}
      </div>
      <div>
        <h3>Transactions</h3>
        <div>
          {Array.isArray(transaction) && transaction.length > 0 ? (
            transaction.map((tx) => (
              <div key={tx.id}>
                <p>Transaction ID: {tx.id}</p>
                <p>User ID: {tx.userId}</p>
                <p>Event ID: {tx.eventId}</p>
                <p>Quantity: {tx.qty}</p>
                <p>Total: {tx.total}</p>
                <p>Status: {tx.status}</p>
                <p>Status: {tx.transactionDate}</p>
              </div>
            ))
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default withRole(Balance, 'USER'); // Use role guard for component access
