# OAuth Integration Setup

This document explains how to set up Google OAuth for the Fluenta app.

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration (if not already set)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Setup Steps

### 1. Google OAuth Setup

#### Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google+ API (legacy) or Google OAuth2 API

#### Configure OAuth Consent Screen

1. Go to APIs & Services > OAuth consent screen
2. Choose "External" user type
3. Fill in required information:
   - App name: "Fluenta AI"
   - User support email: your email
   - Developer contact: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users if needed for development

#### Create OAuth Credentials

1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
5. Copy Client ID and Client Secret to environment variables

### 2. NextAuth Secret

Generate a secure random string for NextAuth:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## OAuth User Flow

### 1. User Registration

- User clicks Google login
- OAuth provider authenticates user
- User is created in database with:
  - `emailVerified: true` (OAuth emails are pre-verified)
  - `provider: "google"`
  - `providerId: oauth_account_id`
  - 14-day free trial subscription
  - Default "user" role

### 2. Onboarding Flow

OAuth users go through the same 5-step onboarding as regular users:

1. **Native Language Selection**
2. **Learning Schedule Preferences**
3. **Learning Goals**
4. **Discovery Source**
5. **Privacy & Consent**

### 3. School Integration

- OAuth users can join schools during or after onboarding
- Use `/api/user/join-school` endpoint with school code
- Same branch/school system as credentials users

### 4. Subscription Management

- OAuth users follow same Stripe subscription flow
- Same pricing and billing portal access
- 14-day free trial period

## Security Considerations

### Session Management

- OAuth users get same concurrent login protection
- Session tokens created for device tracking
- Force login functionality preserved

### Data Privacy

- OAuth users' emails are pre-verified
- Profile information from OAuth providers stored
- Same GDPR compliance as credentials users

### Password Handling

- OAuth users don't have passwords in database
- `comparePassword` method returns false for OAuth users
- Password reset not applicable for OAuth users

## Testing

### Development Testing

1. Use OAuth provider test accounts
2. Test Google OAuth flow
3. Verify school joining functionality
4. Test subscription upgrades

### Production Checklist

- [ ] Update OAuth redirect URIs to production domain
- [ ] Test OAuth flows on production
- [ ] Verify email deliverability (though less critical for OAuth)
- [ ] Monitor OAuth user analytics

## Troubleshooting

### Common Issues

**"redirect_uri_mismatch" Error**

- Check that redirect URIs match exactly in OAuth provider settings
- Ensure using correct domain (localhost vs production)

**OAuth User Creation Fails**

- Check database connection
- Verify User model includes provider fields
- Check server logs for detailed errors

**Session Issues**

- Verify NEXTAUTH_SECRET is set
- Check that session strategy is "jwt"
- Ensure cookies are working

### Monitoring

Track OAuth registration success rates:

```typescript
// In your analytics
trackEvent("oauth_registration", "success", provider); // google
trackEvent("oauth_login", "success", provider);
```

## Migration Notes

### Existing Users

- Existing credentials users can link OAuth accounts
- OAuth provider info gets added to existing user records
- Email must match for account linking

### Database Changes

User model now includes:

- `provider?: string` - "google" or "credentials"
- `providerId?: string` - OAuth account ID
- `password?: string` - Optional for OAuth users

## Benefits of OAuth Integration

### For Users

- ✅ Faster registration (no email verification needed)
- ✅ Secure authentication via trusted providers
- ✅ No password to remember
- ✅ Full personalized learning experience through complete onboarding

### For Business

- ✅ Higher conversion rates (reduced friction)
- ✅ Better user data quality
- ✅ Reduced support tickets (no password resets)
- ✅ Integration with existing subscription system
