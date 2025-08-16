import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Users, Lightbulb, Target } from "lucide-react";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      icon: Heart,
      title: "Memory-Centric",
      description: "We believe every moment matters. Our platform is designed to honor and preserve your most precious memories.",
    },
    {
      icon: Users,
      title: "Privacy First",
      description: "Your memories are personal. We built industry-leading privacy controls to keep your moments safe and secure.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Combining cutting-edge AI with intuitive design to create the most advanced memory preservation platform.",
    },
    {
      icon: Target,
      title: "Simplicity",
      description: "Complex technology, simple experience. We make it effortless to store and relive your most important moments.",
    },
  ];

  return (
    <section id="about" ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Revolutionizing How We
              <span className="text-gradient"> Remember</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              MemoryVault was born from a simple idea: what if your calendar could tell your life story? 
              We've transformed the traditional calendar into a powerful memory preservation tool that grows 
              more valuable with every moment you capture.
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Built on the robust MERN stack with Cloudinary integration, our platform offers 
              enterprise-grade reliability with consumer-friendly simplicity. Whether it's your 
              child's first steps, a sunset from your travels, or a quiet moment with loved ones, 
              MemoryVault ensures these precious memories are never lost.
            </p>

            <Button size="lg" className="gradient-hero shadow-warm">
              Learn More About Our Story
            </Button>
          </motion.div>

          {/* Values Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-soft hover:shadow-warm transition-all duration-300 border border-border/50"
              >
                <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mb-4 shadow-warm">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center bg-gradient-memory rounded-2xl p-12 shadow-soft"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Our Mission
          </h3>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            To create a world where no precious moment is forgotten. We're building the future of digital memory preservation, 
            where technology serves humanity's most fundamental need: to remember, to connect, and to cherish the stories that make us who we are.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;