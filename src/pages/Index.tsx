
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mt-16">
        {/* Hero section */}
        <section className="relative py-20 sm:py-32">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center page-transition">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary">
                Challenge Yourself
              </span>
              <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight">
                Unleash Your Potential Through
                <span className="block text-primary"> Innovation</span>
              </h1>
              <p className="mb-10 text-lg text-foreground/70 leading-relaxed">
                Join our hackathon platform to showcase your skills, connect with like-minded individuals, 
                and build solutions that make a difference. Apply for challenges and submit your work.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  className="text-base px-8 py-6 button-hover"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </Button>
                <Button
                  className="text-base px-8 py-6 button-hover"
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-16 bg-secondary/50">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
              <h2 className="text-3xl font-medium mb-4">How It Works</h2>
              <p className="text-foreground/70">
                Our platform makes participating in hackathons simple and straightforward
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Apply for Projects",
                  description: "Browse available hackathon challenges and apply for those that match your interests and skills.",
                  icon: "🔍",
                },
                {
                  title: "Build Your Solution",
                  description: "Work within the given timeframe to develop your solution, with a personal countdown timer.",
                  icon: "⏱️",
                },
                {
                  title: "Submit Your Work",
                  description: "Submit your project description, code, files, and demo links before the deadline.",
                  icon: "✅",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="glass-card p-6 rounded-lg hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-100">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-foreground/60">
                © {new Date().getFullYear()} HackathonHub. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-6">
              {["Terms", "Privacy", "Support"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
