import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import {
  FaLandmark,
  FaUserShield,
  FaChartLine,
  FaHandshake,
  FaMobileAlt,
  FaLanguage,
  FaStamp,
  FaNetworkWired
} from 'react-icons/fa';
import { GiFarmTractor } from 'react-icons/gi'; // Removed GiZigzagLeaf
import { SiBlockchaindotcom } from 'react-icons/si';
import { TbBrandAirtable } from 'react-icons/tb';

const About = () => {
  const controls = useAnimation();

  const timelineData = [
    {
      year: "1980",
      event: "Independence Land Reforms",
      status: "paper-based"
    },
    {
      year: "2000",
      event: "Fast Track Land Reform",
      status: "disputes emerged"
    },
    {
      year: "2020",
      event: "Digital Transformation Begins",
      status: "partial digitization"
    },
    {
      year: "2025",
      event: "SecureTitleZW Launch",
      status: "blockchain revolution",
      current: true
    }
  ];

  const impactStats = [
    { value: "60s", label: "Transfer Time", icon: <FaChartLine /> },
    { value: "90%", label: "Fraud Reduction", icon: <FaUserShield /> },
    { value: "24/7", label: "Accessibility", icon: <FaMobileAlt /> },
    { value: "100%", label: "Transparency", icon: <FaHandshake /> }
  ];

  return (
    <section className="zimbabwe-revolution py-5 position-relative overflow-hidden">
      {/* Background elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100">
        {/* Replaced GiZigzagLeaf with SiBlockchaindotcom */}
        <SiBlockchaindotcom className="position-absolute text-primary opacity-10" style={{ fontSize: '20rem', top: '10%', left: '5%' }} />
        <TbBrandAirtable className="position-absolute text-success opacity-10" style={{ fontSize: '15rem', bottom: '15%', right: '5%' }} />
      </div>

      <div className="container position-relative">
        {/* Hero Header */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="d-inline-block mb-3"
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* <div className="flag-container p-3 rounded-circle bg-white shadow-sm">
              <svg
                width="60"
                height="60"
                viewBox="0 0 640 480"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="#ffd200" d="M0 0h640v480H0z"/>
                <path fill="#000" d="M0 0h640v120H0z"/>
                <path fill="#ff0000" d="M0 120h640v120H0z"/>
                <path fill="#000" d="M0 240h640v120H0z"/>
                <path fill="#ff0000" d="M0 360h640v120H0z"/>
                <path fill="#009739" d="M0 0h180v480H0z"/>
                <path fill="#fff" d="M0 0h640v480H0z" fillOpacity="0"/>
                <path fill="#fff" d="M220 240l-21-72-21 72-66-48h81l-20-72-20 72h81z"/>
              </svg>
            </div> */}
          </motion.div>
          <h1 className="display-4 fw-bold mb-3 text-gradient">
            Zimbabwe's Land Revolution
          </h1>
          <p className="lead fs-3">
            Solving decades of land disputes through <span className="text-primary fw-bold">Blockchain technology</span>
          </p>
        </motion.div>

        {/* Timeline Visualization */}
        <motion.div
          className="timeline-wrapper mb-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="timeline-line position-relative">
            <div className="progress-line position-absolute h-100 start-0 top-0 bg-primary" style={{ width: '4px' }}></div>

            {timelineData.map((item, index) => (
              <motion.div
                key={index}
                className={`timeline-item ${item.current ? 'current' : ''}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content shadow-sm">
                  <div className="timeline-year">{item.year}</div>
                  <h4>{item.event}</h4>
                  <p className={`status-badge ${item.status.includes('blockchain') ? 'bg-primary' : 'bg-secondary'}`}>
                    {item.status}
                  </p>
                  {item.current && (
                    <motion.div
                      className="sparkle"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <SiBlockchaindotcom />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          className="impact-stats row g-4 mb-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              className="col-md-3 col-6"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="stat-card text-center p-4 h-100">
                <motion.div
                  className="stat-icon mb-3"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {stat.icon}
                </motion.div>
                <h3 className="stat-value display-4 fw-bold">{stat.value}</h3>
                <p className="stat-label mb-0">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Solution Features */}
        <motion.div
          className="solution-features"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="row g-4">
            <div className="col-lg-6">
              <motion.div
                className="solution-image h-100"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="image-placeholder rounded-4 overflow-hidden position-relative h-100">
                  <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center bg-primary bg-opacity-10">
                    <GiFarmTractor size={80} className="text-primary opacity-50" />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="col-lg-6">
              <div className="solution-details h-100">
                <h2 className="mb-4">How Blockchain Solves Zimbabwe's Land Challenges</h2>

                <div className="feature-list">
                  {[
                    "Immutable digital land titles replacing paper records",
                    "Real-time ownership verification for banks and courts",
                    "Mobile access for rural farmers and urban dwellers",
                    "Multi-language support (Shona, Ndebele, English)",
                    "Government-approved smart contract framework",
                    "Integration with existing land records systems"
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="feature-item d-flex mb-3"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="feature-check me-3 text-success">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;