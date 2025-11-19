import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthPage from "@/components/auth/AuthPage";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      const redirectPath = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <AuthPage
      title="Welcome back"
      subtitle="Sign in to continue shopping, manage your orders, and access premium features."
      footer={
        <div className="space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            New to SilqCommerce?{" "}
            <Link to="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
          <Link to="/forgot-password" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Forgot your password?
          </Link>
        </div>
      }
    >
      <SocialLoginButtons />
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          <p>Use admin@silqcommerce.com / Admin@123 for the admin panel.</p>
          <p>Use vendor@silqcommerce.com / Vendor@123 to preview vendor access.</p>
        </div>
      </form>
    </AuthPage>
  );
};

export default LoginPage;

