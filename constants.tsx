
import React from 'react';
import { Home, Users, Code, FolderOpen, Mail, Github, Linkedin } from 'lucide-react';
import { LeadershipActivity, Project, SkillCard, SectionId } from './types';

export const NAV_ITEMS = [
  { id: SectionId.Home, icon: <Home size={20} />, label: 'Home' },
  { id: SectionId.Leadership, icon: <Users size={20} />, label: 'Leadership' },
  { id: SectionId.Skills, icon: <Code size={20} />, label: 'Skills' },
  { id: SectionId.Projects, icon: <FolderOpen size={20} />, label: 'Projects' },
  { id: SectionId.Contact, icon: <Mail size={20} />, label: 'Contact' },
];

export const LEADERSHIP_ACTIVITIES: LeadershipActivity[] = [
  {
    id: '1',
    title: 'Innovation Institution & Council',
    role: 'Joint Secretary',
    description: 'Coordinated cross-team execution for multiple flagship events including expos and hackathons',
    keyResult: 'Joint Secretary at IIC (MoE), contributing to campus-wide innovation initiatives and mentoring programs impacting 150+ students.'
  },
  {
    id: '2',
    title: 'IIC (MoE), Patiala',
    role: 'Innovation Ambassador',
    description: 'Mentored 150+ students on idea validation, prototyping, and early-stage product thinking.',
    keyResult: 'Acted as a bridge between students, faculty, and innovation programs under MoE initiatives.'
  },
  {
    id: '3',
    title: 'Innovatia Startup Expo',
    role: 'Lead Organizer',
    description: 'Curated and evaluated 50+ student startups across tech and non-tech domains.',
    keyResult: 'Facilitated interactions with mentors and ecosystem partners, contributing to ₹2L+ in funding intent and opportunities.'
  },
  {
    id: '4',
    title: 'Smart India Hackathon (2024-25)',
    role: 'Campus Organizer',
    description: 'Led a team of 20+ volunteers, coordinating 130+ team rounds from screening to final submissions.',
    keyResult: 'Ensured smooth execution, fair evaluation workflows, and adherence to SIH guidelines.'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'FlowGrid – Smart Service Booking Platform',
    description:
      'Designed a scalable, role-based service booking platform using React.js, Node.js, Express.js, MySQL, and JWT authentication. Built secure RESTful APIs for service discovery and real-time slot booking; integrated Razorpay payments with transactional consistency. Optimized relational schemas with indexing and database constraints to ensure data integrity and reduce booking conflicts.',
    tags: ['REACT', 'NODE.JS', 'EXPRESS', 'MYSQL', 'JWT', 'RAZORPAY'],
    image: 'https://picsum.photos/seed/flowgrid/600/400',
  },
  {
    id: 'p2',
    title: 'Phatak Radar – Real-Time Location & Alert System',
    description:
      'Developed a real-time location tracking and alerting system using Node.js, Express.js, and Leaflet.js. Designed REST APIs to process geospatial data and enable live location updates with optimized response times. Implemented dynamic map visualization and backend optimizations for efficient data handling and scalability.',
    tags: ['NODE.JS', 'EXPRESS', 'LEAFLET.JS', 'REST API', 'GEOSPATIAL'],
    image: 'https://picsum.photos/seed/phatak/600/400',
  },
  {
    id: 'p3',
    title: 'NoLine – QR-Based Smart Queue & Verification System',
    description:
      'Built a QR-based smart queue system using Node.js and Express.js with FIFO logic and state-driven workflow (WAITING → BILLED → VERIFIED). Designed RESTful APIs for onboarding, billing, and verification; optimized MongoDB indexing for O(1) QR lookup and reliable state handling.',
    tags: ['NODE.JS', 'EXPRESS', 'MONGODB', 'QR CODE', 'REST API'],
    image: 'https://picsum.photos/seed/noline/600/400',
  },
  {
    id: 'p4',
    title: 'ChitraKhoj 🔍',
    description:
      'Single-page SDE portfolio built with React and TypeScript featuring smooth navigation, scroll spy, and Supabase contact form.',
    tags: ['REACT', 'TYPESCRIPT', 'TAILWIND'],
    image: 'https://picsum.photos/seed/chitra/600/400',
  },
  {
    id: 'p5',
    title: 'Boredom-Crusher',
    description:
      'Full-stack hotel booking system with calendar-based slot booking, payments, and admin dashboard.',
    tags: ['REACT', 'SPRING BOOT', 'POSTGRESQL'],
    image: 'https://picsum.photos/seed/boredom/600/400',
  },
  {
    id: 'p6',
    title: 'World Atlas',
    description:
      'Explore the history, culture, and beauty of every nation. Sort, search, and filter countries to find the details you need.',
    tags: ['REACT', 'REST API'],
    image: 'https://picsum.photos/seed/atlas/600/400',
  },
];

export const SKILL_CARDS: SkillCard[] = [
  { title: 'LeetCode' },
  { title: 'GeeksforGeeks' },
  { title: 'HackerRank' }
];

export const SOCIAL_LINKS = [
  { icon: <Github size={24} />, href: 'https://github.com', label: 'GitHub' },
  { icon: <Linkedin size={24} />, href: 'https://linkedin.com', label: 'LinkedIn' }
];
