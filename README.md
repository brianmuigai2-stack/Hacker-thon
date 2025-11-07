# KaziConnect

## Connecting Youth with Local Jobs 🇰🇪

KaziConnect is a modern React-based web platform that empowers Kenyan youth by bridging the gap between talent and opportunity. The application connects job seekers with employers offering short-term, freelance, and entry-level positions across Kenya.

---

## Description

KaziConnect provides an intuitive platform where:

- **Job Seekers** can discover opportunities, apply to jobs, and manage their professional profiles
- **Employers** can post job listings, manage applications, and find qualified candidates
- **Youth** gain access to opportunities that match their skills and location

Built with React and modern web technologies, KaziConnect offers a seamless experience with light/dark themes, responsive design, and real-time search capabilities.

---

## Author

**Brian Muigai**  
_Full Stack Developer_

---

## Features

### For Job Seekers

✅ Browse available jobs with advanced filtering  
✅ Search by keywords, category, and location  
✅ View detailed job descriptions and requirements  
✅ Apply to positions with one click  
✅ Create and manage professional profiles  
✅ Add skills, experience, and contact information

### For Employers

✅ Post new job opportunities through a simple form  
✅ Specify job category, location, and compensation  
✅ Manage job listings and applications  
✅ Access employer-specific dashboard

### Additional Features

✅ Light/Dark theme toggle for comfortable viewing  
✅ Fully responsive design (mobile, tablet, desktop)  
✅ User authentication (login/signup)  
✅ Role-based access control  
✅ Persistent user sessions with LocalStorage  
✅ Modern, gradient-based UI with smooth animations  
✅ Kenya-themed branding and localization

---

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/kaziconnect.git
   cd kaziconnect
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**

   - Navigate to `http://localhost:3000`

5. **Login with demo credentials**
   - **Job Seeker:** john@example.com / password
   - **Employer:** employer@techsolutions.com / password

### Build for Production

```bash
npm run build
```

---

## BDD (Behavior Driven Development)

### User Authentication

1. **Input:** Valid email and password  
   **Output:** User logged in and redirected to homepage

2. **Input:** Invalid credentials  
   **Output:** Error message displayed

3. **Input:** Signup with role selection (Job Seeker/Employer)  
   **Output:** Account created and user logged in

### Job Search & Filtering

1. **Input:** Search keyword in search bar  
   **Output:** Filtered job listings matching the keyword

2. **Input:** Category filter selection  
   **Output:** Jobs filtered by selected category

3. **Input:** No matching results  
   **Output:** "No jobs found" message displayed

### Job Application

1. **Input:** Authenticated user clicks "Apply"  
   **Output:** Application submitted successfully

2. **Input:** Unauthenticated user clicks "Apply"  
   **Output:** Prompt to login

### Job Posting

1. **Input:** Employer fills job form with valid data  
   **Output:** Job posted and visible in listings

2. **Input:** Non-employer tries to access post page  
   **Output:** Access denied message

### Profile Management

1. **Input:** User updates profile information  
   **Output:** Profile saved and updated in localStorage

2. **Input:** User adds skills (comma-separated)  
   **Output:** Skills parsed and displayed as tags

---

## Technologies Used

### Frontend

- **React 18+** - Component-based UI library
- **React Router DOM v6** - Client-side routing
- **Context API** - State management (Auth & Theme)
- **CSS3** - Custom styling with CSS variables
- **LocalStorage** - Client-side data persistence

### Development Tools

- **Create React App** - Project bootstrapping
- **ES6+ JavaScript** - Modern JavaScript features
- **Git** - Version control

### Design Features

- **Responsive Design** - Mobile-first approach
- **CSS Grid & Flexbox** - Modern layout systems
- **CSS Variables** - Dynamic theming
- **Animations** - Smooth transitions and effects

---

## Project Structure

```
kaziconnect/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with theme toggle
│   │   ├── Footer.jsx          # Application footer
│   │   ├── JobCard.jsx         # Individual job listing card
│   │   └── SearchBar.jsx       # Search and filter component
│   ├── contexts/
│   │   ├── AuthContext.js      # Authentication state management
│   │   └── ThemeContext.js     # Theme (light/dark) management
│   ├── pages/
│   │   ├── Auth.jsx            # Login/Signup page
│   │   ├── Home.jsx            # Landing page with hero section
│   │   ├── Jobs.jsx            # Job listings with search
│   │   ├── PostJob.jsx         # Job posting form (employers)
│   │   └── Profile.jsx         # User profile management
│   ├── services/
│   │   └── mockApi.js          # Mock API for development
│   ├── styles/
│   │   ├── styles.css          # Global styles and variables
│   │   ├── Navbar.css          # Navbar styles
│   │   ├── Footer.css          # Footer styles
│   │   ├── JobCard.css         # Job card styles
│   │   ├── SearchBar.css       # Search bar styles
│   │   ├── Auth.css            # Authentication page styles
│   │   ├── Home.css            # Home page styles
│   │   ├── Jobs.css            # Jobs page styles
│   │   ├── PostJob.css         # Post job page styles
│   │   └── Profile.css         # Profile page styles
│   ├── App.js                  # Main application component
│   └── index.js                # Application entry point
├── package.json
└── README.md
```

---

## Usage Guide

### For Job Seekers

1. **Sign Up**

   - Click "Login / Sign up" in the navbar
   - Select "Job Seeker" role
   - Fill in your details and create an account

2. **Browse Jobs**

   - Navigate to "Jobs" page
   - Use search bar to filter by keywords or category
   - Click on job cards to view details

3. **Apply for Jobs**

   - Click "Apply" button on any job listing
   - Your application will be submitted to the employer

4. **Manage Profile**
   - Go to "Profile" page
   - Click "Edit" to update your information
   - Add skills, bio, location, and contact details

### For Employers

1. **Sign Up**

   - Click "Login / Sign up" in the navbar
   - Select "Employer" role
   - Fill in company details and create an account

2. **Post a Job**

   - Navigate to "Post Job" page (appears in navbar for employers)
   - Fill in job title, description, category, location, and pay
   - Submit to publish the job listing

3. **View Applications**
   - Feature coming soon with backend integration

---

## Color Scheme

The application uses a professional color palette inspired by Kenyan culture:

- **Primary (Indigo):** `#4f46e5` - Trust, professionalism
- **Secondary (Green):** `#10b981` - Growth, opportunity
- **Background (Light):** `#f9fafb`
- **Surface (White):** `#ffffff`
- **Text Primary:** `#111827`
- **Text Secondary:** `#6b7280`

### Dark Mode

- **Background (Dark):** `#111827`
- **Surface (Dark):** `#1f2937`
- **Text Primary (Dark):** `#f9fafb`
- **Text Secondary (Dark):** `#9ca3af`

---

## Future Enhancements

### Backend Integration

- [ ] REST API with Node.js/Express
- [ ] MongoDB database for data persistence
- [ ] Real-time application tracking
- [ ] Email notifications for job matches

### Advanced Features

- [ ] Job recommendations using ML algorithms
- [ ] In-app messaging between employers and job seekers
- [ ] Video resume uploads
- [ ] Company verification and ratings
- [ ] Payment integration for premium listings
- [ ] Mobile app (React Native)

### User Experience

- [ ] Multi-language support (English, Swahili)
- [ ] Advanced search with salary range filters
- [ ] Job alerts via SMS/Email
- [ ] Resume builder tool
- [ ] Interview scheduling system

---

## Contributors

Developed by:

- Brian Muigai - Lead Developer
- Everyone - Frontend Developer
- \*Patrickson - UI/UX Designer
- Ronnie- Q&A Engineer

---

---

## License

**MIT License**

Copyright (c) 2025 KaziConnect

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Acknowledgments

- Inspired by the need to address youth unemployment in Kenya
- Built with LOVE for Kenyan youth
- Special thanks to the open-source community

---

**KaziConnect** — _Empowering Kenyan Youth Through Opportunity_
