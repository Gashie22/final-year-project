import React, { useState, useEffect, useContext, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { WalletContext } from "./WalletContext";
import LoadingSpinner from "./LoadingSpinner";
import Tooltip from "./Tooltip";
import ConfirmationDialog from "./ConfirmationDialog";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot,
  faComments,
  faLightbulb,
  faHistory,
  faCog,
  faShieldAlt,
  faBrain,
  faChartLine,
  faDatabase
} from '@fortawesome/free-solid-svg-icons';

const AiPage = () => {
  const { isConnected, connectWallet, account, isLoading } = useContext(WalletContext);
  const [activeSection, setActiveSection] = useState("chat");
  const [sectionLoading, setSectionLoading] = useState({
    chat: false,
    insights: false,
    history: false,
    configure: false
  });
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel"
  });

  const toggleSection = (section) => {
    setActiveSection(section);
    // Simulate loading for demo purposes
    setSectionLoading(prev => ({ ...prev, [section]: true }));
    setTimeout(() => {
      setSectionLoading(prev => ({ ...prev, [section]: false }));
    }, 800);
  };

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;
    
    setSectionLoading(prev => ({ ...prev, chat: true }));
    setChatHistory(prev => [...prev, { role: "user", content: message }]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your query, I recommend checking the land registry for plot #2456 in the northern district.",
        "The current market trends show a 12% increase in land values in your region over the past quarter.",
        "I've analyzed your portfolio and suggest diversifying with commercial properties in the upcoming zone.",
        "Your recent transaction was successfully recorded on the blockchain with hash: 0x4a3b...c2d1"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setAiResponse(randomResponse);
      setChatHistory(prev => [...prev, { role: "ai", content: randomResponse }]);
      setSectionLoading(prev => ({ ...prev, chat: false }));
      setMessage("");
    }, 1500);
  }, [message]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const showConfirmation = (title, message, onConfirm) => {
    setConfirmDialog({
      show: true,
      title,
      message,
      onConfirm,
      onCancel: () => setConfirmDialog(prev => ({ ...prev, show: false })),
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel"
    });
  };

  return (
    <div className="ai-page">
      <Navbar />
      <div className="container my-5 pt-5">
        <motion.h1 
          className="text-center mb-4 page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          AI Land Management Assistant
        </motion.h1>

        {!isConnected ? (
          <div className="text-center">
            <motion.button
              onClick={connectWallet}
              className="btn btn-primary btn-lg wallet-connect-btn"
              aria-label="Connect to Ethereum Wallet"
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? <LoadingSpinner /> : (
                <>
                  <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                  Connect Wallet
                </>
              )}
              <span className="btn-pulse-effect"></span>
            </motion.button>
          </div>
        ) : (
          <div>
            {/* Transaction Status */}
            {transactionStatus && (
              <motion.div
                className={`alert alert-${
                  transactionStatus.type === "success"
                    ? "success"
                    : transactionStatus.type === "error"
                    ? "danger"
                    : "warning"
                } mb-4`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p>{transactionStatus.message}</p>
                {transactionStatus.hash && (
                  <small>Transaction Hash: {transactionStatus.hash}</small>
                )}
              </motion.div>
            )}
            
            {/* Action Buttons */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
              {[
                { 
                  section: "chat", 
                  icon: faComments,
                  text: "AI Chat",
                  description: "Get instant answers to your land queries",
                  tooltip: "Conversational AI for all your land management questions"
                },
                { 
                  section: "insights", 
                  icon: faLightbulb,
                  text: "Market Insights",
                  description: "Data-driven property recommendations",
                  tooltip: "AI-powered analysis of market trends and opportunities"
                },
                { 
                  section: "history", 
                  icon: faHistory,
                  text: "Transaction History",
                  description: "Review your past activities",
                  tooltip: "Complete log of all your blockchain transactions"
                },
                { 
                  section: "configure", 
                  icon: faCog,
                  text: "AI Settings",
                  description: "Customize your assistant",
                  tooltip: "Configure AI preferences and notification settings"
                }
              ].map((btn, index) => (
                <motion.div
                  key={btn.section}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.button
                    className={`btn btn-primary d-flex flex-column align-items-center action-btn ${
                      activeSection === btn.section ? 'active' : ''
                    }`}
                    onClick={() => toggleSection(btn.section)}
                    disabled={isLoading}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="feature-icon-wrapper mb-2">
                      <FontAwesomeIcon icon={btn.icon} size="lg" /> 
                    </div>
                    <div>
                      <div className="fw-bold">{btn.text}</div>
                      <small className="d-block text-white-80">{btn.description}</small>
                    </div>
                    <Tooltip text={btn.tooltip} />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Chat Section */}
            {activeSection === "chat" && (
              <motion.div 
                className="row justify-content-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-primary text-white">
                      <h4 className="mb-0">
                        <FontAwesomeIcon icon={faComments} className="me-2" />
                        AI Land Assistant
                      </h4>
                    </div>
                    <div className="card-body">
                      <div className="chat-container mb-3">
                        {sectionLoading.chat && chatHistory.length === 0 ? (
                          <div className="text-center py-5">
                            <LoadingSpinner />
                            <p className="mt-3">Initializing AI assistant...</p>
                          </div>
                        ) : (
                          <div className="chat-messages">
                            {chatHistory.length === 0 && (
                              <div className="welcome-message text-center p-4">
                                <FontAwesomeIcon icon={faRobot} size="2x" className="mb-3 text-primary" />
                                <h5>Hello, {account ? account.substring(0, 8) + "..." : "User"}!</h5>
                                <p className="text-muted">How can I assist you with your land management today?</p>
                              </div>
                            )}
                            
                            {chatHistory.map((msg, index) => (
                              <motion.div
                                key={index}
                                className={`message ${msg.role}`}
                                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                              >
                                <div className="message-content">
                                  {msg.role === "ai" && (
                                    <div className="ai-icon me-2">
                                      <FontAwesomeIcon icon={faRobot} />
                                    </div>
                                  )}
                                  <div>
                                    <div className="message-text">{msg.content}</div>
                                    <div className="message-time">
                                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                            
                            {sectionLoading.chat && chatHistory.length > 0 && (
                              <div className="message ai">
                                <div className="message-content">
                                  <div className="ai-icon me-2">
                                    <FontAwesomeIcon icon={faRobot} />
                                  </div>
                                  <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ask about land registration, verification, or market trends..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          disabled={sectionLoading.chat}
                        />
                        <motion.button
                          className="btn btn-primary"
                          onClick={handleSendMessage}
                          disabled={!message.trim() || sectionLoading.chat}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {sectionLoading.chat ? (
                            <LoadingSpinner />
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faComments} className="me-2" />
                              Send
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Market Insights Section */}
            {activeSection === "insights" && (
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">
                      <FontAwesomeIcon icon={faLightbulb} className="me-2" />
                      Market Insights & Recommendations
                    </h4>
                  </div>
                  <div className="card-body">
                    {sectionLoading.insights ? (
                      <div className="text-center py-5">
                        <LoadingSpinner size="medium" />
                        <p className="mt-3">Analyzing market data...</p>
                      </div>
                    ) : (
                      <div className="row">
                        <motion.div 
                          className="col-md-6 mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="card h-100 insight-card">
                            <div className="card-header bg-light">
                              <h5>
                                <FontAwesomeIcon icon={faChartLine} className="me-2 text-success" />
                                Market Trends
                              </h5>
                            </div>
                            <div className="card-body">
                              <div className="insight-item">
                                <h6>Regional Value Increase</h6>
                                <div className="progress mb-3">
                                  <div 
                                    className="progress-bar bg-success" 
                                    role="progressbar" 
                                    style={{ width: '12%' }}
                                    aria-valuenow="12" 
                                    aria-valuemin="0" 
                                    aria-valuemax="100"
                                  >
                                    12%
                                  </div>
                                </div>
                                <p className="text-muted">Average land value increase in your district last quarter</p>
                              </div>
                              
                              <div className="insight-item">
                                <h6>Transaction Volume</h6>
                                <div className="progress mb-3">
                                  <div 
                                    className="progress-bar bg-info" 
                                    role="progressbar" 
                                    style={{ width: '8%' }}
                                    aria-valuenow="8" 
                                    aria-valuemin="0" 
                                    aria-valuemax="100"
                                  >
                                    8%
                                  </div>
                                </div>
                                <p className="text-muted">Increase in land transfers compared to previous period</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="col-md-6 mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="card h-100 insight-card">
                            <div className="card-header bg-light">
                              <h5>
                                <FontAwesomeIcon icon={faBrain} className="me-2 text-primary" />
                                AI Recommendations
                              </h5>
                            </div>
                            <div className="card-body">
                              <div className="recommendation mb-3">
                                <div className="d-flex align-items-start">
                                  <div className="me-3 text-primary">
                                    <FontAwesomeIcon icon={faLightbulb} size="lg" />
                                  </div>
                                  <div>
                                    <h6>Diversify Portfolio</h6>
                                    <p className="text-muted">
                                      Consider acquiring commercial plots in the upcoming development zone where values are projected to rise 18% in the next year.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="recommendation">
                                <div className="d-flex align-items-start">
                                  <div className="me-3 text-primary">
                                    <FontAwesomeIcon icon={faLightbulb} size="lg" />
                                  </div>
                                  <div>
                                    <h6>Optimal Listing Price</h6>
                                    <p className="text-muted">
                                      For your property at Plot #2456, the AI suggests listing at 12.5 ETH based on comparable sales.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Transaction History Section */}
            {activeSection === "history" && (
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">
                      <FontAwesomeIcon icon={faHistory} className="me-2" />
                      Transaction History
                    </h4>
                  </div>
                  <div className="card-body">
                    {sectionLoading.history ? (
                      <div className="text-center py-5">
                        <LoadingSpinner size="medium" />
                        <p className="mt-3">Loading your transaction history...</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Transaction</th>
                              <th>Land ID</th>
                              <th>Status</th>
                              <th>Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                date: "2023-05-15",
                                type: "Registration",
                                landId: "2456",
                                status: "Confirmed",
                                hash: "0x4a3b...c2d1"
                              },
                              {
                                date: "2023-04-28",
                                type: "Transfer",
                                landId: "1892",
                                status: "Completed",
                                hash: "0x8f2e...a7b4"
                              },
                              {
                                date: "2023-03-10",
                                type: "Verification",
                                landId: "3317",
                                status: "Success",
                                hash: "0x3c9d...e1f6"
                              }
                            ].map((tx, index) => (
                              <motion.tr
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <td>{tx.date}</td>
                                <td>{tx.type}</td>
                                <td>{tx.landId}</td>
                                <td>
                                  <span className={`badge bg-${tx.status === "Confirmed" || tx.status === "Completed" || tx.status === "Success" ? "success" : "warning"}`}>
                                    {tx.status}
                                  </span>
                                </td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => showConfirmation(
                                      "Transaction Details",
                                      `Transaction Hash: ${tx.hash}\nLand ID: ${tx.landId}\nType: ${tx.type}`,
                                      null
                                    )}
                                  >
                                    View
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Configure Section */}
            {activeSection === "configure" && (
              <motion.div 
                className="row justify-content-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-primary text-white">
                      <h4 className="mb-0">
                        <FontAwesomeIcon icon={faCog} className="me-2" />
                        AI Assistant Settings
                      </h4>
                    </div>
                    <div className="card-body">
                      <div className="mb-4">
                        <h5 className="mb-3">
                          <FontAwesomeIcon icon={faRobot} className="me-2" />
                          Preferences
                        </h5>
                        <div className="form-check form-switch mb-3">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="marketAlerts" 
                            defaultChecked 
                          />
                          <label className="form-check-label" htmlFor="marketAlerts">
                            Receive market trend alerts
                          </label>
                        </div>
                        <div className="form-check form-switch mb-3">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="priceSuggestions" 
                            defaultChecked 
                          />
                          <label className="form-check-label" htmlFor="priceSuggestions">
                            Get automatic price suggestions
                          </label>
                        </div>
                        <div className="form-check form-switch mb-3">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="riskAnalysis" 
                          />
                          <label className="form-check-label" htmlFor="riskAnalysis">
                            Enable portfolio risk analysis
                          </label>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="mb-3">
                          <FontAwesomeIcon icon={faDatabase} className="me-2" />
                          Data Sources
                        </h5>
                        <div className="mb-3">
                          <label className="form-label">Market Data Frequency</label>
                          <select className="form-select">
                            <option>Real-time updates</option>
                            <option>Daily summary</option>
                            <option>Weekly report</option>
                          </select>
                        </div>
                      </div>
                      
                      <motion.button
                        className="btn btn-primary w-100"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setTransactionStatus({
                            type: "success",
                            message: "AI settings updated successfully"
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faCog} className="me-2" />
                        Save Settings
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
      <Footer />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
        confirmButtonText={confirmDialog.confirmButtonText}
        cancelButtonText={confirmDialog.cancelButtonText}
      />
    </div>
  );
};

export default AiPage;