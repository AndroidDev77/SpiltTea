# Future TODOs

Features and improvements to implement later.

## Image Upload Improvements
- [ ] Add server-side validation (file type, size limits)
- [ ] Use signed download URLs instead of public S3 URLs
- [ ] Implement cleanup logic for orphaned files
- [ ] Add CloudFront CDN for better performance
- [ ] Add image processing (resize, optimize) via Lambda
- [ ] Add virus scanning for uploads

## Post Tags
- [ ] Update backend CreatePostDto to accept tags
- [ ] Create tags if they don't exist when creating a post
- [ ] Link posts to tags via PostTag junction table
- [ ] Add tag filtering/search on frontend
- [ ] Display tags on post cards and detail pages
