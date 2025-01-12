import React from 'react';
import './AboutPage.css';
import { motion } from 'framer-motion';
import me from '../images/me.png'; //gonn be my site, so no user's photo
import ProjectCarousel from '../components/ProjectCarousel/ProjectCarousel'; 

function AboutPage() {
  return (
    <motion.div
      className="about-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* header*/}
      <div className="header-section">
        <motion.div
          className="photo-circle"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <img src={me} alt="Kostia Novosydliuk" className="photo" />
        </motion.div>
        <motion.div
          className="name-title"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <h1 className="name">Kostia Novosydliuk</h1>
          <p className="role">1st Year Software Engineering Student</p>
        </motion.div>
      </div>

      {/* about me */}
      <motion.div
        className="intro-section"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <p className="intro-text">
          Hi, I am a first-year Software Engineering student currently looking
          for a summer internship. I'm interested in AI and full-stack
          development.
        </p>
      </motion.div>

      {/* interests */}
      <motion.div
        className="interests-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <h2 className="interests-title">My Interests</h2>
        <ul className="interests-list">
          <li>Watching Movies</li>
          <li>Reading Books</li>
          <li>Listening to Music</li>
          <li>Figure Skating</li>
          <li>Programming</li>
          <li>Travelling</li>
        </ul>
      </motion.div>

      {/* projects */}
      <div className="projects-section">
        <motion.h2
          className="projects-title"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          My Projects
        </motion.h2>

        {/*project 1 */}
        <motion.div
          className="project"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h3 className="project-title">XXXX</h3>
          <ProjectCarousel images={[me, me, me, me,me,]} />
          <p className="project-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            vehicula ligula ut lacus tempor tincidunt.
          </p>
        </motion.div>

        {/* project 2 */}
        <motion.div
          className="project"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h3 className="project-title">YYYY</h3>
          <ProjectCarousel images={[me, me, me, me]} />
          <p className="project-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            vehicula ligula ut lacus tempor tincidunt.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AboutPage;
