# MoPets App Setup Guide

## 🚀 Quick Start

This guide will help you set up and run the MoPets mobile app locally.

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Stripe account (for payments)
- Cloudinary account (for image hosting)

## 🛠️ Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd mopets-app
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `STRIPE_PUBLISHABLE_KEY` & `STRIPE_SECRET_KEY`: From Stripe dashboard
   - `CLOUDINARY_*`: From Cloudinary account

3. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create three products:
   - Premium: $9.99/month
   - Breeder Pro: $19.99/month
3. Copy the price IDs to your `.env` file

### Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and secret
3. Configure upload presets for different image types

### Database Schema

The app uses PostgreSQL with Prisma ORM. Key models:
- `User`: User accounts with roles (PET_OWNER, PET_LOVER, BREEDER)
- `Post`: Community posts with breed filtering
- `Litter`: Breeder litter management
- `PuppyListing`: Marketplace puppy listings
- `MarketplaceItem`: General marketplace items
- `Message`: User messaging system
- `Subscription`: Stripe subscription management

## 🎨 Design System

### Colors
- **Primary**: Browns (#8b4513 family)
- **Gold**: Accent colors (#daa520 family)
- **Breed Accents**: 
  - French Bulldog: #d4a574
  - Cane Corso: #5d4e37
  - Luxury: #f4e4bc

### Typography
- **Font**: Montserrat (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900

## 📱 Mobile Features

### PWA Support
- Installable on mobile devices
- Offline functionality
- Push notifications
- Native app-like experience

### Mobile Navigation
- Bottom tab bar design
- Touch-optimized interactions
- Safe area support for notched devices

## 🔐 Authentication

Uses NextAuth.js with:
- Email/password authentication
- Social login support (Google, Facebook)
- Role-based access control
- Session management

## 💳 Payment Integration

### Stripe Features
- Subscription management
- One-time payments for marketplace
- Webhook handling for subscription events
- Customer portal for self-service

### Subscription Tiers
1. **Free** ($0): Basic community access
2. **Premium** ($9.99/month): Ad-free, premium content
3. **Breeder Pro** ($19.99/month): Professional tools

## 📸 Image Management

### Cloudinary Integration
- Automatic image optimization
- Multiple format support (WebP, AVIF)
- Responsive image delivery
- Upload widgets for user content

### Image Categories
- Profile pictures
- Post images
- Puppy photos
- Marketplace item images
- Breed showcase images

## 🔔 Real-time Features

### Socket.IO Integration
- Real-time messaging
- Live notifications
- Activity updates
- Presence indicators

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Environment Variables for Production
```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL=your-production-db-url
# ... other production configs
```

## 📊 Analytics & Monitoring

### Recommended Tools
- **Analytics**: Google Analytics 4
- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics
- **User Feedback**: Hotjar

## 🔧 Customization

### Adding New Breeds
1. Update `BreedType` enum in `prisma/schema.prisma`
2. Add breed-specific colors in `tailwind.config.js`
3. Create breed showcase components
4. Add breed images to public folder

### Custom Features
- Extend database schema with new models
- Add API routes in `app/api/`
- Create new components in `components/`
- Update navigation in `MobileNav.tsx`

## 🐛 Troubleshooting

### Common Issues

**Database Connection**
```bash
# Reset database
npx prisma migrate reset
npx prisma generate
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Stripe Webhooks**
```bash
# Test webhooks locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

Private project for MoPets development.