import { useEffect, useRef } from 'react';

// Custom hook for mobile keyboard handling
export const useMobileKeyboard = () => {
  const originalViewportHeight = useRef(null);

  useEffect(() => {
    // Store original viewport height
    originalViewportHeight.current = window.innerHeight;

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const isKeyboardOpen = currentHeight < originalViewportHeight.current * 0.75;
      
      // Add CSS custom property to indicate keyboard state
      document.documentElement.style.setProperty(
        '--keyboard-open', 
        isKeyboardOpen ? '1' : '0'
      );
      
      // Add class for keyboard state
      if (isKeyboardOpen) {
        document.body.classList.add('keyboard-open');
      } else {
        document.body.classList.remove('keyboard-open');
      }
      
      // Adjust viewport for better mobile experience
      if (window.visualViewport) {
        document.documentElement.style.setProperty(
          '--viewport-height', 
          `${currentHeight}px`
        );
      }
    };

    // Listen for viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', handleViewportChange);
    }

    // Initial check
    handleViewportChange();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      } else {
        window.removeEventListener('resize', handleViewportChange);
      }
      
      // Cleanup
      document.body.classList.remove('keyboard-open');
      document.documentElement.style.removeProperty('--keyboard-open');
      document.documentElement.style.removeProperty('--viewport-height');
    };
  }, []);
};

// Component for handling mobile input focus
export const MobileInputHandler = ({ children, onFocus, onBlur }) => {
  const handleInputFocus = (e) => {
    // Prevent zoom on iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      e.target.style.fontSize = '16px';
    }
    
    // Scroll input into view with some padding
    setTimeout(() => {
      const rect = e.target.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      
      if (rect.bottom > viewportHeight * 0.6) {
        e.target.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 300); // Wait for keyboard animation
    
    onFocus?.(e);
  };

  const handleInputBlur = (e) => {
    // Reset font size to prevent iOS zoom
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      e.target.style.fontSize = '';
    }
    
    onBlur?.(e);
  };

  return (
    <div 
      onFocus={handleInputFocus} 
      onBlur={handleInputBlur}
      className="mobile-input-container"
    >
      {children}
    </div>
  );
}; 