"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginFormSchema, type LoginFormValues } from "@/lib/validations/login";

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: "onTouched",
  });

  async function onSubmit(data: LoginFormValues) {
    setServerError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError("Invalid email or password.");
      return;
    }

    router.replace("/admin/registrations");
    router.refresh();
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2 font-semibold">
          <CalendarCheck className="h-5 w-5" />
          <span className="text-lg">RSVP Demo</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin sign in</CardTitle>
            <CardDescription>
              Enter your credentials to manage registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {serverError && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {serverError}
              </div>
            )}

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={!!form.formState.errors.email}
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="mt-1 text-sm text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      aria-invalid={!!form.formState.errors.password}
                      {...form.register("password")}
                    />
                    {form.formState.errors.password && (
                      <p className="mt-1 text-sm text-destructive">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-12 w-full text-base font-semibold"
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
