# Email Setup Guide for Fluenta

This guide will help you set up the email functionality for password reset and email verification in your Fluenta application.

## Prerequisites

- A custom domain email account (recommended) OR a Gmail account
- Access to your environment variables file

## Step 1: Choose Your Email Provider

### Option A: GoDaddy Email (Recommended for Production)

If you have a custom domain email from GoDaddy (like `info@fluenta-ai.com`):

1. **Get Your Email Credentials**:

   - Email address: `info@fluenta-ai.com`
   - Password: Your email account password
   - SMTP Server: `smtpout.secureserver.net`
   - Port: `465` (SSL) or `587` (TLS)

2. **Add Environment Variables**:

   ```env
   # GoDaddy Email Configuration
   EMAIL_PROVIDER="godaddy"
   EMAIL_HOST="smtpout.secureserver.net"
   EMAIL_PORT="465"
   EMAIL_USERNAME="info@fluenta-ai.com"
   EMAIL_PASSWORD="your-email-password"

   # NextAuth URL (required for email links)
   NEXTAUTH_URL="http://localhost:3000"
   ```

### Option B: Gmail (For Development/Testing)

If you want to use Gmail for development:

1. **Enable 2-Step Verification**:

   - Go to your [Google Account settings](https://myaccount.google.com/)
   - Navigate to "Security" → "2-Step Verification"
   - Follow the setup process to enable 2-Step Verification

2. **Generate App Password**:

   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app
   - Select "Other" as the device and name it "Fluenta" or your app name
   - Click "Generate"
   - **Save the 16-character password** - you'll need this for your environment variables

3. **Add Environment Variables**:

   ```env
   # Gmail Configuration (fallback)
   EMAIL_PROVIDER="gmail"
   EMAIL_USERNAME="your-email@gmail.com"
   EMAIL_PASSWORD="your-app-password-here"

   # NextAuth URL (required for email links)
   NEXTAUTH_URL="http://localhost:3000"
   ```

## Step 2: Test the Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Try the forgot password functionality:
   - Go to `/login`
   - Click "Forgot your password?"
   - Enter an email address of an existing user
   - Check if the email is received

## Benefits of Using Custom Domain Email

### ✅ **Advantages of info@fluenta-ai.com:**

- **Professional Appearance**: Users trust emails from official domains
- **Better Deliverability**: Less likely to be marked as spam
- **No Daily Limits**: Unlike Gmail's 100-500 emails/day restriction
- **Brand Recognition**: Builds trust and credibility
- **Custom Branding**: Complete control over sender identity

### ⚠️ **Gmail Limitations:**

- Emails often go to spam folder
- Daily sending limits (100-500 emails)
- Less professional appearance
- May be blocked by some email providers

## Features Implemented

### 1. Forgot Password Flow

- User enters email on `/forgot-password`
- System generates secure reset token
- Email sent with reset link from `info@fluenta-ai.com`
- User clicks link to go to `/reset-password?token=...`
- User enters new password
- Password is updated and user redirected to login

### 2. Email Verification (Registration)

- New users receive verification email upon registration
- Email sent from `info@fluenta-ai.com`
- Email contains verification link
- Users can verify their email address

### 3. Security Features

- Tokens expire after 1 hour (password reset) or 24 hours (email verification)
- Secure token generation using crypto.randomBytes
- Email enumeration protection (same response for existing/non-existing emails)
- Password hashing with bcrypt

## Email Templates

The system includes beautiful HTML email templates with:

- Responsive design
- Fluenta branding
- Clear call-to-action buttons
- Fallback text versions
- Professional "From: Fluenta <info@fluenta-ai.com>" header

## Troubleshooting

### GoDaddy Email Issues

**SSL Certificate Errors ("self-signed certificate in certificate chain"):**

Try these configurations in order:

**Configuration 1 (Current - SSL Port 465):**

```env
EMAIL_PROVIDER="godaddy"
EMAIL_HOST="smtpout.secureserver.net"
EMAIL_PORT="465"
EMAIL_USERNAME="info@fluenta-ai.com"
EMAIL_PASSWORD="your-email-password"
```

**Configuration 2 (Alternative - TLS Port 587):**

```env
EMAIL_PROVIDER="godaddy"
EMAIL_HOST="smtpout.secureserver.net"
EMAIL_PORT="587"
EMAIL_USERNAME="info@fluenta-ai.com"
EMAIL_PASSWORD="your-email-password"
```

**Configuration 3 (Relay Server):**

```env
EMAIL_PROVIDER="godaddy"
EMAIL_HOST="relay-hosting.secureserver.net"
EMAIL_PORT="25"
EMAIL_USERNAME="info@fluenta-ai.com"
EMAIL_PASSWORD="your-email-password"
```

**Authentication Errors:**

- Verify your email password is correct
- Ensure the email account is active
- Check if 2FA is enabled on your GoDaddy account

**Connection Issues:**

- Try port 587 instead of 465 if having SSL issues
- Check your firewall/network settings
- Verify the SMTP server address: `smtpout.secureserver.net`

**Email Not Sending:**

- Check your environment variables are loaded correctly
- Verify your internet connection
- Check the server logs for detailed error messages
- Test with a simple email first

### Gmail Issues (if using Gmail)

**Authentication Errors:**

- Double-check your Gmail username and app password
- Ensure 2-Step Verification is enabled
- Make sure you're using the app password, not your regular password
- Try generating a new app password

**Emails Going to Spam:**

- Use clear, non-spammy subject lines
- Test with your own email first
- Keep sending volume low (Gmail limits: 100-500 emails/day)

## Production Considerations

For production use with custom domain email:

1. **DNS Records**: Ensure your domain has proper MX records
2. **SPF Record**: Add SPF record to improve deliverability
3. **DKIM**: Set up DKIM signing if available
4. **Rate Limiting**: Implement rate limiting for password reset requests
5. **Monitoring**: Monitor email delivery rates and bounce rates

## Alternative Free Email Services

If you need more reliable delivery or higher limits:

- **SendGrid**: 100 emails/day free
- **Mailgun**: 5,000 emails/month free for 3 months
- **AWS SES**: 62,000 emails/month free (if hosted on AWS)
- **Resend**: 3,000 emails/month free

## Support

If you encounter issues:

1. Check the server console for error messages
2. Verify all environment variables are set correctly
3. Test with a simple email first
4. Check your email provider's SMTP settings
5. For GoDaddy: Contact GoDaddy support if needed

**Recommended Setup:** Use `info@fluenta-ai.com` for the best professional experience!
