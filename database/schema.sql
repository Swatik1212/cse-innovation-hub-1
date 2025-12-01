CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  course VARCHAR(100) NULL,
  year_of_study INT NULL,
  role ENUM('admin','student') NOT NULL DEFAULT 'student'
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  student_id INT NULL,
  description TEXT NULL,
  status ENUM('proposed','approved','completed') NOT NULL DEFAULT 'proposed',
  INDEX idx_projects_student_id (student_id)
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  event_date DATE NOT NULL,
  event_time VARCHAR(20) NULL,
  location VARCHAR(255) NULL,
  event_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Upcoming',
  organizer VARCHAR(255) NULL,
  INDEX idx_events_date (event_date)
);

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  location VARCHAR(255) NULL,
  salary VARCHAR(100) NULL,
  description TEXT NULL,
  posted_date DATE NULL,
  apply_link VARCHAR(500) NULL,
  INDEX idx_jobs_posted_date (posted_date)
);

CREATE TABLE IF NOT EXISTS job_requirements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  requirement VARCHAR(500) NOT NULL,
  INDEX idx_job_requirements_job_id (job_id)
);

CREATE TABLE IF NOT EXISTS placements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  link VARCHAR(500) NULL,
  download_url VARCHAR(500) NULL
);
