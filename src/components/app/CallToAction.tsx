import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 purple-gradient opacity-95 mask-gradient-b"></div>

      <div className="container">
        <div className="relative py-16 px-8 md:p-16 rounded-3xl overflow-hidden glass">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-purple-300/20 blur-3xl"></div>

          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="heading-lg text-white mb-6 animate-fade-in">
              Ready to Transform Your{" "}
              <span className="text-purple-200">Blog Performance?</span>
            </h2>

            <p
              className="text-lg text-white/80 mb-10 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Join thousands of content creators who have already increased
              their blog traffic by an average of 187% in just 90 days.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <Link
                href="/dashboard"
                className="py-3 px-8 rounded-md bg-white text-purple-700 font-medium transition-all hover:bg-white/90 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4 inline-block" />
              </Link>

              {/* <Link
                href="#"
                className="py-3 px-8 rounded-md bg-transparent border border-white/30 text-white font-medium transition-all hover:bg-white/10 w-full sm:w-auto"
              >
                Request Demo
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
