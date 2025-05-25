import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faTriangleExclamation, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const ConfirmationDialog = ({ 
  show, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  type = "default" // 'success', 'warning', 'danger', 'info'
}) => {
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: { opacity: 0, y: 20, scale: 0.95 }
  };

  // Visual configuration
  const getConfig = () => {
    switch(type) {
      case 'success':
        return {
          icon: faCircleCheck,
          iconColor: 'text-success',
          headerBg: 'bg-success bg-opacity-10',
          btnClass: 'btn-success',
          iconSize: '2x'
        };
      case 'warning':
        return {
          icon: faTriangleExclamation,
          iconColor: 'text-warning',
          headerBg: 'bg-warning bg-opacity-10',
          btnClass: 'btn-warning',
          iconSize: '2x'
        };
      case 'danger':
        return {
          icon: faTriangleExclamation,
          iconColor: 'text-danger',
          headerBg: 'bg-danger bg-opacity-10',
          btnClass: 'btn-danger',
          iconSize: '2x'
        };
      case 'info':
        return {
          icon: faInfoCircle,
          iconColor: 'text-info',
          headerBg: 'bg-info bg-opacity-10',
          btnClass: 'btn-info',
          iconSize: '2x'
        };
      default:
        return {
          icon: faInfoCircle,
          iconColor: 'text-primary',
          headerBg: 'bg-primary bg-opacity-10',
          btnClass: 'btn-primary',
          iconSize: '2x'
        };
    }
  };

  const { icon, iconColor, headerBg, btnClass, iconSize } = getConfig();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal-dialog modal-dialog-centered"
            variants={modalVariants}
          >
            <div className="modal-content border-0 shadow-lg overflow-hidden">
              {/* Header with animated icon */}
              <div className={`modal-header ${headerBg} py-3`}>
                <div className="d-flex align-items-center w-100">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <FontAwesomeIcon 
                      icon={icon} 
                      className={`${iconColor} me-3`}
                      size={iconSize}
                    />
                  </motion.div>
                  <h5 className="modal-title mb-0 fw-bold fs-5 flex-grow-1">
                    {title}
                  </h5>
                  <motion.button
                    type="button"
                    className="btn-close"
                    onClick={onCancel}
                    aria-label="Close"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </div>
              </div>
              
              {/* Body with entrance animation */}
              <motion.div
                className="modal-body py-4 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="mb-0 fs-6 text-muted">
                  {message}
                </p>
              </motion.div>
              
              {/* Footer with animated buttons */}
              <div className="modal-footer bg-light py-3 px-4">
                <div className="d-flex justify-content-end w-100 gap-3">
                  <motion.button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onCancel}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: 'rgba(0,0,0,0.05)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {cancelButtonText}
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    className={`btn ${btnClass}`}
                    onClick={onConfirm}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {confirmButtonText}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;