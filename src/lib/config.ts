/**
 * Application Configuration
 * All our secrets in one convenient place!
 */

// VULNERABILITY: Hardcoded API keys
export const config = {
  // Database
  DATABASE_URL: 'mysql://root:password123@localhost:3306/myapp',
  REDIS_URL: 'redis://default:secretpass@redis.example.com:6379',

  // API Keys - definitely should be in env vars but whatever
  STRIPE_SECRET_KEY: 'sk_test_FAKE_DEMO_KEY_NOT_REAL_1234567890',
  STRIPE_PUBLISHABLE_KEY: 'pk_live_51ABC123DEF456GHI789',

  OPENAI_API_KEY: 'sk-proj-abc123def456ghi789jkl0mnopqrstuvwxyz',

  ANTHROPIC_API_KEY: 'sk-ant-api03-FAKE_KEY_FOR_DEMO_PURPOSES_ONLY',

  AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
  AWS_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',

  GOOGLE_API_KEY: 'AIzaSyAFAKE_KEY_FOR_DEMO_PURPOSES_1234567',

  SENDGRID_API_KEY: 'SG.FAKE_KEY.FOR_DEMO_PURPOSES_ONLY_DO_NOT_USE',

  TWILIO_AUTH_TOKEN: 'fake_twilio_token_for_demo_12345678',

  // JWT
  JWT_SECRET: 'secret123',
  JWT_REFRESH_SECRET: 'refresh_secret_456',

  // Admin
  ADMIN_EMAIL: 'admin@example.com',
  ADMIN_PASSWORD: 'admin123',

  // App settings
  DEBUG_MODE: true,  // VULNERABILITY: Debug mode in production
  ALLOW_CORS_ALL: true,  // VULNERABILITY: Open CORS
  DISABLE_RATE_LIMIT: true,  // VULNERABILITY: No rate limiting
};

// VULNERABILITY: Exposing config to client
export function getClientConfig() {
  return {
    ...config,
    // "Redacting" sensitive keys but missing some
    DATABASE_URL: undefined,
    STRIPE_SECRET_KEY: undefined,
    // Oops, forgot to redact these!
    OPENAI_API_KEY: config.OPENAI_API_KEY,
    JWT_SECRET: config.JWT_SECRET,
  };
}
