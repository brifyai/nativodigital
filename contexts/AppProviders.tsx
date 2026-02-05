import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { UIProvider } from './UIContext';
import { ChatProvider } from './ChatContext';
import { SavedContentProvider } from './SavedContentContext';
import { PreviewProvider } from './PreviewContext';
import { useAuth } from './AuthContext';

// Wrapper component to access auth context for ChatProvider
const ChatProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { customInstruction } = useAuth();
  
  return (
    <ChatProvider customInstruction={customInstruction}>
      {children}
    </ChatProvider>
  );
};

// Combined providers
export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <UIProvider>
      <AuthProvider>
        <SavedContentProvider>
          <PreviewProvider>
            <ChatProviderWrapper>
              {children}
            </ChatProviderWrapper>
          </PreviewProvider>
        </SavedContentProvider>
      </AuthProvider>
    </UIProvider>
  );
};
