import { ChevronLeft, ChevronRight, Facebook, Instagram, Star, Twitter, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';


const testimonials = [
    {
      id: 1,
      name: "Arman Pani",
      role: "Photographer at ABC Studios",
      text: "As a photographer, this tool has been a game-changer! Sharing event photos with clients has never been easier.",
      rating: 5
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Wedding Photographer",
      text: "The AI organization is brilliant. It saves me hours of manual sorting and tagging. Highly recommended!",
      rating: 5
    },
    {
      id: 3,
      name: "Marcus Rodriguez",
      role: "Nature Photographer",
      text: "Finally, a photo management tool that understands the needs of professional photographers. Amazing work!",
      rating: 5
    }
  ];

  
const HomePage = () => {
      const [activeIndex, setActiveIndex] = useState(0);
      const [isAnimating, setIsAnimating] = useState(false);
    
      useEffect(() => {
        const interval = setInterval(() => {
          handleNext();
        }, 5000);
    
        return () => clearInterval(interval);
      }, [activeIndex]);
    
      const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
        setTimeout(() => setIsAnimating(false), 500);
      };
    
      const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsAnimating(false), 500);
      };
    
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center">
            <div className="text-2xl font-bold text-blue-400">PhotoAI</div>
            <div className="flex-1 flex justify-end items-center gap-8">
              <a href="#" className="text-lg hover:text-blue-400 transition">Home</a>
              <a href="#" className="text-lg hover:text-blue-400 transition">About</a>
              <a href="#" className="text-lg hover:text-blue-400 transition">Contact</a>
              <Button label="Sign Up" onClick={() => navigate("/signup")} size='small' />
            </div>
          </nav>
        </header>
  
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6 font-handwriting">
            Your Photos,<br />Perfectly Organized
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Effortlessly store, share, and find your memories organized by AI. Smart AI photo recognition
            helps keep your photos organized, making sure nothing gets lost.
          </p>
          <div className="flex justify-center">
            <Button label="Get Started" onClick={() => navigate("/signup")} size='medium' />
          </div>
        </section>
  
        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold mb-12 text-center font-handwriting">
            Why Choose Our AI Photo Album?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-800 rounded-lg text-center">
            <img src="/images/ai-organization.png" alt="AI Smart Organization" className="w-100 h-50 mx-auto mb-4 rounded-lg" />
            <h3 className="text-xl font-bold mb-3">AI Smart Organization</h3>
              <p className="text-gray-400">Automatically categorize and tag your photos for easy searching and sorting</p>
            </div>
            <div className="p-6 border border-gray-800 rounded-lg text-center">
            <img src="/images/efficient-storage.png" alt="Efficient Storage" className="w-100 h-50 mx-auto mb-4 rounded-lg" />
            <h3 className="text-xl font-bold mb-3">Efficient Storage</h3>
              <p className="text-gray-400">Save space while maintaining quality with our smart compression technology</p>
            </div>
            <div className="p-6 border border-gray-800 rounded-lg text-center">
            <img src="/images/secure-private.png" alt="Secure and Private" className="w-100 h-50 mx-auto mb-4 rounded-lg" />
            <h3 className="text-xl font-bold mb-3">Secure and Private</h3>
              <p className="text-gray-400">Your memories are safe with our encrypted storage and sharing controls</p>
            </div>
          </div>
        </section>
  
        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold mb-12 text-center font-handwriting">
            What photographers say about us?
          </h2>
          <div className="relative">
            <div className="flex justify-center items-center">
              <button 
                onClick={handlePrev}
                className="absolute left-0 z-10 p-2 text-blue-400 hover:text-blue-300 transition"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <div className="relative w-full max-w-4xl h-[400px] overflow-hidden">
                <div className="absolute w-full h-full flex justify-center items-center">
                  {testimonials.map((testimonial, index) => {
                    const position = (index - activeIndex + testimonials.length) % testimonials.length;
                    const isActive = position === 0;
                    const isPrev = position === testimonials.length - 1;
                    const isNext = position === 1;
                    
                    let translateX = '100%';
                    let scale = '0.8';
                    let opacity = '0';
                    let zIndex = '0';
                    
                    if (isActive) {
                      translateX = '0';
                      scale = '1';
                      opacity = '1';
                      zIndex = '3';
                    } else if (isPrev) {
                      translateX = '-100%';
                      scale = '0.8';
                      opacity = '0.5';
                      zIndex = '1';
                    } else if (isNext) {
                      translateX = '100%';
                      scale = '0.8';
                      opacity = '0.5';
                      zIndex = '1';
                    }
  
                    return (
                      <div
                        key={testimonial.id}
                        className="absolute w-full max-w-2xl p-6 transition-all duration-500"
                        style={{
                          transform: `translateX(${translateX}) scale(${scale})`,
                          opacity,
                          zIndex,
                        }}
                      >
                        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-xl">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
                            <div>
                              <h4 className="text-xl font-bold">{testimonial.name}</h4>
                              <p className="text-gray-400">{testimonial.role}</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-lg mb-6">
                            {testimonial.text}
                          </p>
                          <div className="flex gap-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
  
              <button 
                onClick={handleNext}
                className="absolute right-0 z-10 p-2 text-blue-400 hover:text-blue-300 transition"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-xl font-bold text-blue-400 mb-2">PhotoAI</div>
                <p className="text-gray-400 text-sm">© 2024 PhotoAI. All rights reserved.</p>
              </div>
              <div className="flex justify-end gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            </div>
  
          </div>
        </footer>
      </div>
    )
};

export default HomePage;
