"use client";

import { CalendarCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/lib/validations/register";

export default function RegisterPage() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    mode: "onTouched",
  });

  function onSubmit(data: RegisterFormValues) {
    console.log(data);
  }

  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-zinc-50">
        <div className="flex items-center gap-2 font-semibold">
          <CalendarCheck className="h-5 w-5" />
          <span className="text-lg">RSVP Demo</span>
        </div>
        <blockquote className="space-y-2">
          <p className="text-lg leading-relaxed">
            &ldquo;Manage event RSVPs without the spreadsheet chaos.&rdquo;
          </p>
          <footer className="text-sm text-zinc-400">— r.khiong</footer>
        </blockquote>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-end p-6">
          <span className="text-sm font-medium">Admin</span>
        </div>

        <div className="flex flex-1 justify-center px-6 pt-4 pb-10 lg:items-center lg:px-12 lg:pt-0">
          <div className="w-full max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Register for the event</h1>
              <p className="text-sm text-muted-foreground">
                Enter your details below to register
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div>
                    <Input
                      id="name"
                      type="text"
                      aria-invalid={!!form.formState.errors.name}
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div>
                    <Input
                      id="email"
                      type="email"
                      aria-invalid={!!form.formState.errors.email}
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div>
                    <Input
                      id="phone"
                      type="tel"
                      aria-invalid={!!form.formState.errors.phone}
                      {...form.register("phone")}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">
                    Company
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <div>
                    <Input
                      id="company"
                      type="text"
                      aria-invalid={!!form.formState.errors.company}
                      {...form.register("company")}
                    />
                    {form.formState.errors.company && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.company.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-12 text-base font-semibold"
              >
                {form.formState.isSubmitting
                  ? "Submitting..."
                  : "Submit registration"}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              By submitting, you agree this is a demo event. No real data is
              stored long-term.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
