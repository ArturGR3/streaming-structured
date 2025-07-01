# Frontend - Resume Parser Stream

React TypeScript frontend that displays streaming structured resume parsing with a beautiful professional resume template.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The app will be available at `http://localhost:3000`

## ✨ Features

- **Real-time Streaming** - See resume sections populate as data arrives
- **Professional Resume Template** - Beautiful, printable design
- **Responsive Layout** - Two-panel design that works on all devices
- **Progress Tracking** - Visual progress bar showing completion
- **Sample Resume** - Pre-loaded example for immediate testing
- **Error Handling** - User-friendly error messages
- **TypeScript** - Full type safety throughout the application

## 🏗️ Architecture

```
React App
├── Server-Sent Events (Streaming)
├── Professional Resume Template
├── Real-time Progress Tracking
├── TypeScript Interfaces
└── Responsive CSS Grid
```

## 📦 Dependencies

### Core Dependencies
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **@microsoft/fetch-event-source** - Robust Server-Sent Events client

### Development Dependencies
- **@types/react** - React type definitions
- **React Scripts** - Build tooling
- **Web Vitals** - Performance monitoring

## 🎨 Components

### `App.tsx`
Main application component containing:
- Resume input textarea with sample data
- Streaming logic with Server-Sent Events
- Progress tracking and error handling
- Two-panel responsive layout

### `ResumeTemplate.tsx`
Professional resume display component featuring:
- Real-time section population
- Color-coded sections (Work: Green, Education: Blue, Projects: Red, etc.)
- Streaming placeholders with pulse animations
- Print-ready layout

### `ResumeTemplate.css`
Comprehensive styling for:
- Professional resume design
- Streaming animations (fade-in, pulse effects)
- Responsive breakpoints
- Print optimization

## 🔄 Streaming Implementation

The frontend uses Server-Sent Events to receive real-time updates:

```typescript
await fetchEventSource('http://localhost:8000/parse-resume', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ text: resumeText }),
  onmessage(event) {
    const data = JSON.parse(event.data);
    setParsedResume(data);  // Update UI in real-time
    
    // Calculate progress based on completed sections
    const progress = calculateProgress(data);
    setProgress(progress);
  },
  onclose() {
    setIsStreaming(false);
    setProgress(100);
  },
  onerror(err) {
    setError('Connection error. Please try again.');
    setIsStreaming(false);
  }
});
```

## 📊 Progress Tracking

Progress is calculated based on completed resume sections:

```typescript
const totalFields = 7; // Total sections
let filledFields = 0;

if (data.contact_info?.name) filledFields++;
if (data.summary) filledFields++;
if (data.work_experience?.length > 0) filledFields++;
if (data.education?.length > 0) filledFields++;
if (data.projects?.length > 0) filledFields++;
if (data.skill_categories?.length > 0) filledFields++;
if (data.certification_and_training?.length > 0) filledFields++;

const progress = (filledFields / totalFields) * 100;
```

## 🎯 Resume Template Features

### Professional Design
- Clean, modern layout suitable for any industry
- Proper typography hierarchy
- Color-coded sections for visual organization
- Print-optimized styling

### Streaming Animations
- **Fade-in animations** when sections populate
- **Pulse effects** for loading placeholders
- **Smooth transitions** between states
- **Progress indicators** at section level

### Responsive Layout
```css
/* Desktop: Two-panel layout */
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* Mobile: Stacked layout */
@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
  }
}
```

## 🎨 Styling Approach

### CSS Variables
- Consistent color palette
- Easy theme customization
- Professional color scheme

### Component-Scoped CSS
- `App.css` - Application layout and controls
- `ResumeTemplate.css` - Resume-specific styling
- Modular and maintainable styles

### Professional Color Coding
- **Contact Info** - Blue gradient header
- **Summary** - Purple accent border
- **Work Experience** - Green left border
- **Education** - Blue backgrounds
- **Projects** - Red accents
- **Skills** - Purple skill tags
- **Certifications** - Yellow highlights

## 🔧 Configuration

### Environment Variables
```bash
# Backend API URL (for production)
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend Connection
The app connects to the FastAPI backend at:
- Development: `http://localhost:8000`
- Production: Uses `REACT_APP_API_URL` environment variable

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
```bash
# Build the app
npm run build

# Deploy dist/ folder to Netlify
# Set REACT_APP_API_URL environment variable
```

### Deploy to Vercel
```bash
# Connect GitHub repository to Vercel
# Set REACT_APP_API_URL environment variable
# Auto-deploys on push to main branch
```

## 🔍 Testing

### Manual Testing
1. Load the application
2. Click "Load Sample" to populate with test data
3. Click "Parse Resume" to start streaming
4. Verify sections populate progressively
5. Test responsive design on different screen sizes

### Error Scenarios
- Test with invalid resume text
- Test with backend offline
- Test network interruption during streaming
- Verify error messages are user-friendly

## 📱 Responsive Design

### Desktop (1024px+)
- Two-panel layout (input | output)
- Full-width resume template
- Horizontal progress bar

### Tablet (768px - 1024px)
- Stacked layout
- Adjusted padding and spacing
- Touch-friendly buttons

### Mobile (< 768px)
- Single column layout
- Stacked controls
- Optimized text sizes
- Touch gestures support

## 🎯 Performance

### Optimizations
- **Lazy loading** - Components load on demand
- **Memoization** - Prevent unnecessary re-renders
- **Efficient updates** - Only update changed sections
- **Debounced input** - Prevent excessive API calls

### Bundle Size
- **Core app** - ~50KB gzipped
- **Total bundle** - ~200KB including React
- **Streaming library** - ~10KB additional

## 🛡️ Error Handling

### Network Errors
- Connection timeouts
- Server unavailable
- CORS issues

### Data Errors
- Malformed JSON during streaming
- Missing required fields
- Invalid data types

### User Experience
- Non-blocking error messages
- Graceful degradation
- Retry mechanisms
- Clear error descriptions

## 🔄 Development Workflow

1. **Start backend** - Ensure API is running on port 8000
2. **Start frontend** - `npm start` on port 3000
3. **Make changes** - Hot reload for instant feedback
4. **Test streaming** - Use sample resume or custom input
5. **Check responsive** - Test on different screen sizes

## 🤝 Contributing

### Code Style
- Use TypeScript for all new components
- Follow React hooks patterns
- Maintain component separation of concerns
- Add proper type definitions

### CSS Guidelines
- Use CSS custom properties for theming
- Follow BEM naming convention
- Ensure mobile-first responsive design
- Test print styles

### Testing Checklist
- [ ] Component renders without crashing
- [ ] Streaming updates work correctly
- [ ] Progress bar updates accurately
- [ ] Error states display properly
- [ ] Responsive design works on all breakpoints
- [ ] Print styles are appropriate

---

Built with ❤️ using React, TypeScript, and modern web standards.
