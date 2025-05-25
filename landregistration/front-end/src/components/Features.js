import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Bar, Radar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  RadialLinearScale,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
  LineElement, // <--- Add LineElement here
} from 'chart.js';
import '../styles.css';

ChartJS.register(
  RadialLinearScale,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
  LineElement, // <--- And register it here
);

const Features = () => {
  const controls = useAnimation();

  const radarData = {
    labels: ['Security', 'Speed', 'Cost', 'Accessibility', 'Compliance'],
    datasets: [
      {
        label: 'Traditional System',
        data: [30, 20, 10, 40, 25],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
      {
        label: 'SecureTitleZW',
        data: [95, 90, 85, 80, 90],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ['Transfer Time', 'Fraud Cases', 'Dispute Resolution', 'Accessibility'],
    datasets: [
      {
        label: 'Traditional',
        data: [21, 15, 30, 40],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
      {
        label: 'SecureTitleZW',
        data: [0.016, 0.5, 2, 90],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += context.parsed.y + (context.parsed.y < 1 ? ' days' : ' days');
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Days (unless %)'
        }
      }
    }
  };

  return (
    <motion.div
      className="comparison-section py-5"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      onViewportEnter={() => controls.start("visible")}
    >
      <div className="container">
        <motion.div
          className="text-center mb-5"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="display-5 fw-bold mb-3">Why Our Solution Stands Out</h2>
          <p className="lead">Blockchain-powered advantages over traditional systems</p>
        </motion.div>

        <div className="row g-4">
          <motion.div
            className="col-lg-6"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="chart-container p-4 h-100">
              <h4 className="text-center mb-4">System Capabilities Comparison</h4>
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Radar
                  data={radarData}
                  options={{
                    responsive: true,
                    scales: {
                      r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 100
                      }
                    },
                    animation: {
                      duration: 2000,
                      easing: 'easeOutQuart'
                    },
                    elements: {
                      line: {
                        tension: 0.3
                      }
                    }
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="col-lg-6"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="chart-container p-4 h-100">
              <h4 className="text-center mb-4">Performance Metrics</h4>
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Bar
                  data={barData}
                  options={{
                    ...chartOptions,
                    animation: {
                      duration: 1500,
                      easing: 'easeOutBounce'
                    }
                  }}
                />
              </motion.div>
              <motion.div
                className="legend-highlights mt-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  {[
                    { label: "60-sec transfers", color: "var(--bs-success)" },
                    { label: "90% fraud reduction", color: "var(--bs-danger)" },
                    { label: "24/7 mobile access", color: "var(--bs-primary)" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="highlight-badge"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ backgroundColor: item.color }}
                    >
                      {item.label}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-5"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
           <a href="Final-Year-Project/assist" style={{ textDecoration: 'none' }}>
           <motion.button
            className="btn btn-primary btn-lg px-4 py-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Live Assistance
          </motion.button>
           </a>
          
          
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Features;