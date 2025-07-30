# OndoSoft - Modern Business Website

A professional, responsive business website built with React and Vite, featuring modern design and smooth user experience.

## 🚀 Features

- **Modern Design**: Clean, professional interface with gradient accents
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Smooth Navigation**: React Router with smooth scrolling to sections
- **Component-Based Architecture**: Modular, reusable components
- **Tailwind CSS**: Utility-first styling for consistent design
- **Performance Optimized**: Fast loading with Vite build tool

## 📋 Sections

- **Hero Section**: Compelling landing with call-to-action
- **Products**: Showcase your products and services
- **Services**: Detailed service offerings
- **Workflow**: Process and methodology explanation
- **Pricing**: Transparent pricing plans
- **Testimonials**: Customer reviews and feedback
- **Contact**: Get in touch form and information
- **Footer**: Additional links and company information

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React & React Icons
- **Development**: ESLint, PostCSS, Autoprefixer

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Ondowebsite
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Build Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Contact.jsx
│   ├── Footer.jsx
│   ├── HeroSection.jsx
│   ├── Navbar.jsx
│   ├── Pricing.jsx
│   ├── Products.jsx
│   ├── Services.jsx
│   ├── Testimonials.jsx
│   └── Workflow.jsx
├── assets/             # Static assets
│   ├── illustrations/
│   ├── profile-pictures/
│   └── videos/
├── constants/          # Data and constants
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## 🎨 Customization

### Styling
- Modify Tailwind classes in components for design changes
- Update color scheme in `tailwind.config.js`
- Customize gradients and animations

### Content
- Edit component content directly in JSX files
- Update images in `src/assets/` directory
- Modify routing in `App.jsx`

### Configuration
- Update `package.json` for project metadata
- Modify `vite.config.js` for build settings
- Adjust `postcss.config.js` for CSS processing

## 🌐 Deployment

The project is ready for deployment on various platforms:

- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after build
- **GitHub Pages**: Use the `gh-pages` package
- **Traditional Hosting**: Upload the `dist` folder to your server

## 📝 License

This project is private and proprietary to OndoSoft.

## 🤝 Contributing

This is a private project. For internal contributions, please follow the established coding standards and component patterns.

---

Built with ❤️ using React and Vite
