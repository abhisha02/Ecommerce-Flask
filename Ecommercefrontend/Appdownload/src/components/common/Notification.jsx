import React from 'react';

export const Notification = ({ notification }) => {
  if (!notification) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
        notification.isError ? 'bg-red-500' : 'bg-green-500'
      } text-white`}
    >
      {notification.message}
    </div>
  );
};