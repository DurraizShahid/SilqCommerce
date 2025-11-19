import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { H1, P } from "@/components/ui/typography";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const vendorSchema = z.object({
  brandName: z.string().min(2, "Brand name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Enter a valid email"),
  website: z.string().url("Enter a valid URL"),
  category: z.string().min(1, "Select a category"),
  avgOrderValue: z.string().min(1, "Select an option"),
  story: z.string().min(20, "Tell us about your brand (20+ characters)"),
});

type VendorValues = z.infer<typeof vendorSchema>;

const VendorOnboardingPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<VendorValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      brandName: "",
      contactName: "",
      email: "",
      website: "",
      category: "",
      avgOrderValue: "",
      story: "",
    },
  });

  const onSubmit = async (values: VendorValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(`Thanks ${values.contactName}, our curation team will review your application shortly.`);
    reset();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <H1>Partner with SilqCommerce</H1>
        <P className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join our curated roster of luxury houses and independent ateliers. We review every submission to maintain
          uncompromising quality standards.
        </P>
      </div>
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Vendor Application</CardTitle>
          <P className="text-muted-foreground">Share your details and we will reach out within 48 hours.</P>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand name</Label>
                <Input id="brandName" placeholder="Maison Aurelia" {...register("brandName")} />
                {errors.brandName && <p className="text-sm text-destructive">{errors.brandName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Primary contact</Label>
                <Input id="contactName" placeholder="Elise Laurent" {...register("contactName")} />
                {errors.contactName && <p className="text-sm text-destructive">{errors.contactName.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Business email</Label>
                <Input id="email" type="email" placeholder="hello@aurelia.com" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" placeholder="https://aurelia.com" {...register("website")} />
                {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <input type="hidden" {...register("category")} />
                <Label>Primary category</Label>
                <Select onValueChange={(value) => setValue("category", value, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apparel">Apparel</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="footwear">Footwear</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="home">Home & Objects</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>
              <div className="space-y-2">
                <input type="hidden" {...register("avgOrderValue")} />
                <Label>Average order value</Label>
                <Select onValueChange={(value) => setValue("avgOrderValue", value, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-150">$150 & below</SelectItem>
                    <SelectItem value="150-500">$150 - $500</SelectItem>
                    <SelectItem value="500-1500">$500 - $1,500</SelectItem>
                    <SelectItem value="1500-plus">$1,500+</SelectItem>
                  </SelectContent>
                </Select>
                {errors.avgOrderValue && <p className="text-sm text-destructive">{errors.avgOrderValue.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="story">Brand story</Label>
              <Textarea
                id="story"
                rows={5}
                placeholder="Tell us about your craftsmanship, sourcing philosophy, and what makes your collection unique."
                {...register("story")}
              />
              {errors.story && <p className="text-sm text-destructive">{errors.story.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4 border-t border-border/60 p-6 sm:flex-row sm:items-center sm:justify-between">
            <P className="text-sm text-muted-foreground">
              By submitting, you agree to our Vendor Terms and curation standards.
            </P>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit application"}
            </Button>
          </CardFooter>
        </form>
        {isSubmitSuccessful && (
          <div className="px-6 pb-6">
            <div className="rounded-md bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-100">
              Application received! Our partnerships team will connect with you soon.
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VendorOnboardingPage;

