import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const BenefitsSection = () => {
  const benefits = [
    {
      id: 1,
      icon: 'Brain',
      title: 'AI-Powered Matching',
      description: 'Our advanced AI algorithms analyze startup profiles, business models, and investor preferences to create perfect matches with 94% accuracy.',
      features: ['Smart compatibility scoring', 'Automated pitch analysis', 'Predictive funding success'],
      color: 'from-primary to-secondary'
    },
    {
      id: 2,
      icon: 'Shield',
      title: 'Verified Ecosystem',
      description: 'Every user undergoes rigorous KYC verification ensuring a trusted environment for secure funding discussions and transactions.',
      features: ['Identity verification', 'Document validation', 'Compliance monitoring'],
      color: 'from-accent to-success'
    },
    {
      id: 3,
      icon: 'MessageCircle',
      title: 'Real-Time Communication',
      description: 'Connect instantly with potential partners through our integrated messaging system with file sharing and video call capabilities.',
      features: ['Instant messaging', 'File attachments', 'Video conferencing'],
      color: 'from-secondary to-accent'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Why Choose FundNest?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We've revolutionized the funding process by combining cutting-edge technology 
            with human expertise to create the most efficient startup-investor matching platform.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits?.map((benefit) => (
            <motion.div
              key={benefit?.id}
              variants={itemVariants}
              className="group"
            >
              <div className="glass-card rounded-2xl p-8 h-full hover-lift transition-smooth border border-white/20 hover:border-white/40">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit?.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}>
                    <Icon name={benefit?.icon} size={28} color="white" strokeWidth={2} />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-smooth -z-10"></div>
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
                  {benefit?.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {benefit?.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3">
                  {benefit?.features?.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                        <Icon name="Check" size={12} className="text-success" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-foreground font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>


              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 glass-card rounded-2xl p-8 md:p-12 border border-white/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">94%</div>
              <div className="text-sm text-muted-foreground">Match Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">48h</div>
              <div className="text-sm text-muted-foreground">Avg. Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">73%</div>
              <div className="text-sm text-muted-foreground">Funding Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-success mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Platform Availability</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;