import type { Project } from "@/components/opening/projectsData";

export type Screenshot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type Collaborator = {
  name: string;
  role?: string;
  github?: string;
  linkedin?: string;
};

export type ProjectDetail = {
  overview: string[];
  highlights: string[];
  stack: string[];
  decisions?: { title: string; text: string }[];
  links?: { label: string; href: string }[];
  screenshots?: Screenshot[];
  collaborators?: Collaborator[];
};

type Slug = Project["slug"];

const shot = (
  slug: Slug,
  file: string,
  width: number,
  height: number,
  alt: string,
  caption: string,
): Screenshot => ({ src: `/projects/${slug}/${file}`, alt, caption, width, height });

export const PROJECT_DETAILS: Record<Slug, ProjectDetail> = {
  aurel: {
    overview: [
      "AUREL is a ten-page luxury streetwear storefront built from scratch with HTML, Tailwind CSS and JavaScript. The aim was an editorial, brand-first shopping experience: near-black surfaces, off-white type and a single gold accent, with motion used to pace the story rather than decorate it.",
      "The pages cover the full journey of a store: home, about, shop all, men, women, kids, brands, sale, featured and contact. There is no backend, so checkout is a placeholder.",
    ],
    highlights: [
      "Persistent cart backed by localStorage, with a slide-out drawer, quantity controls and a running subtotal that carries across every page",
      "Scroll-driven motion with GSAP ScrollTrigger and Lenis smooth scrolling",
      "A 3D sneaker hero on the featured page",
      "Each category page has its own layout and signature effect, such as a cursor-spotlight hero for men and a scroll-reveal hero for women",
      "A brand spotlight feature, a lookbook slider and a sale page with a countdown banner",
      "Every desktop-only interaction has a mobile fallback, including the custom cursor, which is disabled on touch devices",
    ],
    stack: ["HTML", "Tailwind CSS", "JavaScript", "GSAP & ScrollTrigger", "Lenis"],
    decisions: [
      {
        title: "One shared cart script",
        text: "A single cart script with a delegated click listener handles every add-to-cart button, including ones rendered by JavaScript, so no page needs its own wiring.",
      },
    ],
    links: [
      { label: "Live site", href: "https://streetwear-website-gamma.vercel.app/" },
      { label: "GitHub", href: "https://github.com/zMaham774/streetwear-website" },
    ],
    screenshots: [
      shot("aurel", "aurel-home.jpg", 1900, 890, "AUREL home page hero reading New Drop 2025", "Home: full-bleed editorial hero with an announcement bar and a custom cursor"),
      shot("aurel", "aurel-categories.jpg", 1900, 880, "Men's and women's category split on the AUREL home page", "Home: split-screen entry into the men's and women's collections"),
      shot("aurel", "aurel-mens-hero.jpg", 1900, 890, "AUREL men's page hero inviting the visitor to move the cursor to reveal the collection", "Men's: a cursor-spotlight hero that reveals the photograph as you move"),
      shot("aurel", "aurel-lookbook.jpg", 1900, 890, "Women's lookbook slider with category navigation above it", "Women's: sticky category navigation above a full-width lookbook slider"),
      shot("aurel", "aurel-brands.jpg", 1900, 890, "Brand spotlight feature for Palm Angels", "Brands: a featured-brand spotlight with a call to action"),
      shot("aurel", "aurel-sale.jpg", 1900, 890, "AUREL sale page with a countdown banner and discounted products", "Sale: countdown banner above a discounted product grid"),
    ],
  },

  "solar-tech": {
    overview: [
      "Solar Tech is a five-page responsive website (Home, About, Services, Projects and Contact) for a fictional solar energy company. It is a practice project: the goal was to show that I can take a business brief and deliver a clear, confident, professional site.",
    ],
    highlights: [
      "Five responsive pages: Home, About, Services, Projects and Contact",
      "A hero slideshow with a clear Get Quote call to action",
      "A commercial projects carousel with autoplay, a pause control and a progress indicator",
      "A contact page with an enquiry form and a service selector",
      "Built with plain HTML, CSS and JavaScript, no frameworks",
      "A practice brief, not work for a real company",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "Live site", href: "https://zmaham774.github.io/solar-company-website/" },
      { label: "GitHub", href: "https://github.com/zMaham774/solar-company-website" },
    ],
    screenshots: [
      shot("solar-tech", "solar-home.jpg", 1890, 880, "SolarTech home page hero with slideshow indicators", "Home: full-width hero slideshow with a clear call to action"),
      shot("solar-tech", "solar-services.jpg", 1890, 880, "Industrial Solar Systems section on the services page", "Services: image-and-text sections describing each service"),
      shot("solar-tech", "solar-projects.jpg", 1890, 890, "Commercial projects carousel showing a rooftop installation", "Projects: autoplaying carousel with a pause control and progress indicator"),
      shot("solar-tech", "solar-contact.jpg", 1880, 885, "Contact page with an enquiry form beside the company details", "Contact: enquiry form with a service selector beside the company details"),
    ],
  },

  "faculty-workload-winforms": {
    overview: [
      "The original university database systems team project, built with a teammate: a Windows desktop application that brings faculty workload, attendance, timetables and leave requests together in one database-backed system.",
      "The application has 16 forms in total. I designed the database and built 10 of the forms, and my teammate built the other 6.",
      "I later rebuilt the whole system on my own as a full web application. See the ASP.NET Core version.",
    ],
    highlights: [
      "University database systems team project: I designed the database and built 10 of the 16 forms",
      "WinForms desktop application",
      "Faculty workload, attendance, timetables and leave management",
      "Add and edit forms paired with searchable, filterable data grids",
      "An academic calendar that marks which days classes run",
    ],
    stack: ["C#", "WinForms"],
    links: [{ label: "GitHub", href: "https://github.com/zMaham774/faculty-workload-system" }],
    collaborators: [{ name: "Dua Javaid", role: "Contributed 6 of the 16 forms and their associated functionality.", github: "https://github.com/dua123-maker", linkedin: "https://www.linkedin.com/in/dua-javaid-86611a318/" }],
    screenshots: [
      shot("faculty-workload-winforms", "winforms-login.jpg", 770, 430, "WinForms login screen for the Faculty Management System", "Login screen"),
      shot("faculty-workload-winforms", "winforms-faculty.jpg", 920, 510, "Faculty management screen with an add or edit form above a searchable table", "Faculty management: add or edit records, search and filter the table"),
      shot("faculty-workload-winforms", "winforms-workload.jpg", 895, 505, "Workload assignment screen for assigning or reassigning courses", "Workload assignment: assign or reassign courses to faculty by semester"),
      shot("faculty-workload-winforms", "winforms-calendar.jpg", 895, 495, "Academic calendar management screen", "Academic calendar: events and non-teaching days by semester"),
    ],
  },

  "faculty-workload-web": {
    overview: [
      "A solo upgrade of the original desktop system into a full ASP.NET Core MVC web application. It keeps the same problem, managing faculty workload and attendance, but adds role-based access, a proper dashboard for each role and comprehensive reporting.",
    ],
    highlights: [
      "Twelve modules: Departments, Semesters, Faculty, Courses, Users, Workload, Timetable, Attendance, Calendar, Leave Request, Leave Approval and Reports",
      "Role-based dashboards for Admin, HOD and Faculty, with session-based authentication",
      "A dashboard with a workload-by-department chart and a semester attendance overview",
      "Ten PDF report types generated with QuestPDF",
      "Entity Framework Core data layer with MySQL",
    ],
    stack: ["ASP.NET Core MVC", "Entity Framework Core", "MySQL", "C#", "Tailwind CSS", "Chart.js", "QuestPDF"],
    decisions: [
      {
        title: "Attendance is per class slot",
        text: "Attendance is recorded per class slot rather than per faculty member per day, which matches the schema's unique constraint.",
      },
      {
        title: "No self-approval of leave",
        text: "HODs can manage their own attendance and workload like an admin, but are blocked from approving their own leave requests because that is a conflict of interest.",
      },
      {
        title: "Leave balances are computed live",
        text: "Balances are calculated from approved request history instead of trusting a stored balance table, which removed a class of academic-year string-matching bugs.",
      },
    ],
    links: [{ label: "GitHub", href: "https://github.com/zMaham774/faculty-workload-system-web" }],
    screenshots: [
      shot("faculty-workload-web", "web-login.jpg", 1890, 890, "Web login page with a role selector for Admin, HOD and Faculty", "Login: choose a role, Admin, HOD or Faculty, before signing in"),
      shot("faculty-workload-web", "web-dashboard.jpg", 1890, 895, "Admin dashboard with summary cards, a workload chart and an attendance donut", "Dashboard: summary cards, weekly credit hours by department and attendance overview"),
      shot("faculty-workload-web", "web-reports.jpg", 1890, 895, "Reports page with view and download buttons for each report", "Reports: view or download PDF reports"),
      shot("faculty-workload-web", "web-timetable.jpg", 1890, 890, "Timetable page listing classes grouped by day", "Timetable: weekly classes grouped by day, with filters"),
      shot("faculty-workload-web", "web-courses.jpg", 1890, 880, "Courses page with search, filters and a course table", "Courses: a searchable, filterable course list"),
    ],
  },
};