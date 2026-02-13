# Skill Swap Community Hub - Multi-Page Website

## 📁 Project Structure

```
skillswap-multipage/
├── index.html          # Homepage (unchanged from original)
├── about.html          # About Us page
├── contact.html        # Contact page with form
├── register.html       # Registration page
├── music.html          # Music & Arts category page
├── technology.html     # Technology category page
├── languages.html      # Languages category page
├── business.html       # Business Skills category page
├── fitness.html        # Fitness & Wellness category page
├── crafts.html         # Crafts & DIY category page
├── styles.css          # Main stylesheet (all CSS extracted)
└── script.js           # Main JavaScript file
```

## 🚀 Features

- ✅ **Google Analytics** tracking on all pages (ID: G-7MTNPSFXQJ)
- ✅ **Microsoft Clarity** heatmaps and session recordings (ID: vgukmbtww1)
- ✅ **Form tracking** for registrations and contact submissions
- ✅ **Click tracking** for skill cards and CTA buttons
- ✅ **Fully responsive** design for mobile, tablet, and desktop
- ✅ **SEO optimized** with proper meta tags on each page

## 📊 Analytics Events Being Tracked

### Automatic Page Views
All page visits are automatically tracked by Google Analytics

### Custom Events
1. **Form Submissions**
   - Registration form: `form_submit` with label `registration_form`
   - Contact form: `form_submit` with label `contact_form`

2. **User Interactions**
   - Skill card clicks: `skill_card_click` with skill name
   - CTA button clicks: `cta_click` with label `join_now_button`

## 🎨 Pages Overview

### 1. **index.html** - Homepage
- Hero section with main CTA
- Statistics showcase (15K+ members, 50K+ skills exchanged)
- 6 skill category cards
- Testimonials section
- **Unchanged from your original file**

### 2. **about.html** - About Us
- Company mission and vision
- Feature highlights (Smart Matching, Track Progress, etc.)
- Community information

### 3. **contact.html** - Contact
- Contact information (email, phone, address)
- Contact form with validation
- Success message on submission

### 4. **register.html** - Registration
- Multi-field registration form
- Skill matching inputs
- Availability selection
- Success message with redirect to homepage

### 5. **Skill Category Pages**
- Music & Arts (music.html)
- Technology (technology.html)
- Languages (languages.html)
- Business Skills (business.html)
- Fitness & Wellness (fitness.html)
- Crafts & DIY (crafts.html)

Each category page includes:
- Category-specific content
- Popular skills in that category
- CTA to registration page

## 🔧 How to Use

### Local Development
1. Place all files in the same directory
2. Open `index.html` in your browser
3. All links will work correctly

### GitHub Deployment
1. Create a new repository
2. Upload all files to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be live at `https://yourusername.github.io/repository-name`

### Custom Domain (Optional)
1. Add a `CNAME` file with your domain name
2. Configure DNS settings at your domain registrar
3. Point to GitHub Pages

## 📈 Viewing Analytics

### Google Analytics
1. Log in to [analytics.google.com](https://analytics.google.com)
2. Select property ID: G-7MTNPSFXQJ
3. View:
   - Real-time visitors
   - Page views
   - Form submissions
   - Custom events

### Microsoft Clarity
1. Log in to [clarity.microsoft.com](https://clarity.microsoft.com)
2. Select project ID: vgukmbtww1
3. View:
   - Heatmaps
   - Session recordings
   - User behavior patterns

## 🎯 Key Features

### Navigation
- Fixed navigation bar on all pages
- Active page highlighting
- Mobile-responsive hamburger menu
- Smooth scroll to top on page change

### Forms
- Client-side validation
- Form data logged to console (ready for backend integration)
- Success messages with auto-hide
- Google Analytics event tracking

### Design
- Modern gradient color scheme (purple/blue)
- Smooth animations and transitions
- Card-based layout
- Professional typography

## 🔄 Future Enhancements

Ready for:
1. Backend integration for form submissions
2. User authentication system
3. Database connection for skill matching
4. Email notifications
5. User dashboard
6. Search functionality
7. Filter by skill category
8. User profiles

## 📝 Notes

- All analytics tracking is already configured
- Forms currently log to console (add backend endpoint for production)
- Mobile menu toggle is fully functional
- All images are loaded from Unsplash CDN
- CSS animations enhance user experience
- SEO meta tags optimized for each page

## 🛠️ Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, animations
- **Vanilla JavaScript** - No dependencies
- **Google Analytics** - Web analytics
- **Microsoft Clarity** - User behavior analytics

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Ready to deploy! All files are production-ready and analytics-enabled.**
