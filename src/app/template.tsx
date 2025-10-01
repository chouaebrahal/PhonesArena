
// app/template.tsx
'use client';

import PageTransition from '@/components/utils/PageTransition';
import { motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/common/ErrorFallback';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition>
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        {children}
      </ErrorBoundary>
    </PageTransition>
  );
}