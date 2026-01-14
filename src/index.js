import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-northeast-1_MHsDVtMgg', // e.g., us-east-1_xxxxxx
      userPoolClientId: '7u6m2nvptbc67ucv9rbpctu3d9',
    }
  }

});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
