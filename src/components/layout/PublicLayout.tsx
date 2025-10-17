import { Header } from "../marketing/Header";

interface PublicLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function PublicLayout({ children, title, description }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
            {description && (
              <p className="text-lg text-neutral-300">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}