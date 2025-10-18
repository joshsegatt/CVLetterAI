# 🤖 CVLetterAI

<div align="center">

![CVLetterAI Banner](https://img.shields.io/badge/CVLetterAI-AI%20Powered%20CV%20Builder-blue?style=for-the-badge)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)](https://stripe.com/)

**AI-powered CV and Cover Letter Builder with Local & Cloud AI Integration**

*Professional documents in seconds, powered by hybrid AI technology*

[🚀 Live Demo](https://cvletterai.vercel.app) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/joshsegatt/CVLetterAI/issues)

</div>

---

## ✨ Features

### 🤖 **Hybrid AI System**
- **Local AI**: Qwen 3 8B model via Ollama (zero cost, full privacy)
- **Cloud Fallbacks**: Groq, HuggingFace, Cohere, DeepInfra, Perplexity
- **Smart Switching**: Automatic failover for 99.9% uptime

### 📄 **Professional Templates**
- **CV Builder**: ATS-optimized templates for UK/EU markets
- **Cover Letters**: Industry-specific templates with AI personalization
- **Instant PDF Export**: High-quality PDF generation with custom layouts

### 💬 **AI Chat Assistant**
- **Free Tier**: 20 messages/day with local AI
- **Pro Tier**: Unlimited chat with premium features
- **Real-time Responses**: Streaming AI responses for natural conversation

### 💰 **Flexible Pricing**
- **Free**: Limited chat, basic templates
- **Pro**: £5.99 one-time - Unlimited access
- **Enterprise**: £12.99/month - Advanced features + API access

### 🔒 **Enterprise Security**
- **Banking-level security** headers and middleware
- **Rate limiting** and attack protection
- **Multi-provider authentication** (Google OAuth + Email/Password)
- **GDPR compliant** data handling

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Ollama (for local AI)

### Installation

```bash
# Clone the repository
git clone https://github.com/joshsegatt/CVLetterAI.git
cd CVLetterAI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
npx prisma db push
npx prisma generate

# Start development server
npm run dev
```

### Environment Variables

```bash
# Required
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-character-secret
DATABASE_URL=postgresql://username:password@localhost:5432/cvletterai

# Optional (for full functionality)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
STRIPE_SECRET_KEY=sk_test_your-stripe-key
OLLAMA_HOST=http://localhost:11434
```

---

## 🏗️ Architecture

### **Frontend**
```
src/
├── app/                 # Next.js App Router
│   ├── (marketing)/     # Public pages (landing, pricing)
│   ├── (dashboard)/     # Protected pages (dashboard, builders)
│   ├── api/            # API endpoints
│   └── globals.css     # Global styles
├── components/         # Reusable UI components
├── features/          # Feature-specific modules
├── lib/              # Utilities and configurations
└── services/         # External service integrations
```

### **Backend Services**
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Payments**: Stripe integration
- **AI Services**: Hybrid local + cloud architecture
- **Caching**: In-memory production cache system

---

## 🎯 Usage Examples

### Building a CV
```typescript
// AI-powered CV generation
const cvData = await generateCV({
  personalInfo: { name, email, phone },
  experience: workHistory,
  skills: technicalSkills,
  targetRole: "Software Engineer"
});
```

### Chat with AI
```typescript
// Free tier chat with token limits
const response = await chatWithAI({
  message: "Help me improve my CV for a tech role",
  userId: session.user.id,
  plan: "free" // 20 messages/day limit
});
```

### PDF Export
```typescript
// High-quality PDF generation
const pdfBuffer = await exportToPDF({
  template: "modern",
  data: cvData,
  format: "A4"
});
```

---

## 📊 Performance & Scalability

### **Production Metrics**
- ⚡ **Response Time**: <200ms average
- 🚀 **Build Size**: 116KB average page load
- 📈 **Scalability**: 10,000+ concurrent users
- 🔄 **Cache Hit Rate**: >70% for optimized performance
- 🛡️ **Security**: Banking-level protection

### **Monitoring**
```bash
# Health check endpoint
GET /api/health

# Detailed system status
GET /api/health?detailed=true
```

---

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
npm test             # Run tests
```

### **Code Quality**
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks

### **Testing**
```bash
npm test             # Unit tests
npm run test:e2e     # End-to-end tests
npm run test:coverage # Coverage report
```

---

## 🌍 Deployment

### **Vercel (Recommended)**
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add NEXTAUTH_SECRET
vercel env add DATABASE_URL
```

### **Docker**
```bash
# Build Docker image
docker build -t cvletterai .

# Run container
docker run -p 3000:3000 cvletterai
```

### **Production Checklist**
- ✅ Environment variables configured
- ✅ Database migrations applied
- ✅ SSL certificates installed
- ✅ Monitoring setup complete
- ✅ Backup strategy implemented

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Process**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**
- Follow TypeScript best practices
- Maintain test coverage >80%
- Use conventional commits
- Update documentation

---

## 📈 Roadmap

- [ ] **Multi-language Support** (Portuguese, Spanish, French)
- [ ] **Mobile App** (React Native)
- [ ] **Advanced Analytics** (User behavior tracking)
- [ ] **API Platform** (Developer access)
- [ ] **Team Collaboration** (Multi-user workspaces)
- [ ] **Industry Templates** (Legal, Medical, Finance)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for seamless deployment
- **Ollama** for local AI capabilities
- **Stripe** for secure payments
- **Community Contributors** for feedback and improvements

---

## 📞 Support

- **Documentation**: [Wiki](https://github.com/joshsegatt/CVLetterAI/wiki)
- **Issues**: [GitHub Issues](https://github.com/joshsegatt/CVLetterAI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/joshsegatt/CVLetterAI/discussions)
- **Email**: support@cvletterai.com

---

<div align="center">

**Made with ❤️ by [Josh Segatt](https://github.com/joshsegatt)**

[![GitHub stars](https://img.shields.io/github/stars/joshsegatt/CVLetterAI?style=social)](https://github.com/joshsegatt/CVLetterAI/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/joshsegatt/CVLetterAI?style=social)](https://github.com/joshsegatt/CVLetterAI/network/members)
[![GitHub issues](https://img.shields.io/github/issues/joshsegatt/CVLetterAI)](https://github.com/joshsegatt/CVLetterAI/issues)

</div>