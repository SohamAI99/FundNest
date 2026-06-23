import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const trustItems = [
  {
    icon: 'ShieldCheck',
    title: 'Bank-Grade Security',
    description: 'Your data is protected with 256-bit SSL encryption and SOC 2 compliant infrastructure.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    icon: 'UserCheck',
    title: 'Verified Profiles',
    description: 'Every investor and startup goes through KYC verification before accessing the platform.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: 'Scale',
    title: 'SEBI Compliant',
    description: 'All transactions and communications follow SEBI guidelines for investor protection.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: 'Lock',
    title: 'NDA Protection',
    description: 'Built-in NDA management ensures your confidential information stays private.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  }
];

const TrustSection = () => {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Built on Trust & Compliance
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            We take security seriously. FundNest is built with enterprise-grade security measures to protect your investments and data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={item.icon} size={24} className={item.color} strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap items-center justify-center gap-12 text-white/80"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white">99.9%</div>
            <div className="text-sm text-white/60">Uptime SLA</div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">2FA</div>
            <div className="text-sm text-white/60">Authentication</div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">GDPR</div>
            <div className="text-sm text-white/60">Compliant</div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-sm text-white/60">Monitoring</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
