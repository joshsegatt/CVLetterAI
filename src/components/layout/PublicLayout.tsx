import { Header } from "../marketing/Header";

interface PublicLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function PublicLayout({ children, title, description }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            {description && (
              <p className="text-lg text-gray-600">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}