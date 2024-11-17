// displays error messages in mcq components

import React from 'react';
import * as Icons from '@/components/ui/Icons';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div role="alert" className="alert alert-error mb-4">
    <Icons.CircleX />
    <span>{message}</span>
  </div>
);

export default ErrorMessage;
