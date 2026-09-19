import React, { useEffect, useRef, useState } from 'react';

const VantaBg = ({ children }) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let effectInstance = null;
    let intervalId = null;

    const initializeVantaNet = () => {
      // Check if global cdnjs window drivers are active and attached cleanly
      if (window.VANTA && window.VANTA.NET && vantaRef.current && !effectInstance) {
        try {
          effectInstance = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x6366f1,           // Bright Indigo Neon lines
            backgroundColor: 0x030712, // Deep Corporate Midnight Gray Hex (#030712)
            points: 11.0,              // Concentration node layout density
            maxDistance: 21.0,
            spacing: 16.0
          });
          setVantaEffect(effectInstance);
          clearInterval(intervalId); // Stop tracking loop once successfully mounted
          console.log("⚡ Vanta 3D Net Engine mounted successfully.");
        } catch (err) {
          console.error("Vanta build tracking fault:", err);
        }
      }
    };

    // Run immediate check
    initializeVantaNet();

    // Fallback interval loop to handle slow network loads safely
    intervalId = setInterval(initializeVantaNet, 150);

    // 📱 FIXED FOR SMALLER SCREENS: Recalculates canvas boundaries automatically on mobile layout updates
    const handleResizeResize = () => {
      if (effectInstance && typeof effectInstance.resize === 'function') {
        effectInstance.resize();
      }
    };
    window.addEventListener('resize', handleResizeResize);

    // Clean up memory blocks on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener('resize', handleResizeResize);
      if (effectInstance) effectInstance.destroy();
    };
  }, []);

  return (
    // Base container wrapper
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 relative overflow-x-hidden isolate">
      
      {/* INTERACTIVE VANTA CANVAS NODE LAYER */}
      <div 
        ref={vantaRef} 
        className="fixed inset-0 select-none z-0"
        style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          pointerEvents: 'auto', // Enforces mouse capture events
          opacity: 0.45          // Increased blending visibility for a high-end look
        }}
      />

      {/* CORE ACTIVE APPLICATION PANELS CONTENT SHEET */}
      <div className="relative z-10 w-full min-h-screen flex flex-col bg-transparent">
        {children}
      </div>

    </div>
  );
};

export default VantaBg;
