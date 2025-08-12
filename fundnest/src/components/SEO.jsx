import React from 'react';
import { Helmet } from 'react-helmet';
import config, { isProduction } from '../config/environment';

const SEO = ({
  title = 'FundNest - Connect Startups with Investors',
  description = 'FundNest is the premier platform connecting innovative startups with potential investors. Find funding opportunities, discover promising ventures, and build meaningful business relationships.',
  keywords = 'startup funding, venture capital, angel investors, seed funding, investment platform, entrepreneur, startup accelerator',
  image = `${config.APP_URL}/assets/og-image.jpg`,
  url,
  type = 'website',
  author = 'FundNest Team',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noIndex = false,
  canonicalUrl,
  schema
}) => {
  // Construct full URL if not provided
  const fullUrl = url ? `${config.APP_URL}${url}` : config.APP_URL;
  const canonical = canonicalUrl || fullUrl;

  // Combine default and custom keywords
  const allKeywords = [...new Set([...keywords.split(', '), ...tags])].join(', ');

  // Default structured data for the organization
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FundNest',
    description: 'Premier platform connecting startups with investors',
    url: config.APP_URL,
    logo: `${config.APP_URL}/assets/logo-512.png`,
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-FUNDNEST',
      contactType: 'Customer Service',
      availableLanguage: 'English'
    },
    sameAs: [
      'https://twitter.com/fundnest',
      'https://linkedin.com/company/fundnest',
      'https://facebook.com/fundnest'
    ]
  };

  const structuredData = schema || defaultSchema;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonical} />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="FundNest" />
      <meta property="og:locale" content="en_US" />

      {/* Article specific tags */}
      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@fundnest" />
      <meta name="twitter:creator" content="@fundnest" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="FundNest" />
      <meta name="application-name" content="FundNest" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      <meta name="msapplication-config" content="/assets/browserconfig.xml" />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Preconnect to external domains for performance */}
      {isProduction() && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        </>
      )}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Additional production optimizations */}
      {isProduction() && (
        <>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="referrer" content="origin-when-cross-origin" />
          <meta name="google" content="notranslate" />
        </>
      )}
    </Helmet>
  );
};

// Predefined SEO configurations for common pages
export const seoConfigs = {
  home: {
    title: 'FundNest - Connect Startups with Investors | Funding Platform',
    description: 'Join FundNest, the leading platform connecting innovative startups with angel investors and VCs. Find funding, discover opportunities, and grow your network.',
    url: '/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'FundNest',
      url: config.APP_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${config.APP_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  },

  login: {
    title: 'Login - FundNest | Access Your Funding Platform Account',
    description: 'Sign in to your FundNest account to access funding opportunities, investor connections, and startup resources.',
    url: '/login',
    noIndex: true
  },

  register: {
    title: 'Create Account - FundNest | Join the Funding Revolution',
    description: 'Create your FundNest account today and start connecting with investors or discover promising startups. Free to join.',
    url: '/user-registration'
  },

  startupDashboard: {
    title: 'Startup Dashboard - FundNest | Manage Your Funding Journey',
    description: 'Access your startup dashboard to track funding progress, connect with investors, and manage your business profile.',
    url: '/startup-dashboard',
    type: 'website'
  },

  investorDashboard: {
    title: 'Investor Dashboard - FundNest | Discover Investment Opportunities',
    description: 'Explore curated startup opportunities, manage your investment portfolio, and connect with promising entrepreneurs.',
    url: '/investor-dashboard',
    type: 'website'
  }
};

export default SEO;