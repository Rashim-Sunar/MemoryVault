import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate} from "react-router-dom";

const Landing = () => {

  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/home");
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Optional: loader
  }

  return (
    <div className="w-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;