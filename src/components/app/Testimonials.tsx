import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "WriteEasy has completely transformed our content creation process. The quality of writing is indistinguishable from our in-house team, but it's produced in a fraction of the time.",
    author: "Sarah Johnson",
    title: "Content Director, TechInsight",
  },
  {
    quote:
      "The specialized agent approach makes all the difference. Each piece of content gets scrutinized from multiple angles, resulting in polished, engaging articles that our audience loves.",
    author: "Michael Chen",
    title: "Marketing Manager, GrowthLabs",
  },
  {
    quote:
      "We've tried other AI writing tools, but none come close to the human-like quality we get with WriteEasy. Our SEO has improved significantly since we started using it.",
    author: "Alex Rivera",
    title: "Digital Strategist, Innovation Hub",
  },
];

const StarRating = () => (
  <div className="flex text-yellow-400 mb-4">
    {[...Array(5)].fill(<Star className="h-5 w-5 fill-current" />)}
  </div>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 mb-4">
            Success Stories
          </div>
          <h2 className="heading-lg mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover how WriteEasy is helping content creators and marketing
            teams deliver exceptional results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <StarRating />
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold text-gray-900">
                  {testimonial.author}
                </p>
                <p className="text-gray-500 text-sm">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
