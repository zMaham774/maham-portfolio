export type Project = {
  number: string;
  name: string;
  category: string;
  description: string;
  slug: 'aurel' | 'solar-tech' | 'faculty-workload-winforms' | 'faculty-workload-web';
  details: string[];
};

export const PROJECTS: Project[] = [
  {
    number: '01', name: 'AUREL', category: 'Luxury Fashion Experience', slug: 'aurel',
    description: 'An immersive e-commerce experience for a luxury streetwear brand, shaped by motion, editorial storytelling and an uncompromising eye for detail.',
    details: ['10-page shopping experience', 'Tailwind CSS, GSAP / ScrollTrigger and Lenis', 'Persistent cart, slide-out drawer and 3D sneaker feature'],
  },
  {
    number: '02', name: 'Solar Tech', category: 'Business Website', slug: 'solar-tech',
    description: 'A modern five-page, responsive website for a solar energy company — a practice project exploring clear communication and confident business design.',
    details: ['Five responsive pages', 'HTML, CSS and JavaScript', 'A practice project demonstrating business-website capability'],
  },
  {
    number: '03', name: 'Faculty Workload & Attendance', category: 'WinForms Desktop Application', slug: 'faculty-workload-winforms',
    description: 'The original university database systems team project, bringing faculty workload, attendance, timetables and leave requests together in a desktop application.',
    details: ['University database systems team project', 'WinForms desktop application', 'Faculty workload, attendance, timetables and leave management'],
  },
  {
    number: '04', name: 'Faculty Workload & Attendance', category: 'Full-Stack Web Upgrade', slug: 'faculty-workload-web',
    description: 'A solo upgrade of the original desktop system into a full ASP.NET Core MVC application with role-based dashboards and comprehensive reporting.',
    details: ['ASP.NET Core MVC and EF Core', 'Admin, HOD and Faculty dashboards across 12 modules', '10 PDF report types via QuestPDF'],
  },
];
