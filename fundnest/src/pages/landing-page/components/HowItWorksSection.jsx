import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const steps = [
  {
    step: '01',
    icon: 'UserPlus',
    title: 'Create Your Profile',
    description: 'Sign up as a startup founder or investor. Build a compelling profile that showcases your vision, traction, or investment thesis.',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50'
  },
  {
    step: '02',
    icon: 'Brain',
    title: 'AI-Powered Matching',
    description: 'Our intelligent algorithm analyzes your profile, preferences, and goals to find the most compatible partners from our verified network.',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50'
  },
  {
    step: '03',
    icon: 'MessageSquare',
    title: 'Connect & Communicate',
    description: 'Start conversations with matched investors or startups through our secure messaging platform. Share pitch decks, schedule calls, and build relationships.',
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50'
  },
  {
    step: '04',
    icon: 'Handshake',
    title: 'Close the Deal',
    description: 'Navigate the funding process with built-in tools for document sharing, due diligence tracking, and deal management. From pitch to partnership.',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50'
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="how-it-works">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-semibold rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            How FundNest Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From profile creation to closing deals, our platform streamlines the entire fundraising journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200"></div>

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative text-center group"
            >
              {/* Step number circle */}
              <div className="relative z-10 mb-6 mx-auto">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={step.icon} size={28} color="white" strokeWidth={2} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                  {step.step}
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
