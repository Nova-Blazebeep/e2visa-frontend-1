"use client";

import React, { useEffect, useState } from 'react';
import ProfessionalDetail from '../../components/professional/ProfessionalDetail';
import { useParams } from 'next/navigation';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ProfessionalPage() {
  const params = useParams();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    setError(null);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals/professional-detail?professional_id=${params.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setProfessional(data.result);
        } else {
          setError(data.message || 'Professional not found.');
        }
      })
      .catch(() => setError('Failed to fetch professional.'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return <ProfessionalDetail professional={professional} />;
} 