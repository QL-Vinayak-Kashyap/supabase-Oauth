"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    // Add your form submission logic here
    // This is just a mock delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
  }

  return (
    <section className="container py-24 sm:py-32">
      <div className="grid gap-16 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl">
            Get in Touch with Us
          </h2>
          <p className="text-muted-foreground">
            Contact WriteEasy, the AI SEO blog tool experts in New Delhi, for
            inquiries or assistance.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Input
                id="name"
                placeholder="Name"
                required
                className="bg-secondary/50"
              />
            </div>
            <div className="grid gap-2">
              <Input
                id="email"
                placeholder="Email"
                type="email"
                required
                className="bg-secondary/50"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Textarea
              id="message"
              placeholder="Message"
              required
              className="min-h-[150px] bg-secondary/50"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Submit"}
          </Button>
          <p className="text-sm text-muted-foreground">
            This site is protected by reCAPTCHA and the Google{" "}
            <a
              href="https://policies.google.com/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://policies.google.com/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            apply.
          </p>
        </form>
      </div>
    </section>
  );
}
