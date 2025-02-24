import type React from "react"
import {
  SignalIcon,
  MessageCircleIcon,
  ListChecksIcon,
  MessagesSquareIcon,
  BarChart3Icon,
  UsersIcon,
} from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="relative flex flex-col gap-4 rounded-xl bg-secondary/20 p-6 lg:p-8">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/30">{icon}</div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold leading-tight tracking-tight text-white">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function Features() {
  const features = [
    {
      title: "AI-Powered SEO Strategies",
      description:
        "Leverage AI technology to develop effective SEO strategies that boost your blog's visibility and ranking.",
      icon: <SignalIcon className="h-6 w-6 text-white" />,
    },
    {
      title: "Keyword Optimization Insights",
      description:
        "Receive detailed insights on keyword optimization to enhance content relevance and search engine performance.",
      icon: <MessageCircleIcon className="h-6 w-6 text-white" />,
    },
    {
      title: "Content Quality Enhancement",
      description:
        "Utilize advanced tools to improve the quality of your blog content, making it more engaging and informative.",
      icon: <ListChecksIcon className="h-6 w-6 text-white" />,
    },
    {
      title: "Automated Blog Topic Suggestions",
      description:
        "Get AI-driven suggestions for trending blog topics that can capture audience interest and drive traffic.",
      icon: <MessagesSquareIcon className="h-6 w-6 text-white" />,
    },
    {
      title: "SEO Performance Analytics",
      description:
        "Access comprehensive analytics to monitor SEO performance and discover areas for improvement in real-time.",
      icon: <BarChart3Icon className="h-6 w-6 text-white" />,
    },
    {
      title: "User Engagement Tracking",
      description:
        "Track user engagement metrics to understand audience behavior and tailor content strategies effectively.",
      icon: <UsersIcon className="h-6 w-6 text-white" />,
    },
  ]

  return (
    <section className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Optimize Search</h2>
      </div>
      <div className="mx-auto mt-16 grid gap-8 md:grid-cols-2 lg:max-w-none">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </section>
  )
}

