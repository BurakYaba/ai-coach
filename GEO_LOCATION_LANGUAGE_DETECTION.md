# Geolocation-Based Language Detection

This document explains how Fluenta implements automatic language detection based on user geolocation.

## Overview

Fluenta automatically detects the user's country and serves the appropriate language version:

- **Users from Turkey**: See the Turkish version (root path `/`)
- **Users from all other countries**: See the English version (`/en`)

## How It Works

### 1. Server-Side Detection (Middleware)

The primary detection happens in `src/middleware.ts` using Next.js middleware:

```typescript
// Geolocation-based language detection for root path
if (pathname === "/") {
  const country =
    request.geo?.country ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country");

  // Check if user is from Turkey
  if (country === "TR") {
    // User is from Turkey, serve Turkish version (current root)
    return NextResponse.next();
  } else {
    // User is from any other country, redirect to English version
    const url = new URL("/en", request.url);
    return NextResponse.redirect(url);
  }
}
```

### 2. Geolocation Data Sources

The system checks multiple sources for geolocation data:

1. **Vercel Edge Runtime**: `request.geo?.country`
2. **Cloudflare**: `cf-ipcountry` header
3. **Vercel**: `x-vercel-ip-country` header

### 3. Fallback Strategy

If geolocation detection fails, the system falls back to:

1. **Browser language preference**
2. **User's saved language preference** (localStorage)
3. **Default language** (English)

## Implementation Details

### File Structure

```
src/
├── middleware.ts                    # Main geolocation detection
├── lib/
│   └── language-detection.ts        # Utility functions
├── hooks/
│   └── use-language-detection.ts    # React hook
├── components/
│   └── language-switcher.tsx        # Manual language switcher
└── app/
    └── api/
        └── geolocation/
            └── route.ts             # Geolocation API endpoint
```

### Key Components

#### 1. Middleware (`src/middleware.ts`)

Handles automatic redirection based on geolocation:

- Detects user's country from request headers
- Redirects Turkish users to root path (`/`)
- Redirects all other users to English path (`/en`)
- Skips detection for exempt paths (API, dashboard, etc.)

#### 2. Language Detection Utilities (`src/lib/language-detection.ts`)

Provides utility functions for language detection:

- `detectPreferredLanguage()`: Determines language based on country
- `getLanguagePath()`: Generates language-specific URLs
- `shouldSkipLanguageDetection()`: Checks if path should skip detection
- `extractGeolocationData()`: Extracts geo data from headers

#### 3. React Hook (`src/hooks/use-language-detection.ts`)

Client-side language detection hook:

- Detects language on component mount
- Handles browser language preferences
- Manages localStorage for user preferences
- Provides language switching functionality

#### 4. Language Switcher (`src/components/language-switcher.tsx`)

Manual language switching component:

- Dropdown menu for language selection
- Updates URL and localStorage
- Two variants: default and minimal

#### 5. Geolocation API (`src/app/api/geolocation/route.ts`)

Provides geolocation data to client:

- Extracts geo data from request headers
- Returns country, region, city, and IP information
- Used by client-side language detection

## URL Structure

### Turkish Version (Turkey)

- **Root**: `https://www.fluenta-ai.com/`
- **Pages**: `https://www.fluenta-ai.com/hakkimizda`
- **Blog**: `https://www.fluenta-ai.com/blog`

### English Version (All Other Countries)

- **Root**: `https://www.fluenta-ai.com/en`
- **Pages**: `https://www.fluenta-ai.com/en/about`
- **Blog**: `https://www.fluenta-ai.com/en/blog`

## Exempt Paths

The following paths skip geolocation detection:

- `/api/*` - API routes
- `/dashboard/*` - User dashboard
- `/login`, `/register` - Authentication
- `/admin/*`, `/school-admin/*` - Admin panels
- `/onboarding` - User onboarding
- `/pricing`, `/profile` - Public pages
- Static files (images, CSS, JS, etc.)

## User Experience

### Automatic Detection

1. User visits `www.fluenta-ai.com`
2. System detects their country
3. Turkish users see Turkish content
4. All other users are redirected to `/en`

### Manual Override

1. Users can manually switch languages using the language switcher
2. Their preference is saved in localStorage
3. Future visits respect their saved preference

### Fallback Behavior

1. If geolocation fails, check browser language
2. If browser language is Turkish, serve Turkish version
3. Otherwise, default to English

## Testing

### Local Development

- Use VPN or proxy to test different countries
- Test with different browser language settings
- Verify localStorage persistence

### Production Testing

- Test from different geographical locations
- Verify redirect behavior for various countries
- Check that exempt paths work correctly

## SEO Considerations

### Hreflang Tags

The system includes proper hreflang tags in the HTML head:

```html
<link rel="alternate" hreflang="en" href="https://www.fluenta-ai.com/en" />
<link rel="alternate" hreflang="tr" href="https://www.fluenta-ai.com/" />
<link
  rel="alternate"
  hreflang="x-default"
  href="https://www.fluenta-ai.com/en"
/>
```

### Search Engine Crawlers

- Google and other search engines can access both language versions
- Proper canonical URLs are set for each language
- Sitemaps include both language versions

## Performance Considerations

### Caching

- Geolocation detection happens at the edge (Vercel/Cloudflare)
- Minimal performance impact
- Results are cached appropriately

### Fallback Strategy

- Quick fallback to browser language
- No blocking operations
- Graceful degradation

## Security and Privacy

### Data Collection

- Only country-level geolocation is used
- No precise location data is collected
- IP addresses are not stored

### User Control

- Users can manually override automatic detection
- Language preferences are stored locally
- No tracking of language choices

## Troubleshooting

### Common Issues

1. **Incorrect Language Detection**

   - Check VPN/proxy settings
   - Verify geolocation headers
   - Test with different IP addresses

2. **Redirect Loops**

   - Ensure exempt paths are properly configured
   - Check middleware logic
   - Verify URL structure

3. **Performance Issues**
   - Monitor middleware execution time
   - Check caching configuration
   - Optimize geolocation lookups

### Debug Information

Enable debug logging in middleware:

```typescript
console.log("Geolocation detection:", {
  country: request.geo?.country,
  headers: Object.fromEntries(request.headers.entries()),
  pathname,
});
```

## Future Enhancements

### Potential Improvements

1. **More Countries**: Support for additional languages
2. **Regional Detection**: City/region-based language selection
3. **Time-based Detection**: Language based on user's timezone
4. **Machine Learning**: Predict language preference based on behavior
5. **A/B Testing**: Test different detection strategies

### Monitoring

1. **Analytics**: Track language detection accuracy
2. **User Feedback**: Monitor language switching behavior
3. **Performance Metrics**: Monitor detection speed and accuracy
