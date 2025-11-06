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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left side - Hero section */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                TaskMaster
              </h1>
              <p className="text-xl text-muted-foreground lg:text-2xl">
                Organize your tasks, boost your productivity
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="h-px bg-muted-foreground/20 flex-1" />
                <span>Key Features</span>
                <div className="h-px bg-muted-foreground/20 flex-1" />
              </div>
              <ul className="space-y-2 text-sm lg:text-base">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Simple and intuitive task management</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Visual status tracking with colors</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Secure and private data storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Works on all your devices</span>
                </li>
              </ul>
            </div>

            <div className="hidden lg:block">
              <div className="bg-muted/20 rounded-2xl p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-24 bg-muted rounded"></div>
                  <div className="h-3 w-16 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted rounded"></div>
                  <div className="h-3 w-3/4 bg-muted rounded"></div>
                  <div className="h-3 w-1/2 bg-primary/20 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted rounded"></div>
                  <div className="h-3 w-2/3 bg-primary/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth forms */}
          <div className="flex-1 max-w-md">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login" className="text-base">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-base">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="transition-all duration-300">
                <LoginForm onSuccess={onSuccess} />
              </TabsContent>

              <TabsContent value="signup" className="transition-all duration-300">
                <SignupForm onSuccess={onSuccess} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Mobile preview */}
        <div className="lg:hidden mt-12">
          <div className="bg-muted/20 rounded-2xl p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-muted rounded"></div>
              <div className="h-3 w-16 bg-muted rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted rounded"></div>
              <div className="h-3 w-3/4 bg-muted rounded"></div>
              <div className="h-3 w-1/2 bg-primary/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}