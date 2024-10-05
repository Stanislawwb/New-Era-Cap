import Steps from "../components/Steps";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PaymentForm from "../components/PaymentForm";
import { useEffect, useState } from "react";
import { getSession } from "../http/sessionService";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessionExists, setSessionExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessionData = async () => {
      const sessionId = sessionStorage.getItem('sessionId');
      
      if(!sessionId) {
        navigate('/');

        return;
      }

      try {
        const sessionData = await getSession();

        if (!sessionData) {
          navigate('/');

          return;
        }

        setSessionExists(true);
      } catch (error) {
        console.error("Failed to load session data", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    loadSessionData();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!sessionExists) {
    return null;
  }

  return (
    <div className="main">
      <div className="shell">
        <Steps />

        <div className="section-form">
          <PaymentForm />

          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
