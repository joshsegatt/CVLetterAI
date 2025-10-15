import React from 'react';

type BuilderLayoutProps = {
  children?: React.ReactNode;
};

export default function BuilderLayout({ children }: BuilderLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 border-b bg-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-lg font-semibold">Builder</h1>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
}
