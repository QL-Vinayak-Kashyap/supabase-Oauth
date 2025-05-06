import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "WriteEasy transformed our content strategy. We're publishing twice as many blogs in half the time, and our organic traffic has increased by 45%.",
    name: "Sarah Johnson",
    title: "Content Manager at TechFlow"
  },
  {
    quote: "The quality of content WriteEasy produces is remarkable. Our readers can't tell the difference between AI and human-written posts, and our engagement metrics have never been better.",
    name: "Michael Chen",
    title: "Digital Marketing Director"
  },
  {
    quote: "As a solo entrepreneur, WriteEasy has been a game-changer. I can maintain a consistent blog schedule without sacrificing quality or spending all my time writing.",
    name: "Leila Patel",
    title: "Founder, GrowthHackers"
  }
];

const StarRating = () => (
  <div className="flex text-yellow-400 mb-4">
    {[...Array(5)].fill(<Star className="h-5 w-5 fill-current" />)}
  </div>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-gray-50">
    <div className="container mx-auto">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer Success Stories</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our happy community of creators
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index} 
            className="bg-white p-8 rounded-xl shadow-sm animate-fade-up"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="mb-6">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.33333 21.3333C7.86667 21.3333 6.66667 20.8 5.73333 19.7333C4.8 18.6667 4.33333 17.3333 4.33333 15.7333C4.33333 14 4.93333 12.2667 6.13333 10.5333C7.33333 8.8 9 7.33333 11.1333 6.13333L13.3333 8.53333C11.2 9.86667 9.86667 11.3333 9.33333 12.9333C9.73333 12.8 10.2 12.7333 10.7333 12.7333C12 12.7333 13.0667 13.2 13.9333 14.1333C14.8 15.0667 15.2333 16.2 15.2333 17.5333C15.2333 18.8667 14.7667 20 13.8333 20.9333C12.9 21.8667 11.7333 21.3333 9.33333 21.3333ZM22.6667 21.3333C21.2 21.3333 20 20.8 19.0667 19.7333C18.1333 18.6667 17.6667 17.3333 17.6667 15.7333C17.6667 14 18.2667 12.2667 19.4667 10.5333C20.6667 8.8 22.3333 7.33333 24.4667 6.13333L26.6667 8.53333C24.5333 9.86667 23.2 11.3333 22.6667 12.9333C23.0667 12.8 23.5333 12.7333 24.0667 12.7333C25.3333 12.7333 26.4 13.2 27.2667 14.1333C28.1333 15.0667 28.5667 16.2 28.5667 17.5333C28.5667 18.8667 28.1 20 27.1667 20.9333C26.2333 21.8667 24.0667 21.3333 22.6667 21.3333Z" fill="black"/>
              </svg>
            </div>
            <p className="text-lg mb-6 italic">{testimonial.quote}</p>
            <div>
              <p className="font-bold">{testimonial.name}</p>
              <p className="text-gray-600">{testimonial.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Testimonials;
