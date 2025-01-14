import React from "react";
import "./AboutPage.css";
import me from "../images/me.png";

function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-header">
        <div className="photo-container">
          <img src={me} alt="Kostia Novosydliuk" className="photo" />
        </div>
        <h1 className="about-name">Kostia Novosydliuk</h1>
        <p className="about-role">1st Year Software Engineering Student @ University of Waterloo</p>
      </div>

      <div className="about-content">
        <section className="about-me">
          <h2>About Me</h2>
          <p>
            Hi, I am a first-year Software Engineering student with a passion for AI and full-stack
            development. Currently looking for a summer internship.
          </p>
        </section>

        <section className="projects">
          <h2>Projects</h2>

          <div className="project">
            <h3>Soufico</h3>
            <p>
              A web application designed for movie and music enthusiasts. The platform allows users
              to curate personalized movie libraries and create Spotify playlists inspired by movie themes. Users can save movies and playlists to their profiles, leave ratings, and share reviews.
            </p>
            <p>
              <strong>Technologies:</strong> React, Node.js, Express, MongoDB, Firebase, Stripe, Render, RESTful API, Postman
            </p>
            <div className="project-buttons">
              <a href="https://github.com/soufico" target="_blank" className="project-button" rel="noreferrer">
                View Code
              </a>
              <a href="https://soufico-demo.com" target="_blank" className="project-button demo" rel="noreferrer">
                View Demo
              </a>
            </div>
          </div>

          <div className="project">
            <h3>OnkoAlert</h3>
            <p>
              A web application for early detection of brain, breast, kidney, and oral cancers, featuring a responsive React frontend and Flask backend for efficient medical scan analysis. Leveraging advanced machine learning models, including TensorFlow, VGG16 for feature extraction, and XGBoost for classification, the app achieves a detection accuracy of 96%.
            </p>
            <p>
              <strong>Technologies:</strong> React, Flask, Python, TensorFlow, VGG16, XGBoost, Pandas, NumPy, HTML, CSS
            </p>
            <div className="project-buttons">
              <a href="https://github.com/onkoalert" target="_blank" className="project-button" rel="noreferrer">
                View Code
              </a>
              <a href="https://onkoalert-demo.com" target="_blank" className="project-button demo" rel="noreferrer">
                View Demo
              </a>
            </div>
          </div>

          <div className="project">
            <h3>PathMAXer</h3>
            <p>
              A campus navigation mini-vehicle featuring pathfinding, localization, and obstacle avoidance. Built with React Native and Expo for schedule uploads and route visualization, integrated with a Flask backend. ROS manages localization and pathfinding, while a Raspberry Pi processes onboard computation and sensor data.
            </p>
            <p>
              <strong>Technologies:</strong> React Native, Expo, Flask, ROS, Python, Raspberry Pi, C++
            </p>
            <div className="project-buttons">
              <a href="https://github.com/pathmaxer" target="_blank" className="project-button" rel="noreferrer">
                View Code
              </a>
              <a href="https://pathmaxer-demo.com" target="_blank" className="project-button demo" rel="noreferrer">
                View Demo
              </a>
            </div>
          </div>
        </section>

        <section className="interests">
          <h2>My Interests and Hobbies</h2>
          <ul>
            <li>Watching Movies</li>
            <li>Reading Books</li>
            <li>Listening to Music</li>
            <li>Figure Skating</li>
            <li>Programming</li>
            <li>Travelling</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
