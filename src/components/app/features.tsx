import {
  Zap,
  BarChart3,
  Search,
  LineChart,
  RefreshCw,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "AI Content Analysis",
    description:
      "Intelligent content scoring and recommendations to improve your blog's SEO performance.",
    icon: Zap,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Keyword Research",
    description:
      "Discover high-performing keywords that your audience is actively searching for.",
    icon: Search,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Traffic Analytics",
    description:
      "Comprehensive traffic analysis with actionable insights to grow your audience.",
    icon: BarChart3,
    color: "bg-sky-100 text-sky-600",
  },
  {
    title: "Performance Tracking",
    description:
      "Track your blog's performance metrics in real-time with intuitive dashboards.",
    icon: LineChart,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Content Optimization",
    description:
      "Smart optimization suggestions to improve your content's search ranking.",
    icon: RefreshCw,
    color: "bg-fuchsia-100 text-fuchsia-600",
  },
  {
    title: "SEO Best Practices",
    description:
      "Stay ahead with latest SEO best practices and algorithm updates.",
    icon: Award,
    color: "bg-rose-100 text-rose-600",
  },
];

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  return (
    <div
      className="glass-card rounded-xl p-6 opacity-0"
      style={{
        animation: `fade-in-up 0.5s ease-out ${0.1 + index * 0.1}s forwards`,
      }}
    >
      <div
        className={cn(
          "rounded-full w-12 h-12 flex items-center justify-center mb-4",
          feature.color
        )}
      >
        <feature.icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-purple-100/50 blur-3xl -z-10"></div>

      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 mb-4 animate-fade-in">
            Advanced Tools
          </div>
          <h2
            className="heading-lg mb-4 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Powerful Features{" "}
            <span className="text-purple-600">for Content Creators</span>
          </h2>
          <p
            className="text-lg text-muted-foreground animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Everything you need to optimize your blog's content and skyrocket
            your traffic with data-driven strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
