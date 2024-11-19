import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="shell" style={{
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',       }}>
        <h1>404 - Page Not Found</h1>
        
        <p>Sorry, the page you are looking for does not exist.</p>

        <button 
            onClick={() => navigate('/')} 
            style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#000',
                color: '#fff',
            }}            
        >
            Back to Homepage
        </button>
    </div>
  );
};

export default NotFoundPage;
