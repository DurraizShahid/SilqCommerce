import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import AuthPage from "@/components/auth/AuthPage";
import { toast } from "sonner";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

const ForgotPasswordPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotValues) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Password reset link sent to ${values.email}`);
  };

  return (
    <AuthPage
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a secure link."
      footer={
        <p className="text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending reset link..." : "Send reset link"}
        </Button>
        {isSubmitSuccessful && (
          <p className="text-center text-sm text-muted-foreground">
            Check your inbox for the reset instructions.
          </p>
        )}
      </form>
    </AuthPage>
  );
};

export default ForgotPasswordPage;

