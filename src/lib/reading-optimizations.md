# Reading Module Optimizations

This document outlines the backend optimizations implemented for the Reading module.

## Key Optimizations

### 1. Code Organization and DRY Improvements

- **Centralized Utility Functions**: Moved helper functions to `reading-utils.ts`:
  - Error handling with `handleApiError()`
  - Object ID validation with `isValidObjectId()`
  - CEFR level score calculation with `getReadingLevelScore()` and `getReadingComplexityScore()`
  - Cache management with `getCacheHeaders()`, `getCachedItem()`, and `setCacheItem()`

### 2. API Route Optimizations

- **Improved Error Handling**:

  - Standardized error responses across all endpoints
  - Added detailed error messages with proper HTTP status codes
  - Implemented graceful degradation for partial failures

- **Performance Enhancements**:

  - Added in-memory caching for reading sessions and stats
  - Implemented `.lean()` queries for better MongoDB performance
  - Added proper pagination with validation for list endpoints
  - Used cache headers for GET requests to improve client-side caching
  - Changed default pagination from 10 to 8 items per page for better UI display

- **Query Optimization**:
  - Replaced multiple queries with `Promise.all()` for parallel execution
  - Added proper field projection to reduce data transfer
  - Implemented smarter data retrieval logic to minimize database calls

### 3. Resource Management

- **Memory Usage Optimization**:

  - Added cleanup for cached data to prevent memory leaks
  - Implemented request throttling to prevent duplicate content generation
  - Added `Promise.allSettled()` to handle partial failures gracefully

- **API Call Improvements**:
  - Reduced OpenAI timeout to 45 seconds to prevent edge function timeouts
  - Added retry logic for API calls
  - Implemented proper error recovery for generation steps

### 4. Security Improvements

- **Input Validation**:

  - Added MongoDB ObjectId validation
  - Implemented better parameter validation
  - Added explicit permission checks for all data operations

- **Resource Control**:
  - Added limits for question counts
  - Implemented max/min validations for pagination parameters
  - Restricted update fields explicitly

### 5. Content Generation Improvements

- **Standardized Length Calculation**:

  - Fixed inconsistent handling of the `targetLength` parameter
  - Recalibrated base word counts for all CEFR levels (A1-C2)
  - Defined clear categories: "short", "medium", and "long" with appropriate multipliers
  - Added strict word count requirements in AI prompts to ensure consistent results

- **Parameter Validation**:
  - Added proper validation for `targetLength` values
  - Improved error messages for invalid parameters
  - Implemented graceful fallbacks to default values when necessary

### 6. Bug Fixes

- **Reading Time Calculation**:
  - Fixed incorrect reading time calculation that was showing 75 minutes for a ~250 word article
  - Removed erroneous multiplication by 60 in `src/app/api/reading/sessions/route.ts`
  - Standardized reading time calculation across all endpoints
  - Reading times now use industry standard of ~200 words per minute

## Implementation Details

### New Files Created

- `src/lib/reading-utils.ts`: Centralized utility functions for the Reading module

### Files Optimized

1. `src/app/api/reading/route.ts`: Main reading API endpoint

   - Added proper pagination
   - Implemented caching
   - Improved error handling

2. `src/app/api/reading/[id]/route.ts`: Individual reading session endpoint

   - Added data ownership validation
   - Implemented better update field restrictions
   - Added caching with proper cache invalidation

3. `src/app/api/reading/stats/route.ts`: Reading statistics endpoint

   - Optimized database queries
   - Improved calculation efficiency
   - Added caching for expensive calculations

4. `src/app/api/reading/generate/unified/route.ts`: Content generation endpoint

   - Added request deduplication
   - Implemented content caching
   - Added graceful degradation for partial failures
   - Fixed content length calculation and improved parameter handling

5. `src/app/api/reading/sessions/route.ts`: Reading sessions endpoint
   - Fixed reading time calculation
   - Improved error handling

## Performance Impact

These optimizations should result in:

1. **Faster API Response Times**: Through caching, lean queries, and better error handling
2. **Reduced Server Load**: By eliminating duplicate requests and optimizing database access
3. **More Reliable Operation**: Through better error recovery and graceful degradation
4. **Improved Scalability**: Through better resource management and caching
5. **Consistent Content Length**: More predictable article lengths based on user selection
6. **Accurate Reading Times**: Correctly calculated reading times based on word count

All optimizations maintain full backward compatibility with existing frontend code and preserve all functionality without any UI changes.

## Word Count Reference Guide

The updated word count calculation uses the following guidelines:

| CEFR Level | Short | Medium | Long |
| ---------- | ----- | ------ | ---- |
| A1         | 90    | 150    | 225  |
| A2         | 120   | 200    | 300  |
| B1         | 150   | 250    | 375  |
| B2         | 180   | 300    | 450  |
| C1         | 240   | 400    | 600  |
| C2         | 300   | 500    | 750  |

Each article length has a tolerance of ±10% to allow for natural language flow.

## Reading Time Calculation

Reading times are now consistently calculated across all endpoints using the following formula:

```javascript
const estimatedReadingTime = Math.ceil(wordCount / 200); // Average reading speed of 200 words per minute
```

This means:

- A 200-word article should take approximately 1 minute to read
- A 500-word article should take approximately 3 minutes to read
- A 1000-word article should take approximately 5 minutes to read
