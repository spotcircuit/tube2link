'use client';

import React from 'react';

interface Props {
  value: any;
  name: string;
}

export function DebugRender({ value, name }: Props) {
  React.useEffect(() => {
    console.log(`Rendering ${name}:`, value);
    if (value && typeof value === 'object') {
      console.warn(`Warning: ${name} is an object:`, value);
    }
  }, [value, name]);

  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'object') {
    return <span className="text-red-500">[Object cannot be rendered directly]</span>;
  }

  return <>{value}</>;
}
