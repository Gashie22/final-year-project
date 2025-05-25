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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileSignature,
  faCheckCircle,
  faMapMarkedAlt,
  faGlobeAfrica,
  faExchangeAlt,
  faShieldAlt,
  faHome,
  faStore,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";

// Zimbabwe districts array
const zimbabweDistricts = [
  "Bikita",
  "Bindura",
  "Binga",
  "Buhera",
  "Bulilima",
  "Bubi",
  "Chegutu",
  "Chimanimani",
  "Chipinge",
  "Chiredzi",
  "Chirumhanzu",
  "Chitungwiza",
  "Chivi",
  "Epworth",
  "Goromonzi",
  "Gokwe North",
  "Gokwe South",
  "Gutu",
  "Gwanda",
  "Gweru",
  "Harare",
  "Hwange",
  "Hurungwe",
  "Insiza",
  "Kariba",
  "Kwekwe",
  "Lupane",
  "Makoni",
  "Makonde",
  "Mangwe",
  "Marondera",
  "Masvingo",
  "Matobo",
  "Mazowe",
  "Mbire",
  "Mberengwa",
  "Mhondoro-Ngezi",
  "Mount Darwin",
  "Mudzi",
  "Murehwa",
  "Mutare",
  "Mutasa",
  "Mutoko",
  "Mwenezi",
  "Muzarabani",
  "Nkayi",
  "Nyanga",
  "Rushinga",
  "Sanyati",
  "Seke",
  "Shamva",
  "Shurugwi",
  "Tsholotsho",
  "Umguza",
  "Umzingwane",
  "Uzumba-Maramba-Pfungwe (UMP)",
  "Wedza (Hwedza)",
  "Zaka",
  "Zvishavane",
  "Zvimba",
];

const ManageLandPage = () => {
  const { isConnected, contract, account, connectWallet, getAccountName } =
    useContext(WalletContext);
  const [plotNumber, setPlotNumber] = useState("");
  const [area, setArea] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [areaSqYd, setAreaSqYd] = useState("");
  const [landIdToVerify, setLandIdToVerify] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState("");
  const [userLands, setUserLands] = useState([]);
  const [landsForSale, setLandsForSale] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeSection, setActiveSection] = useState(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState({
    register: false,
    verify: false,
    show: false,
    explore: false,
    approve: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [transactionStatus, setTransactionStatus] = useState(null);

  const fetchUserLands = useCallback(
    async (userAccount) => {
      if (!contract || !userAccount) return;
      try {
        setSectionLoading((prev) => ({ ...prev, show: true }));
        const landIds = await contract.methods
          .getLandsByOwner(userAccount)
          .call();
        const lands = await Promise.all(
          landIds.map(async (id) => {
            const land = await contract.methods.lands(id).call();
            return {
              id,
              plotNumber: land.plotNumber,
              area: land.area,
              district: land.district,
              city: land.city,
              state: land.state,
              areaSqYd: land.areaSqYd,
              owner: getAccountName(land.owner),
              isForSale: land.isForSale,
            };
          })
        );
        setUserLands(lands);
      } catch (error) {
        console.error("Error fetching user lands:", error);
        setTransactionStatus({
          type: "error",
          message:
            "Failed to fetch your lands: " + (error.message || "Unknown error"),
        });
      } finally {
        setSectionLoading((prev) => ({ ...prev, show: false }));
      }
    },
    [contract, getAccountName]
  );

  const fetchLandsForSale = useCallback(async () => {
    if (!contract) return;
    try {
      setSectionLoading((prev) => ({ ...prev, explore: true }));
      const totalLands = await contract.methods.landCount().call();
      const lands = [];
      for (let i = 1; i <= totalLands; i++) {
        const land = await contract.methods.lands(i).call();
        if (land.isForSale) {
          lands.push({
            id: i,
            plotNumber: land.plotNumber,
            area: land.area,
            district: land.district,
            city: land.city,
            state: land.state,
            areaSqYd: land.areaSqYd,
            owner: getAccountName(land.owner),
          });
        }
      }
      setLandsForSale(lands);
    } catch (error) {
      console.error("Error fetching lands for sale:", error);
      setTransactionStatus({
        type: "error",
        message:
          "Failed to fetch lands for sale: " +
          (error.message || "Unknown error"),
      });
    } finally {
      setSectionLoading((prev) => ({ ...prev, explore: false }));
    }
  }, [contract, getAccountName]);

  const fetchPendingRequests = useCallback(
    async (userAccount) => {
      if (!contract || !userAccount) return;
      try {
        setSectionLoading((prev) => ({ ...prev, approve: true }));
        const pendingIds = await contract.methods
          .getPendingTransferRequests(userAccount)
          .call();
        const requests = await Promise.all(
          pendingIds.map(async (id) => {
            const land = await contract.methods.lands(id).call();
            return {
              id,
              plotNumber: land.plotNumber,
              area: land.area,
              district: land.district,
              city: land.city,
              state: land.state,
              areaSqYd: land.areaSqYd,
              owner: getAccountName(land.owner),
              requester: getAccountName(land.transferRequest),
            };
          })
        );
        setPendingRequests(requests);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        setTransactionStatus({
          type: "error",
          message:
            "Failed to fetch pending requests: " +
            (error.message || "Unknown error"),
        });
      } finally {
        setSectionLoading((prev) => ({ ...prev, approve: false }));
      }
    },
    [contract, getAccountName]
  );

  useEffect(() => {
    if (isConnected && account) {
      fetchUserLands(account);
      fetchLandsForSale();
      fetchPendingRequests(account);
    }
  }, [
    isConnected,
    account,
    contract,
    fetchUserLands,
    fetchLandsForSale,
    fetchPendingRequests,
  ]);

  const validateForm = () => {
    const errors = {};
    if (!plotNumber.trim()) errors.plotNumber = "Plot number is required";
    if (!area.trim()) errors.area = "Area is required";
    if (!district.trim()) errors.district = "District is required";
    if (!city.trim()) errors.city = "City is required";
    if (!state.trim()) errors.state = "State is required";
    if (!areaSqYd || areaSqYd <= 0)
      errors.areaSqYd = "Valid area in sq. yards is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterLandConfirmation = () => {
    if (!validateForm()) return;

    setConfirmDialog({
      show: true,
      title: "Confirm Land Registration",
      message: `Are you sure you want to register this land with the following details?
    \nPlot Number: ${plotNumber}
    \nArea: ${area}
    \nDistrict: ${district}
    \nCity: ${city}
    \nState: ${state}
    \nArea (sq. yd): ${areaSqYd}`,
      onConfirm: performRegisterLand,
      onCancel: () => setConfirmDialog({ ...confirmDialog, show: false }),
      confirmButtonText: "Register",
      cancelButtonText: "Cancel",
    });
  };

  const performRegisterLand = async () => {
    setConfirmDialog({ ...confirmDialog, show: false });

    if (!contract || !account) {
      setTransactionStatus({
        type: "error",
        message: !contract
          ? "Contract not initialized. Please ensure the wallet is connected."
          : "No wallet connected. Please connect your wallet.",
      });
      return;
    }

    try {
      setIsLoading(true);
      setSectionLoading((prev) => ({ ...prev, register: true }));
      setTransactionStatus({ type: "pending", message: "Registering land..." });

      const tx = await contract.methods
        .registerLand(plotNumber, area, district, city, state, areaSqYd)
        .send({ from: account, gas: 3000000 });

      setTransactionStatus({
        type: "success",
        message: "Land registered successfully!",
        hash: tx.transactionHash,
      });

      setPlotNumber("");
      setArea("");
      setDistrict("");
      setCity("");
      setState("");
      setAreaSqYd("");
      setFormErrors({});
      fetchUserLands(account);
    } catch (error) {
      console.error("Error registering land:", error);
      setTransactionStatus({
        type: "error",
        message:
          "Failed to register land: " + (error.message || "Unknown error"),
      });
    } finally {
      setIsLoading(false);
      setSectionLoading((prev) => ({ ...prev, register: false }));
    }
  };

  const handlePutLandForSaleConfirmation = (landId, plotNum) => {
    setConfirmDialog({
      show: true,
      title: "Confirm Land For Sale",
      message: `Are you sure you want to put Land ID ${landId} (Plot Number: ${plotNum}) for sale? This will allow other users to request ownership transfer.`,
      onConfirm: () => performPutLandForSale(landId),
      onCancel: () => setConfirmDialog({ ...confirmDialog, show: false }),
      confirmButtonText: "Put For Sale",
      cancelButtonText: "Cancel",
    });
  };

  const performPutLandForSale = async (landId) => {
    setConfirmDialog({ ...confirmDialog, show: false });

    if (!contract || !account || !landId) return;
    try {
      setIsLoading(true);
      setTransactionStatus({
        type: "pending",
        message: "Setting land for sale...",
      });

      const tx = await contract.methods
        .putLandForSale(landId)
        .send({ from: account });

      setTransactionStatus({
        type: "success",
        message: `Land ID ${landId} marked for sale!`,
        hash: tx.transactionHash,
      });

      fetchUserLands(account);
      fetchLandsForSale();
      fetchPendingRequests(account);
    } catch (error) {
      console.error("Error putting land for sale:", error);
      setTransactionStatus({
        type: "error",
        message:
          "Failed to mark land for sale: " + (error.message || "Unknown error"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestTransferConfirmation = (landId, plotNum, owner) => {
    setConfirmDialog({
      show: true,
      title: "Confirm Transfer Request",
      message: `Are you sure you want to request ownership transfer for Land ID ${landId} (Plot Number: ${plotNum}) from ${owner}?`,
      onConfirm: () => performRequestTransfer(landId),
      onCancel: () => setConfirmDialog({ ...confirmDialog, show: false }),
      confirmButtonText: "Request Transfer",
      cancelButtonText: "Cancel",
    });
  };

  const performRequestTransfer = async (landId) => {
    setConfirmDialog({ ...confirmDialog, show: false });

    if (!contract || !account || !landId) return;
    try {
      setIsLoading(true);
      setTransactionStatus({
        type: "pending",
        message: "Requesting transfer...",
      });

      const tx = await contract.methods
        .requestTransfer(landId)
        .send({ from: account });

      setTransactionStatus({
        type: "success",
        message: `Transfer request submitted for Land ID ${landId}!`,
        hash: tx.transactionHash,
      });

      fetchLandsForSale();
      fetchPendingRequests(account);
    } catch (error) {
      console.error("Error requesting transfer:", error);
      setTransactionStatus({
        type: "error",
        message:
          "Failed to request transfer: " + (error.message || "Unknown error"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveTransferConfirmation = (landId, requester) => {
    setConfirmDialog({
      show: true,
      title: "Confirm Ownership Transfer",
      message: `Are you sure you want to approve the ownership transfer of Land ID ${landId} to ${requester}? This action is irreversible.`,
      onConfirm: () => performApproveTransfer(landId),
      onCancel: () => setConfirmDialog({ ...confirmDialog, show: false }),
      confirmButtonText: "Approve Transfer",
      cancelButtonText: "Cancel",
    });
  };

  const performApproveTransfer = async (landId) => {
    setConfirmDialog({ ...confirmDialog, show: false });

    if (!contract || !account || !landId) return;
    try {
      setIsLoading(true);
      setTransactionStatus({
        type: "pending",
        message: "Approving transfer...",
      });

      const tx = await contract.methods
        .approveTransfer(landId)
        .send({ from: account });

      setTransactionStatus({
        type: "success",
        message: `Transfer approved for Land ID ${landId}!`,
        hash: tx.transactionHash,
      });

      fetchUserLands(account);
      fetchLandsForSale();
      fetchPendingRequests(account);
    } catch (error) {
      console.error("Error approving transfer:", error);
      setTransactionStatus({
        type: "error",
        message:
          "Failed to approve transfer: " + (error.message || "Unknown error"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const denyTransfer = async (landId) => {
    if (!contract || !account || !landId) return;
    try {
      setIsLoading(true);
      setTransactionStatus({ type: "pending", message: "Denying transfer..." });

      const tx = await contract.methods
        .denyTransfer(landId)
        .send({ from: account });

      setTransactionStatus({
        type: "success",
        message: `Transfer denied for Land ID ${landId}!`,
        hash: tx.transactionHash,
      });

      fetchPendingRequests(account);
      fetchLandsForSale();
    } catch (error) {
      console.error("Error denying transfer:", error);
      setTransactionStatus({
        type: "error",
        message:
          "Failed to deny transfer: " + (error.message || "Unknown error"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLand = async () => {
    if (!contract || !landIdToVerify) {
      setVerificationError("Please enter a valid Land ID");
      return;
    }

    try {
      setSectionLoading((prev) => ({ ...prev, verify: true }));
      setVerificationError("");
      setVerificationResult(null);

      const result = await contract.methods.verifyLand(landIdToVerify).call();

      if (result[6] === "0x0000000000000000000000000000000000000000") {
        setVerificationError(
          "The given Land ID is not associated with any registered land in the records."
        );
      } else {
        setVerificationResult({
          plotNumber: result[0],
          area: result[1],
          district: result[2],
          city: result[3],
          state: result[4],
          areaSqYd: result[5],
          owner: getAccountName(result[6]),
        });
      }
    } catch (error) {
      console.error("Error verifying land:", error);
      setVerificationError("Failed to verify land. Please check the Land ID.");
    } finally {
      setSectionLoading((prev) => ({ ...prev, verify: false }));
    }
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setVerificationResult(null);
    setVerificationError("");
    setTransactionStatus(null);
    setFormErrors({});
  };

  return (
    <div className="manage-land-page">
      <Navbar />
      <div className="container my-5 pt-5">
        <motion.h1
          className="text-center mb-4 page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Land Management Portal
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
              {isLoading ? (
                <LoadingSpinner />
              ) : (
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
                  section: "register",
                  icon: faFileSignature,
                  text: "Register Land",
                  description:
                    "Securely record new land properties on the blockchain",
                  tooltip:
                    "Permanently register land details with cryptographic proof",
                },
                {
                  section: "verify",
                  icon: faCheckCircle,
                  text: "Verify Ownership",
                  description: "Authenticate land records instantly",
                  tooltip:
                    "Verify land ownership with tamper-proof blockchain records",
                },
                {
                  section: "show",
                  icon: faMapMarkedAlt,
                  text: "My Lands",
                  description: "View your registered properties",
                  tooltip: "Access all your land holdings in one place",
                },
                {
                  section: "explore",
                  icon: faGlobeAfrica,
                  text: "Marketplace",
                  description: "Discover lands available for transfer",
                  tooltip: "Browse lands offered by other owners",
                },
                {
                  section: "approve",
                  icon: faHandshake,
                  text: "Transfer Requests",
                  description: "Manage ownership changes",
                  tooltip: "Approve or deny incoming transfer requests",
                },
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
                      activeSection === btn.section ? "active" : ""
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
                      <small className="d-block text-white-80">
                        {btn.description}
                      </small>
                    </div>
                    <Tooltip text={btn.tooltip} />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Register Land Section */}
            {activeSection === "register" && (
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
                        <FontAwesomeIcon
                          icon={faFileSignature}
                          className="me-2"
                        />
                        Register New Land
                      </h4>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Plot Number</label>
                          <input
                            type="text"
                            className={`form-control ${
                              formErrors.plotNumber ? "is-invalid" : ""
                            }`}
                            placeholder="Enter plot number"
                            value={plotNumber}
                            onChange={(e) => setPlotNumber(e.target.value)}
                          />
                          {formErrors.plotNumber && (
                            <div className="invalid-feedback">
                              {formErrors.plotNumber}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Area</label>
                          <input
                            type="text"
                            className={`form-control ${
                              formErrors.area ? "is-invalid" : ""
                            }`}
                            placeholder="Enter area"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                          />
                          {formErrors.area && (
                            <div className="invalid-feedback">
                              {formErrors.area}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">District</label>
                          <select
                            className={`form-select ${
                              formErrors.district ? "is-invalid" : ""
                            }`}
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                          >
                            <option value="">Select District</option>
                            {zimbabweDistricts.map((dist) => (
                              <option key={dist} value={dist}>
                                {dist}
                              </option>
                            ))}
                          </select>
                          {formErrors.district && (
                            <div className="invalid-feedback">
                              {formErrors.district}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">City</label>
                          <select
                            className={`form-select ${
                              formErrors.city ? "is-invalid" : ""
                            }`}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          >
                            <option value="">Select a city</option>
                            {[
                              "Harare",
                              "Bulawayo",
                              "Chitungwiza",
                              "Mutare",
                              "Gweru",
                              "Epworth",
                              "Kwekwe",
                              "Kadoma",
                              "Masvingo",
                              "Chinhoyi",
                              "Marondera",
                              "Norton",
                              "Chegutu",
                              "Bindura",
                              "Zvishavane",
                              "Victoria Falls",
                              "Hwange",
                              "Redcliff",
                              "Ruwa",
                              "Rusape",
                              "Chiredzi",
                              "Beitbridge",
                              "Kariba",
                              "Karoi",
                              "Gokwe",
                              "Chipinge",
                              "Shurugwi",
                              "Gwanda",
                              "Mashava",
                              "Chivhu",
                              "Shamva",
                            ].map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                          {formErrors.city && (
                            <div className="invalid-feedback">
                              {formErrors.city}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Province</label>
                          <select
                            className={`form-select ${
                              formErrors.state ? "is-invalid" : ""
                            }`}
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                          >
                            <option value="">Select a province</option>
                            {[
                              "Bulawayo",
                              "Harare",
                              "Manicaland",
                              "Mashonaland Central",
                              "Mashonaland East",
                              "Mashonaland West",
                              "Masvingo",
                              "Matabeleland North",
                              "Matabeleland South",
                              "Midlands",
                            ].map((province) => (
                              <option key={province} value={province}>
                                {province}
                              </option>
                            ))}
                          </select>
                          {formErrors.state && (
                            <div className="invalid-feedback">
                              {formErrors.state}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Area (sq. yards)</label>
                          <input
                            type="number"
                            className={`form-control ${
                              formErrors.areaSqYd ? "is-invalid" : ""
                            }`}
                            placeholder="Enter area in square yards"
                            value={areaSqYd}
                            onChange={(e) => setAreaSqYd(e.target.value)}
                          />
                          {formErrors.areaSqYd && (
                            <div className="invalid-feedback">
                              {formErrors.areaSqYd}
                            </div>
                          )}
                        </div>

                        <div className="col-12 mt-3">
                          <motion.button
                            className="btn btn-primary w-100 submit-btn"
                            onClick={handleRegisterLandConfirmation}
                            disabled={sectionLoading.register}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {sectionLoading.register ? (
                              <LoadingSpinner />
                            ) : (
                              <>
                                <FontAwesomeIcon
                                  icon={faFileSignature}
                                  className="me-2"
                                />
                                Register Land Property
                                <span className="btn-ripple-effect"></span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Verify Land Section */}
            {activeSection === "verify" && (
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
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="me-2"
                        />
                        Verify Land Ownership
                      </h4>
                    </div>
                    <div className="card-body">
                      <div className="mb-4">
                        <label className="form-label">Land ID</label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Land ID to verify"
                            value={landIdToVerify}
                            onChange={(e) => setLandIdToVerify(e.target.value)}
                          />
                          <motion.button
                            className="btn btn-primary verify-btn"
                            onClick={verifyLand}
                            disabled={sectionLoading.verify}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {sectionLoading.verify ? (
                              <LoadingSpinner />
                            ) : (
                              <>
                                <FontAwesomeIcon
                                  icon={faCheckCircle}
                                  className="me-2"
                                />
                                Verify
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>

                      {verificationResult && (
                        <motion.div
                          className="card verification-card mt-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Verification Successful</h5>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6">
                                <p>
                                  <strong>Land ID:</strong> {landIdToVerify}
                                </p>
                                <p>
                                  <strong>Plot Number:</strong>{" "}
                                  {verificationResult.plotNumber}
                                </p>
                                <p>
                                  <strong>Area:</strong>{" "}
                                  {verificationResult.area}
                                </p>
                                <p>
                                  <strong>District:</strong>{" "}
                                  {verificationResult.district}
                                </p>
                              </div>
                              <div className="col-md-6">
                                <p>
                                  <strong>City:</strong>{" "}
                                  {verificationResult.city}
                                </p>
                                <p>
                                  <strong>State:</strong>{" "}
                                  {verificationResult.state}
                                </p>
                                <p>
                                  <strong>Area (sq. yd):</strong>{" "}
                                  {verificationResult.areaSqYd}
                                </p>
                                <p>
                                  <strong>Owner:</strong>{" "}
                                  {verificationResult.owner}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {verificationError && (
                        <motion.div
                          className="alert alert-danger mt-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <FontAwesomeIcon
                            icon={faShieldAlt}
                            className="me-2"
                          />
                          {verificationError}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Show Lands Section */}
            {activeSection === "show" && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">
                      <FontAwesomeIcon icon={faMapMarkedAlt} className="me-2" />
                      My Land Properties
                    </h4>
                  </div>
                  <div className="card-body">
                    {sectionLoading.show ? (
                      <div className="text-center py-5">
                        <LoadingSpinner size="medium" />
                        <p className="mt-3">Loading your land properties...</p>
                      </div>
                    ) : userLands.length > 0 ? (
                      <div className="row">
                        {userLands.map((land, index) => (
                          <motion.div
                            key={land.id}
                            className="col-md-6 col-lg-4 mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="card h-100 land-card">
                              <div className="card-header bg-light">
                                <h5 className="mb-0">
                                  <FontAwesomeIcon
                                    icon={faHome}
                                    className="me-2 text-primary"
                                  />
                                  Land ID: {land.id}
                                </h5>
                              </div>
                              <div className="card-body">
                                <div className="mb-3">
                                  <p className="mb-1">
                                    <strong>Plot Number:</strong>{" "}
                                    {land.plotNumber}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Location:</strong> {land.city},{" "}
                                    {land.district}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Area:</strong> {land.areaSqYd} sq.
                                    yd
                                  </p>
                                  <p className="mb-1">
                                    <strong>Status:</strong>
                                    <span
                                      className={
                                        land.isForSale
                                          ? "text-success ms-2"
                                          : "text-secondary ms-2"
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={land.isForSale ? faStore : faHome}
                                        className="me-1"
                                      />
                                      {land.isForSale
                                        ? "Available for Sale"
                                        : "Not Listed"}
                                    </span>
                                  </p>
                                </div>
                                {!land.isForSale && (
                                  <motion.button
                                    className="btn btn-outline-primary w-100"
                                    onClick={() =>
                                      handlePutLandForSaleConfirmation(
                                        land.id,
                                        land.plotNumber
                                      )
                                    }
                                    disabled={isLoading}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    {isLoading ? (
                                      <LoadingSpinner />
                                    ) : (
                                      <>
                                        <FontAwesomeIcon
                                          icon={faStore}
                                          className="me-2"
                                        />
                                        List for Sale
                                      </>
                                    )}
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        <FontAwesomeIcon icon={faHome} className="me-2" />
                        No lands currently registered under your account.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Explore Lands Section */}
            {activeSection === "explore" && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">
                      <FontAwesomeIcon icon={faGlobeAfrica} className="me-2" />
                      Land Marketplace
                    </h4>
                  </div>
                  <div className="card-body">
                    {sectionLoading.explore ? (
                      <div className="text-center py-5">
                        <LoadingSpinner size="medium" />
                        <p className="mt-3">Loading available properties...</p>
                      </div>
                    ) : landsForSale.length > 0 ? (
                      <div className="row">
                        {landsForSale.map((land, index) => (
                          <motion.div
                            key={land.id}
                            className="col-md-6 col-lg-4 mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="card h-100 land-card">
                              <div className="card-header bg-light">
                                <h5 className="mb-0">
                                  <FontAwesomeIcon
                                    icon={faStore}
                                    className="me-2 text-success"
                                  />
                                  Land ID: {land.id}
                                </h5>
                              </div>
                              <div className="card-body">
                                <div className="mb-3">
                                  <p className="mb-1">
                                    <strong>Plot Number:</strong>{" "}
                                    {land.plotNumber}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Location:</strong> {land.city},{" "}
                                    {land.district}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Area:</strong> {land.areaSqYd} sq.
                                    yd
                                  </p>
                                  <p className="mb-1">
                                    <strong>Owner:</strong> {land.owner}
                                  </p>
                                </div>
                                {land.owner !== getAccountName(account) && (
                                  <motion.button
                                    className="btn btn-success w-100"
                                    onClick={() =>
                                      handleRequestTransferConfirmation(
                                        land.id,
                                        land.plotNumber,
                                        land.owner
                                      )
                                    }
                                    disabled={isLoading}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    {isLoading ? (
                                      <LoadingSpinner />
                                    ) : (
                                      <>
                                        <FontAwesomeIcon
                                          icon={faExchangeAlt}
                                          className="me-2"
                                        />
                                        Request Ownership
                                      </>
                                    )}
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        <FontAwesomeIcon icon={faStore} className="me-2" />
                        Currently no lands available in the marketplace.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Approve Transfer Section */}
            {activeSection === "approve" && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">
                      <FontAwesomeIcon icon={faHandshake} className="me-2" />
                      Pending Transfer Requests
                    </h4>
                  </div>
                  <div className="card-body">
                    {sectionLoading.approve ? (
                      <div className="text-center py-5">
                        <LoadingSpinner size="medium" />
                        <p className="mt-3">Loading transfer requests...</p>
                      </div>
                    ) : pendingRequests.length > 0 ? (
                      <div className="row">
                        {pendingRequests.map((request, index) => (
                          <motion.div
                            key={request.id}
                            className="col-md-6 col-lg-4 mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="card h-100 land-card">
                              <div className="card-header bg-light">
                                <h5 className="mb-0">
                                  <FontAwesomeIcon
                                    icon={faExchangeAlt}
                                    className="me-2 text-warning"
                                  />
                                  Request for Land ID: {request.id}
                                </h5>
                              </div>
                              <div className="card-body">
                                <div className="mb-3">
                                  <p className="mb-1">
                                    <strong>Plot Number:</strong>{" "}
                                    {request.plotNumber}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Current Owner:</strong>{" "}
                                    {request.owner}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Requested By:</strong>{" "}
                                    {request.requester}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Location:</strong> {request.city},{" "}
                                    {request.district}
                                  </p>
                                </div>
                                <div className="d-flex gap-2">
                                  <motion.button
                                    className="btn btn-success flex-grow-1"
                                    onClick={() =>
                                      handleApproveTransferConfirmation(
                                        request.id,
                                        request.requester
                                      )
                                    }
                                    disabled={isLoading}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    {isLoading ? (
                                      <LoadingSpinner />
                                    ) : (
                                      <>
                                        <FontAwesomeIcon
                                          icon={faHandshake}
                                          className="me-2"
                                        />
                                        Approve
                                      </>
                                    )}
                                  </motion.button>
                                  <motion.button
                                    className="btn btn-danger flex-grow-1"
                                    onClick={() => denyTransfer(request.id)}
                                    disabled={isLoading}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    {isLoading ? (
                                      <LoadingSpinner />
                                    ) : (
                                      <>
                                        <FontAwesomeIcon
                                          icon={faShieldAlt}
                                          className="me-2"
                                        />
                                        Deny
                                      </>
                                    )}
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        <FontAwesomeIcon icon={faHandshake} className="me-2" />
                        No pending transfer requests at this time.
                      </div>
                    )}
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

export default ManageLandPage;
