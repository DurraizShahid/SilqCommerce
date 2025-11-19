import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { H1, P } from "@/components/ui/typography";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";

interface CheckoutSuccessState {
  orderId?: string;
  email?: string;
  shippingMethod?: string;
  total?: number;
}

const CheckoutSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as CheckoutSuccessState) || {};
  const { formatPrice } = useCurrency();

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-4xl font-semibold text-foreground">Thank you for your order</CardTitle>
          <P className="text-muted-foreground">A confirmation email has been sent to {state.email ?? "your inbox"}.</P>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-center">
            <P className="text-sm uppercase tracking-wide text-muted-foreground">Order ID</P>
            <H1 className="text-3xl font-bold">{state.orderId ?? "Pending"}</H1>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Shipping method</p>
              <p className="text-lg font-semibold capitalize">
                {state.shippingMethod === "express" ? "Express (1-2 days)" : "Standard (3-5 days)"}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total charged</p>
              <p className="text-lg font-semibold">
                {state.total ? formatPrice(state.total) : "—"}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/account")}>
            View account
          </Button>
          <Button className="w-full sm:w-auto" onClick={() => navigate("/products")}>
            Continue shopping
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutSuccessPage;

