-- --------------------------------------------------------
-- CSE Innovation Hub - Database Schema
-- Database: MySQL
-- --------------------------------------------------------

CREATE DATABASE IF NOT EXISTS cse_hub;
USE cse_hub;

-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    course VARCHAR(50),
    year_of_study INT,
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Events Table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time VARCHAR(100),
    location VARCHAR(100),
    event_type ENUM('Workshop', 'Seminar', 'Hackathon', 'Conference') NOT NULL,
    status ENUM('Upcoming', 'Ongoing', 'Completed') DEFAULT 'Upcoming',
    organizer VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Jobs Table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(100) NOT NULL,
    position VARCHAR(200) NOT NULL,
    type ENUM('Internship', 'Full-time', 'Part-time') NOT NULL,
    location VARCHAR(150),
    salary VARCHAR(100),
    description TEXT,
    posted_date DATE,
    apply_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Placements Table
CREATE TABLE placements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('Guide', 'Resource', 'Company', 'Statistics') NOT NULL,
    link VARCHAR(500),
    download_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Innovation Projects Table (Future Scope)
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    student_id INT,
    description TEXT,
    status ENUM('proposed', 'in-progress', 'completed') DEFAULT 'proposed',
    FOREIGN KEY (student_id) REFERENCES users(id)
);

-- Added job_requirements table for storing multiple requirements per job
CREATE TABLE job_requirements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    requirement TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Insert Dummy Admin User (Password: admin123)
INSERT INTO users (full_name, email, password_hash, role) 
VALUES ('System Admin', 'admin@csehub.com', '$2b$10$hashedpasswordplaceholder', 'admin');

-- Added sample data insertion for events
INSERT INTO events (title, description, event_date, event_time, location, event_type, status) VALUES
('AI & Machine Learning Workshop', 'Hands-on workshop covering fundamentals of AI and ML with practical implementations using Python and TensorFlow.', '2025-12-15', '10:00 AM - 4:00 PM', 'CSE Lab 301', 'Workshop', 'Upcoming'),
('Cloud Computing Seminar by AWS', 'Industry experts from AWS will discuss cloud architecture, serverless computing, and career opportunities.', '2025-12-20', '2:00 PM - 5:00 PM', 'Auditorium Hall', 'Seminar', 'Upcoming'),
('24-Hour Hackathon: Code Sprint 2025', 'Annual coding competition where teams build innovative solutions. Prizes worth $10,000.', '2026-01-10', '9:00 AM - Next Day 9:00 AM', 'Innovation Center', 'Hackathon', 'Upcoming');

-- Added sample data for jobs with requirements
INSERT INTO jobs (title, company, position, type, location, salary, description, posted_date) VALUES
('Software Engineering Intern', 'Google', 'Software Engineering Intern', 'Internship', 'Bangalore, India', '₹80,000/month', 'Join Google''s engineering team to work on cutting-edge projects that impact billions of users worldwide.', '2025-11-15'),
('Full Stack Developer', 'Microsoft', 'Full Stack Developer', 'Full-time', 'Hyderabad, India', '₹18-22 LPA', 'Build cloud-based solutions using Azure, React, and .NET technologies.', '2025-11-20'),
('SDE - Machine Learning', 'Amazon', 'SDE - Machine Learning', 'Full-time', 'Bengaluru, India', '₹25-30 LPA', 'Design and implement ML models for recommendation systems and fraud detection at Amazon scale.', '2025-11-10');

INSERT INTO job_requirements (job_id, requirement) VALUES
(1, 'Currently pursuing Bachelor''s or Master''s in Computer Science'),
(1, 'Strong foundation in data structures and algorithms'),
(1, 'Proficiency in Java, C++, Python, or Go'),
(2, 'Bachelor''s degree in Computer Science or related field'),
(2, '2+ years experience with React, Node.js, and cloud platforms'),
(2, 'Strong understanding of RESTful APIs and microservices');

-- Added sample placement resources
INSERT INTO placements (title, description, category, download_url) VALUES
('Placement Preparation Complete Guide 2025', 'Comprehensive guide covering aptitude, technical interviews, HR rounds, and salary negotiation strategies.', 'Guide', '#'),
('Data Structures & Algorithms Question Bank', '500+ coding problems with solutions covering all major DSA topics. Includes company-specific questions.', 'Resource', '#'),
('Google Interview Preparation', 'Everything you need to know about Google''s hiring process, coding rounds, and system design interviews.', 'Company', '#'),
('Placement Statistics 2024', 'Detailed analysis: highest package ₹44 LPA, average ₹8.2 LPA, 85+ companies visited.', 'Statistics', '#');
