import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center gap-6">
        <Card className="w-full shadow-xl rounded-2xl border border-gray-200 animate-fade-in">
          <CardHeader className="text-center space-y-2">
            {/* ✅ Tick icon added here */}
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl">
                ✓
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Thank you for signing up!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 text-center">
            <CardDescription className="text-gray-500">
              You're almost there – just one more step.
            </CardDescription>
            <p className="text-sm text-muted-foreground">
              Please check your email and confirm your account to get started.
            </p>
            <p className="text-sm text-gray-600">
              <span>Already confirmed? </span>
              <Link
                href="/auth/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in here →
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  

  );
}
