

import { useEffect, useState } from "react";

function Toast({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(false);

  // Animate in when message appears
  useEffect(() => {
    if (message) {
      setVisible(true);
      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // wait for fade-out animation
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  // Different background colours per type
  const colours = {
    success: "#166534",
    error:   "#991b1b",
    info:    "#1e3a5f",
    warning: "#92400e",
  };

  const icons = {
    success: "✅",
    error:   "❌",
    info:    "ℹ️",
    warning: "⚠️",
  };

  return (
    <div
      style={{
        position:   "fixed",
        bottom:     "28px",
        left:       "50%",
        transform:  visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(20px)",
        opacity:    visible ? 1 : 0,
        transition: "all 0.3s ease",
        background: colours[type] || colours.info,
        color:      "white",
        padding:    "12px 24px",
        borderRadius: "99px",
        fontSize:   "0.9rem",
        fontWeight: "500",
        zIndex:     9999,
        whiteSpace: "nowrap",
        boxShadow:  "0 4px 20px rgba(0,0,0,0.3)",
        display:    "flex",
        gap:        "8px",
        alignItems: "center",
      }}
    >
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}

export default Toast;
