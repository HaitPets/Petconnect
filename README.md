# MoPets - Pet Community Mobile App

A comprehensive mobile app for pet owners, lovers, and breeders to connect, share resources, and manage subscriptions.

## 🐕 Overview

MoPets is a mobile-first community platform built with Adalo that brings together pet enthusiasts with features including:

- **User Profiles & Authentication** - Role-based access (Pet Owner, Pet Lover, Breeder)
- **Community Feed** - Share posts, photos, and breed-specific content
- **Breeder Tools** - Litter management and puppy listings
- **Marketplace** - Pet supplies and puppy sales
- **Premium Subscriptions** - Tiered access via Stripe integration
- **Breed-Specific Visuals** - French Bulldog, Cane Corso, Premium Breed Trio themes

## 🎯 Target Audience

- **Pet Owners** - Share experiences, find resources, connect with community
- **Pet Lovers** - Discover breeds, follow favorite content, engage with community
- **Breeders** - Manage litters, list puppies, access professional tools

## 💰 Subscription Tiers

- **Free** ($0/month) - Basic community access
- **Premium** ($9.99/month) - Ad-free experience, exclusive content
- **Breeder** ($19.99/month) - Full breeder tools, premium listings

## 🏗️ Project Structure

```
/docs/           - Project documentation
/assets/         - Visual assets and branding
/database/       - Database schema and structure
/features/       - Feature specifications
/marketing/      - Marketing materials and strategies
/testing/        - Testing plans and procedures
```

## 🚀 Getting Started

### Quick Setup
```bash
# Clone the repository
git clone <repository-url>
cd mopets-app

# Run automated setup
./scripts/setup.sh

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Set up database
npx prisma migrate dev

# Start development server
npm run dev
```

### Manual Setup
1. **Install Dependencies**: `npm install`
2. **Environment Setup**: Copy `.env.example` to `.env` and configure
3. **Database Setup**: Run `npx prisma migrate dev`
4. **Start Development**: Run `npm run dev`

See `/docs/setup-guide.md` for detailed instructions.

## 📱 Key Features

### Core Features
- User authentication with role selection
- Community feed with breed filtering
- Direct messaging system
- Push notifications
- Stripe payment integration

### Breeder-Specific Features
- Litter tracking and management
- Puppy listing creation
- Weight and vaccination tracking
- Premium listing visibility

### Marketplace Features
- Pet supply listings
- Puppy sales platform
- Secure Stripe checkout
- Category-based filtering

## 🎨 Design Theme

- **Primary Colors**: Browns (#8B4513), Golds (#DAA520)
- **Typography**: Montserrat font family
- **Visual Style**: Luxury pet aesthetic with warm, earthy tones
- **Featured Breeds**: French Bulldog, Cane Corso, English Bulldog

## 📋 Next Steps

1. Review the implementation guide in `/docs/`
2. Set up Adalo account and Stripe integration
3. Source or create breed-specific visual assets
4. Follow the 10-step implementation plan
5. Conduct beta testing with pet community members

## 🤝 Contributing

This project is designed for no-code development using Adalo. For custom features or integrations, consider hiring Adalo specialists from Upwork or Fiverr.

## 📄 License

Private project for MoPets app development.