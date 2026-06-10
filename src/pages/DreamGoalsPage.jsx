import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DreamGoals from '../components/ui/DreamGoals.jsx';

export default function DreamGoalsPage() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" style={{ marginBottom: 16 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>Dream Goals</h1>
        <p className="text-secondary mt-2" style={{ lineHeight: 1.55, fontSize: '0.95rem' }}>
          Setting specific intentions for what you'll do in a lucid dream dramatically increases how often they happen.
        </p>
      </div>
      <DreamGoals />
    </div>
  );
}
