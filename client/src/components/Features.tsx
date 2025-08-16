import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { 
  Calendar, 
  Upload, 
  Cloud, 
  Search, 
  Tag, 
  Shield, 
  Brain 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import calendarImage from "@/assets/calendar-feature.png";
import uploadImage from "@/assets/upload-feature.svg";

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Calendar,
      title: "Interactive Calendar UI",
      description: "Click on any date to view your memories from that day. Beautiful, intuitive interface that makes browsing your past effortless.",
      image: calendarImage,
    },
    {
      icon: Upload,
      title: "Easy Memory Upload",
      description: "Upload photos, videos, and text notes for any date. Drag and drop your memories or add them with our simple interface.",
      image: uploadImage,
    },
    {
      icon: Cloud,
      title: "Secure Cloud Storage",
      description: "Your media is safely stored in Cloudinary with URLs saved in MongoDB. Access your memories from anywhere, anytime.",
    },
    {
      icon: Search,
      title: "Smart Date Search",
      description: "Jump directly to any past memory with our powerful search. Find that special moment from years ago in seconds.",
    },
    {
      icon: Tag,
      title: "Memory Tags & Filters",
      description: "Organize your memories with custom tags like 'Birthday', 'Travel', 'Family'. Filter and find memories by category.",
    },
    {
      icon: Shield,
      title: "Privacy Protection",
      description: "Mark memories as private or public. Full control over who can see your precious moments with advanced privacy settings.",
    },
    {
      icon: Brain,
      title: "AI Memory Summaries",
      description: "Optional AI-powered summaries automatically generate beautiful recaps of your day, helping you remember even more details.",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="features" ref={ref} className="py-20 bg-gradient-memory">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for Your
            <span className="text-gradient"> Memory Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to capture, organize, and relive your most precious moments. 
            Built with cutting-edge technology for the smoothest experience.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full shadow-soft hover:shadow-warm transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  {feature.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mr-4 shadow-warm">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "10K+", label: "Memories Stored" },
            { number: "99.9%", label: "Uptime" },
            { number: "500GB", label: "Free Storage" },
            { number: "24/7", label: "Support" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;