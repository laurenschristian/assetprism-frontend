# AssetPrism Frontend

Modern, enterprise-grade IT Asset Management (ITAM) system frontend built with React, TypeScript, and Supabase.

## 🚀 Features

- **Modern UI/UX**: Built with shadcn/ui components and Tailwind CSS
- **Real-time Updates**: Live asset tracking and compliance monitoring
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Role-based Access**: Multi-tenant architecture with granular permissions
- **Advanced Search**: Full-text search across all asset types
- **Compliance Dashboard**: Real-time compliance monitoring and alerts

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Zustand
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel/Netlify

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/assetprism-frontend.git
cd assetprism-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## 🔧 Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   ├── assets/         # Asset management components
│   └── software/       # Software license components
├── hooks/              # Custom React hooks
├── lib/               # Utilities and configurations
├── pages/             # Page components
├── services/          # API service functions
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## 🔐 Authentication

The application uses Supabase Authentication with support for:
- Email/Password authentication
- OAuth providers (Google, Microsoft)
- Role-based access control (RBAC)
- Multi-tenant organization support

## 📱 Features Overview

### Asset Management
- Hardware asset tracking
- Software license management
- Asset lifecycle management
- Bulk import/export
- Asset relationships

### Compliance & Reporting
- Real-time compliance monitoring
- License usage tracking
- Expiration alerts
- Custom reports
- Audit trails

### User Management
- Role-based permissions
- Organization management
- User assignment workflows
- Activity monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
