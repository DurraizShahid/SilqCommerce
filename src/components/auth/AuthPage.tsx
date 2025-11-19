import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { P } from "@/components/ui/typography";

interface AuthPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const AuthPage: React.FC<AuthPageProps> = ({ title, subtitle, children, footer }) => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-12">
      <Card className="w-full max-w-xl shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-semibold">{title}</CardTitle>
          {subtitle && <P className="text-muted-foreground">{subtitle}</P>}
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
        {footer && <CardFooter className="flex justify-center">{footer}</CardFooter>}
      </Card>
    </div>
  );
};

export default AuthPage;

