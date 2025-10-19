'use client';

import { useRouter } from 'next/navigation';
import { getActionMessage } from '@/lib/auth/publicAccess';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'download' | 'save' | 'upgrade';
}

export function AuthRequiredModal({ isOpen, onClose, action }: AuthRequiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const message = getActionMessage(action);

  const handleSignUp = () => {
    router.push('/sign-up?action=' + action);
  };

  const handleSignIn = () => {
    router.push('/sign-in?action=' + action);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {message.title}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {message.description}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleSignUp}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {message.cta}
            </button>
            
            <button
              onClick={handleSignIn}
              className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Already have an account? Sign In
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
            >
              Continue without account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}