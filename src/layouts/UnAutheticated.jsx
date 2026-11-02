import React from 'react'
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoadingComponent from '../components/LoadingComponent';

export default function UnAuthenticated({ element }) {
  const auth = useSelector(s => s.auth);
  const loading = auth?.loadings?.authenticateAsyncThunk;
  if (loading) return <LoadingComponent />
  if (auth?.user) return <Navigate to="/dashboard" />
  return element
}