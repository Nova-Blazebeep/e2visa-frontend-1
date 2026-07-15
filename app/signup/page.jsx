'use client';
import { Suspense } from 'react';
import SignUp from '../components/auth/SignUp';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function SignUpPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignUp />
    </Suspense>
  );
} 