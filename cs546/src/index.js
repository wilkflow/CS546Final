import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createClient } from '@supabase/supabase-js'
import { createContext, useContext } from 'react';
const SUPABASE_URL="https://nmdzadwskxkmnmnvvxlu.supabase.co"
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHphZHdza3hrbW5tbnZ2eGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNDg5NTksImV4cCI6MjA2MTgyNDk1OX0.tMvrJoPE0q4eKZoUMTnJgsqBcByEL8V_vpbBuFemVQs"

// Create a single supabase client for interacting with your database     --AS SEEN IN SUPABASE DOC USING OUR KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const sp = createContext(supabase);
console.log(supabase)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
