'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignupForm } from './signup-form';
import { LoginForm } from './login-form';

interface AuthFormsProps {
  onSuccess: () => void;
}

export function AuthForms({ onSuccess }: AuthFormsProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-6">
          <LoginForm onSuccess={onSuccess} />
        </TabsContent>

        <TabsContent value="signup" className="mt-6">
          <SignupForm onSuccess={onSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
}