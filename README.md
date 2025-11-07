# JobLink Kenya

## Tafuta Kazi. Connect. Empower.

JobLink Kenya is a React-based web application that connects job seekers with organizations offering short-term or low-skill opportunities. It focuses on bridging the unemployment gap by making job discovery, application, and posting easy and accessible — especially for Kenyan youth.

## Features
For Job Seekers

Browse available jobs and view job details.

Save favorite job listings for later.

Apply to open positions directly from the app.

Manage and edit your personal and professional profile.

## For Organizations

Post new job opportunities through a simple form.

Manage job availability (Open/Closed).

View applications (placeholder for future backend integration).

## Additional Features

Light/Dark theme toggle using React Context API.

Responsive navigation with user-type based menus.

LocalStorage persistence for user session and profile data.



## Technologies Used

React 18+

React Router DOM

Context API

CSS 

LocalStorage 


## Installation & Setup

Clone the repository

git clone https://github.com/brianmuigai2-stack/Hacker-thon.git
cd joblink-kenya

Install dependencies

npm install

Run the development server

npm run dev

Build for production

npm run build
Usage

Login / Signup:
Users can register either as a job seeker or organization.

## For Job Seekers:
Navigate to “Find Jobs,” view listings, apply, or save opportunities.

## For Organizations:
Access “Dashboard” to post new jobs using the JobPostForm.

Profile Management:
Job seekers can edit their profile info (skills, experience, contact, etc.).

Project Structure<br>
src/<br>
├── components/<br>
│   ├── Navbar.jsx<br>
│   ├── JobCard.jsx<br>
│   ├── JobPostForm.jsx<br>
│   ├── ProfileForm.jsx<br>
│   ├── ThemeToggle.jsx<br>
├── context/<br>
│   └── ThemeContext.js<br>
├── pages/<br>
│   ├── HomePage.jsx<br>
│   ├── LoginPage.jsx<br>
│   ├── SignupPage.jsx<br>
│   ├── ProfilePage.jsx<br>
│   ├── JobListingsPage.jsx<br>
│   ├── OrganisationDashboard.jsx<br>
├── styles/<br>
│   ├── navbar.css<br>
│   └── app.css<br>
└── App.js<br>
## Future Enhancements

Integration with backend (Node.js / Express + MongoDB)

Real job posting and application storage

Notifications for new job openings

Profile photo upload functionality

Role-based authentication and admin panel

# Contributors

Developed by:

Judy

Patrick

Ronny

Tobijah

Brian

JobLink Kenya — Empowering youth through opportunity.
