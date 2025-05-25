import React, { useState, useEffect, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faListCheck,
  faClockRotateLeft,
  faUserShield,
  faDatabase,
  faMagnifyingGlass,
  faArrowRightArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { WalletContext } from "./WalletContext";
import ConfirmationDialog from "./ConfirmationDialog";
import config from "../config";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ADMIN_ADDRESS = config.ADMIN_ADDRESS;

const AdminPanel = () => {
  const { isConnected, contract, account, connectWallet } =
    useContext(WalletContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [allLands, setAllLands] = useState([]);
  const [pastOwners, setPastOwners] = useState([]);
  const [landIdForHistory, setLandIdForHistory] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAdminStatus = useCallback(() => {
    if (!account) return;
    const isAdminAccount =
      account.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
    setIsAdmin(isAdminAccount);
    setAdminError(
      isAdminAccount
        ? ""
        : "This account does not have administrator privileges."
    );
  }, [account]);

  useEffect(() => {
    if (isConnected && account) {
      checkAdminStatus();
    }
  }, [isConnected, account, checkAdminStatus]);

  const fetchAllLands = useCallback(async () => {
    setIsLoading(true);
    if (!contract) {
      setAdminError("Cannot fetch lands: Contract missing.");
      setIsLoading(false);
      return;
    }

    if (!isAdmin) {
      setAdminError(
        "Only admin can perform this action. Please connect with the admin account."
      );
      setIsLoading(false);
      return;
    }

    try {
      const allLands = await contract.methods
        .getAllLands()
        .call({ from: account });
      setAllLands(allLands);
      setAdminError(
        allLands.length === 0 ? "No lands registered on the contract yet." : ""
      );
    } catch (error) {
      console.error("Error fetching all lands:", error);
      setAdminError(
        "Failed to fetch lands: " +
          (error.data?.message || error.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  }, [contract, isAdmin, account]);

  const fetchPastOwners = useCallback(async () => {
    if (!landIdForHistory) {
      alert("Please enter a Land ID");
      return;
    }

    setIsLoading(true);
    if (!contract) {
      alert("Cannot fetch history: Missing contract connection.");
      setIsLoading(false);
      return;
    }

    if (!isAdmin) {
      alert(
        "Only admin can perform this action. Please connect with the admin account."
      );
      setIsLoading(false);
      return;
    }

    try {
      const land = await contract.methods.lands(landIdForHistory).call();
      if (land.id === "0") {
        alert("Land ID does not exist");
        setIsLoading(false);
        return;
      }

      const history = await contract.methods
        .getPastOwnershipDetails(landIdForHistory)
        .call({ from: account });
      const processedHistory = history.map((item) => ({
        owner: item.owner,
        timestamp: Number(item.timestamp),
      }));

      setPastOwners(processedHistory);
      if (processedHistory.length === 0) {
        alert("No ownership history found for Land ID " + landIdForHistory);
      }
    } catch (error) {
      console.error("Error fetching past owners:", error);
      alert(
        "Failed to fetch past ownership details: " +
          (error.data?.message || error.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  }, [contract, isAdmin, landIdForHistory, account]);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setPastOwners([]);
    setLandIdForHistory("");
    setAllLands([]);
    setAdminError("");
  };

  return (
    <div className="admin-panel">
      <Navbar />
      <div className="container my-5 pt-5">
        <motion.h1
          className="text-center mb-4 page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FontAwesomeIcon icon={faShieldHalved} className="me-2" />
          Admin Dashboard
        </motion.h1>

        {!isConnected || !isAdmin ? (
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <motion.div
                className="card text-center shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="card-body p-4">
                  <FontAwesomeIcon
                    icon={faUserShield}
                    className="text-primary mb-3"
                    size="2x"
                  />
                  <h5 className="card-title mb-3">
                    Administrator Access Required
                  </h5>
                  <p className="text-muted mb-4">
                    Please connect with an account that has administrator
                    privileges
                  </p>

                  {!isConnected ? (
                    <motion.button
                      onClick={connectWallet}
                      className="btn btn-primary px-4 py-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Connect Wallet
                    </motion.button>
                  ) : (
                    <>
                      <div className="alert alert-warning mb-3 text-center">
                        <p className="mb-1">
                          <strong>Connected Account:</strong>{" "}
                          {config.shortenAddress(account)}
                        </p>
                        <p className="mb-0">
                          <strong>Admin Address:</strong>{" "}
                          {config.shortenAddress(ADMIN_ADDRESS)}
                        </p>
                      </div>
                      <p className="text-danger mb-3">
                        {adminError ||
                          "This account does not have administrator privileges."}
                      </p>
                      <motion.button
                        onClick={connectWallet}
                        className="btn btn-outline-primary px-4 py-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Connect Different Account
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="alert alert-success mb-4 text-center">
              <div className="d-flex flex-column align-items-center">
                <FontAwesomeIcon
                  icon={faShieldHalved}
                  className="mb-2"
                  size="lg"
                />
                <div>
                  <strong>Administrator Access Granted</strong>
                  <div className="text-muted small mt-1">{account}</div>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
              {[
                {
                  id: "show",
                  icon: faListCheck,
                  title: "All Land Records",
                  description: "View complete land registry",
                },
                {
                  id: "history",
                  icon: faClockRotateLeft,
                  title: "Ownership History",
                  description: "Track past ownership changes",
                },
              ].map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    className={`btn btn-admin-action d-flex flex-column align-items-center ${
                      activeSection === item.id ? "active" : ""
                    }`}
                    onClick={() => toggleSection(item.id)}
                  >
                    <div className="admin-icon mb-2">
                      <FontAwesomeIcon icon={item.icon} size="lg" />
                    </div>
                    <div>
                      <div className="fw-bold">{item.title}</div>
                      <small className="d-block text-white-80">
                        {item.description}
                      </small>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>

            {activeSection === "show" && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">
                    <FontAwesomeIcon icon={faDatabase} className="me-2" />
                    Land Registry
                  </h4>
                  <motion.button
                    className="btn btn-primary"
                    onClick={fetchAllLands}
                    disabled={isLoading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm me-1"></span>
                    ) : (
                      <FontAwesomeIcon icon={faDatabase} className="me-1" />
                    )}
                    Refresh Data
                  </motion.button>
                </div>

                {adminError && (
                  <div className="alert alert-danger mb-3">{adminError}</div>
                )}

                {allLands.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Plot</th>
                          <th>Location</th>
                          <th>Area</th>
                          <th>Owner</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allLands.map((land) => (
                          <tr key={land.id}>
                            <td className="fw-bold">{land.id}</td>
                            <td>{land.plotNumber}</td>
                            <td>
                              <div>
                                {land.city}, {land.district}
                              </div>
                              <small className="text-muted">{land.state}</small>
                            </td>
                            <td>{land.areaSqYd} sq.yd</td>
                            <td title={land.owner}>
                              {config.shortenAddress(land.owner)}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  land.isForSale ? "bg-success" : "bg-secondary"
                                }`}
                              >
                                {land.isForSale ? "For Sale" : "Not Listed"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FontAwesomeIcon
                      icon={faDatabase}
                      size="2x"
                      className="text-muted mb-3"
                    />
                    <p className="text-muted">
                      {adminError ||
                        'No land records found. Click "Refresh Data" to load.'}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === "history" && (
              <motion.div
                className="row justify-content-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="col-md-8">
                  <div className="card shadow-sm">
                    <div className="card-header bg-light">
                      <h4 className="mb-0">
                        <FontAwesomeIcon
                          icon={faClockRotateLeft}
                          className="me-2"
                        />
                        Ownership History Tracker
                      </h4>
                    </div>
                    <div className="card-body">
                      <div className="input-group mb-4">
                        <span className="input-group-text">
                          <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter Land ID"
                          value={landIdForHistory}
                          onChange={(e) => setLandIdForHistory(e.target.value)}
                        />
                        <motion.button
                          className="btn btn-primary"
                          onClick={fetchPastOwners}
                          disabled={isLoading}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {isLoading ? (
                            <span className="spinner-border spinner-border-sm me-1"></span>
                          ) : (
                            <FontAwesomeIcon
                              icon={faArrowRightArrowLeft}
                              className="me-1"
                            />
                          )}
                          Trace History
                        </motion.button>
                      </div>

                      {pastOwners.length > 0 && (
                        <div>
                          <h5 className="mb-3">
                            Ownership Timeline for Land ID: {landIdForHistory}
                          </h5>
                          <div className="timeline">
                            {pastOwners.map((owner, index) => (
                              <div key={index} className="timeline-item">
                                <div className="timeline-badge">
                                  {index + 1}
                                </div>
                                <div className="timeline-content">
                                  <div className="d-flex justify-content-between">
                                    <strong>
                                      {config.shortenAddress(owner.owner)}
                                    </strong>
                                    <small className="text-muted">
                                      {new Date(
                                        owner.timestamp * 1000
                                      ).toLocaleString()}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <ConfirmationDialog
              show={showDialog}
              title="Confirm Action"
              message="Are you sure you want to perform this action?"
              onConfirm={() => {
                setShowDialog(false);
                alert("Action confirmed!");
              }}
              onCancel={() => setShowDialog(false)}
            />
          </motion.div>
        )}
      </div>
      <Footer />

      <style jsx>{`
        .admin-panel {
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        .page-title {
          color: #2c3e50;
          font-weight: 700;
        }
        .btn-admin-action {
          width: 180px;
          padding: 1rem;
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          border: none;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .btn-admin-action.active {
          box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.3);
        }
        .btn-admin-action:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .admin-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }
        .timeline {
          position: relative;
          padding-left: 30px;
        }
        .timeline-item {
          position: relative;
          padding-bottom: 20px;
        }
        .timeline-badge {
          position: absolute;
          left: -15px;
          top: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #6a11cb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .timeline-content {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(106, 17, 203, 0.05);
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
