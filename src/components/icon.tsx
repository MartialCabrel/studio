'use client';

import * as React from 'react';
import { icons, type LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon {...props} />;
};
