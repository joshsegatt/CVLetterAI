// LinkedIn Boost Configuration
// This file controls the monetization features for LinkedIn Boost

export const LINKEDIN_BOOST_CONFIG = {
  // Monetization settings
  IS_FREE_PERIOD: true, // Set to false to enable paywall
  PRICE: 5.99, // Price when paywall is enabled
  CURRENCY: 'USD',
  
  // Free period settings
  FREE_FEATURES: {
    PROFILE_GENERATIONS_PER_DAY: 3, // Limit when paywall is enabled
    ENABLE_PHOTO_GENERATION: false, // Premium feature for future
    ENABLE_INDUSTRY_TEMPLATES: true, // Basic templates always free
    ENABLE_ADVANCED_ANALYTICS: false, // Premium feature for future
  },
  
  // Premium features (for future activation)
  PREMIUM_FEATURES: {
    UNLIMITED_GENERATIONS: true,
    AI_PHOTO_GENERATION: true,
    INDUSTRY_SPECIFIC_TEMPLATES: true,
    LINKEDIN_ANALYTICS: true,
    PRIORITY_SUPPORT: true,
    ADVANCED_CUSTOMIZATION: true,
  },
  
  // Paywall trigger conditions (for future use)
  PAYWALL_TRIGGERS: {
    AFTER_GENERATIONS: 3, // Show paywall after X generations
    AFTER_DAYS: 7, // Show paywall after X days of usage
    FOR_PREMIUM_FEATURES: true, // Show paywall for premium features
  }
};

// Helper functions for monetization
export const shouldShowPaywall = (userUsage: any) => {
  if (LINKEDIN_BOOST_CONFIG.IS_FREE_PERIOD) return false;
  
  // Add paywall logic here when needed
  return false;
};

export const canUseFeature = (feature: keyof typeof LINKEDIN_BOOST_CONFIG.FREE_FEATURES) => {
  if (LINKEDIN_BOOST_CONFIG.IS_FREE_PERIOD) return true;
  
  return LINKEDIN_BOOST_CONFIG.FREE_FEATURES[feature];
};

export const getPremiumFeatures = () => {
  return LINKEDIN_BOOST_CONFIG.PREMIUM_FEATURES;
};