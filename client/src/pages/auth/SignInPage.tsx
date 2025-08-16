import { motion, Variants } from 'framer-motion';
import { SignIn } from '@clerk/clerk-react';
import { Heart, Sparkles } from 'lucide-react';

const particleVariants: Variants = {
  animate: {
    y: [0, -20, 0],
    opacity: [0.3, 0.8, 0.3],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] // easeInOut
    }
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      ease: [0.42, 0, 0.58, 1]
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1]
    }
  }
};

const SignInPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden gradient-memory">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            variants={particleVariants}
            animate="animate"
            transition={{ delay: i * 0.2 }}
          >
            <div className="w-2 h-2 bg-primary/20 rounded-full" />
          </motion.div>
        ))}

        {/* Large Decorative Circles */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 gradient-hero rounded-full opacity-10"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 4, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 gradient-sunset rounded-full opacity-10"
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
            scale: { duration: 5, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 min-h-screen flex items-center justify-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 gradient-hero rounded-2xl mb-6 shadow-warm"
              whileHover={{
                scale: 1.1,
                rotate: 5,
                boxShadow: "0 20px 60px -10px hsl(25 95% 53% / 0.4)"
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>

            <motion.h1 className="text-3xl font-bold text-gradient mb-2" variants={itemVariants}>
              Welcome Back
            </motion.h1>

            <motion.p className="text-muted-foreground" variants={itemVariants}>
              Sign in to access your precious memories
            </motion.p>
          </motion.div>

          {/* SignIn Container */}
          <motion.div
            className="relative"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Decorative Sparkles */}
            <div className="absolute -top-2 -left-2 w-4 h-4">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                <Sparkles className="w-4 h-4 text-primary/60" />
              </motion.div>
            </div>
            <div className="absolute -top-2 -right-2 w-4 h-4">
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
                <Sparkles className="w-4 h-4 text-accent/60" />
              </motion.div>
            </div>

            {/* Glassmorphism SignIn */}
            <motion.div
              className="relative bg-card/80 backdrop-blur-md border border-border/20 rounded-2xl p-8 shadow-soft"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
            >
              <div className="absolute inset-0 gradient-hero opacity-5 rounded-2xl" />

              <div className="relative z-10">
                <SignIn
                  fallbackRedirectUrl="/home"
                  forceRedirectUrl="/home"
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 transform hover:scale-105 shadow-warm",
                      card: "bg-transparent shadow-none border-none",
                      headerTitle: "text-foreground text-2xl font-bold",
                      headerSubtitle: "text-muted-foreground",
                      socialButtonsBlockButton:
                        "border border-input hover:bg-accent hover:text-accent-foreground transition-all duration-200 transform hover:scale-105",
                      formFieldInput:
                        "border border-input bg-background/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200",
                      footerActionLink: "text-primary hover:text-primary/80 transition-colors duration-200",
                      identityPreviewText: "text-foreground",
                      identityPreviewEditButton: "text-primary hover:text-primary/80"
                    },
                    layout: { socialButtonsPlacement: "top", showOptionalFields: false }
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Text */}
          <motion.div className="text-center mt-8" variants={itemVariants}>
            <motion.p
              className="text-sm text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
            >
              ✨ Your memories await ✨
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-background/10 pointer-events-none" />
    </div>
  );
};

export default SignInPage;
