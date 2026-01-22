# Future TODOs

Features and improvements to implement later.

## Image Upload Improvements
- [ ] Add server-side validation (file type, size limits)
- [ ] Use signed download URLs instead of public S3 URLs
- [ ] Implement cleanup logic for orphaned files
- [ ] Add CloudFront CDN for better performance
- [ ] Add image processing (resize, optimize) via Lambda
- [ ] Add virus scanning for uploads

## Trending Posts Performance
- [ ] Add Redis caching for trending posts (5-minute TTL)
- [ ] Reduce initial fetch from 100 to 50 posts
- [ ] Add database index on (isPublished, createdAt, viewCount)
- [ ] Extract trending algorithm magic numbers to config constants
- [ ] Add error handling with proper NestJS Logger

## Post Tags
- [ ] Update backend CreatePostDto to accept tags
- [ ] Create tags if they don't exist when creating a post
- [ ] Link posts to tags via PostTag junction table
- [ ] Add tag filtering/search on frontend
- [ ] Display tags on post cards and detail pages
