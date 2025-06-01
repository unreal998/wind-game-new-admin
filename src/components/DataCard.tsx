'use client';

import React, { useState, useEffect } from 'react';
import { RiBarChartFill, RiErrorWarningFill } from '@remixicon/react';
// import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
// import Link from 'next/link';
import { Skeleton } from '@/components/Skeleton';

interface DataCardProps {
  title?: string;
  description?: string;
  className?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  error?: string | null;
  children?: React.ReactNode;
}

export function DataCard({
  title,
  description,
  className,
  isLoading = false,
  isEmpty = false,
  error = null,
  children
}: DataCardProps) {
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setInternalLoading(false);
    }
  }, [isLoading]);

  return (
    // <Card className={`custom-lg:h-fit ${className}`}>
    <Card className={`h-full w-full flex flex-col ${className}`}>
      {title && (
        <h3 className="font-medium text-gray-900 dark:text-gray-50">
          {title}
        </h3>
      )}
      {description && (
        <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
          {description}
        </p>
      )}
      {internalLoading || isLoading ? (
        <div className="mt-4 flex flex-grow h-32 items-center justify-center rounded-md border-gray-300 dark:border-gray-800">
          <Skeleton className="w-full h-full" />
        </div>
      ) : error ? (
        <div className="mt-4 flex flex-grow h-32 items-center justify-center rounded-md border border-dashed border-red-300 p-4 dark:border-red-800">
          <div className="text-center">
            <RiErrorWarningFill
              className="mx-auto size-7 text-red-400 dark:text-red-600"
              aria-hidden={true}
            />
            <p className="mt-2 text-sm font-medium text-red-900 dark:text-red-50">
              Помилка
            </p>
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          </div>
        </div>
      ) : isEmpty ? (
        <div className="mt-4 flex flex-grow h-32 items-center justify-center rounded-md border border-dashed border-gray-300 p-4 dark:border-gray-800">
          <div className="text-center">
            <RiBarChartFill
              className="mx-auto size-7 text-gray-400 dark:text-gray-600"
              aria-hidden={true}
            />
            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-50">
              Дані відсутні
            </p>
            {/* <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
              {t('common.start_with_familiarization')}
            </p>
            <Link href="/onboarding" passHref>
              <Button className="mt-6" variant="light">
                {t('common.familiarize')}
              </Button>
            </Link> */}
          </div>
        </div>
      ) : (
        children
      )}
    </Card>
  );
}
