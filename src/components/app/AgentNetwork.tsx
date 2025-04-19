import {
  FileText,
  Eye,
  Search,
  Shield,
  BarChart3,
  Globe,
  Layout,
  UserCheck,
} from "lucide-react";

const agents = [
  {
    title: "Writer Agent",
    description:
      "Professional tech blogger who crafts engaging, insightful content.",
    icon: FileText,
  },
  {
    title: "Critic Agent",
    description:
      "Ensures clarity and impact by eliminating dull sections and enhancing engagement.",
    icon: Eye,
  },
  {
    title: "SEO Agent",
    description:
      "Optimizes content with natural keyword placement for better rankings.",
    icon: Search,
  },
  {
    title: "Legal Agent",
    description: "Reviews content for legal compliance and accuracy of claims.",
    icon: Shield,
  },
  {
    title: "Ethics Agent",
    description:
      "Ensures content remains unbiased and respects privacy considerations.",
    icon: BarChart3,
  },
  {
    title: "Meta Agent",
    description:
      "Aggregates feedback from other agents for comprehensive review.",
    icon: Globe,
  },
  {
    title: "Format Agent",
    description:
      "Structures content with appropriate headings and formatting for readability.",
    icon: Layout,
  },
  {
    title: "Humanization Agent",
    description:
      "Transforms AI text to sound authentically human, avoiding detection.",
    icon: UserCheck,
  },
];

const AgentNetwork = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2
            className="heading-lg mb-4 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Specialized{" "}
            <span className="text-purple-600">Intelligence Grid</span>{" "}
          </h2>
          {/* <h2 className="heading-lg mb-4">Specialized Intelligence Grid</h2> */}
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Each piece of content is crafted by a team of specialized AI agents,
            each with their own expertise and focus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {agents.map((agent, index) => (
            <div
              key={agent.title}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <agent.icon className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{agent.title}</h3>
              <p className="text-gray-600 text-sm">{agent.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentNetwork;
