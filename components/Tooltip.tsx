import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    
    let top = 0;
    let left = 0;

    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    switch (position) {
      case 'bottom':
        top = rect.bottom + scrollY + 8;
        left = rect.left + scrollX + rect.width / 2;
        break;
      case 'left':
        top = rect.top + scrollY + rect.height / 2;
        left = rect.left + scrollX - 8;
        break;
      case 'right':
        top = rect.top + scrollY + rect.height / 2;
        left = rect.right + scrollX + 8;
        break;
      case 'top':
      default:
        top = rect.top + scrollY - 8;
        left = rect.left + scrollX + rect.width / 2;
        break;
    }

    setCoords({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible]);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  const getMotionProps = () => {
    switch (position) {
      case 'bottom':
        return {
          initial: { opacity: 0, scale: 0.95, x: '-50%', y: 10 },
          animate: { opacity: 1, scale: 1, x: '-50%', y: 0 },
          exit: { opacity: 0, scale: 0.95, x: '-50%', y: 10 }
        };
      case 'left':
        return {
          initial: { opacity: 0, scale: 0.95, x: 10, y: '-50%' },
          animate: { opacity: 1, scale: 1, x: '-100%', y: '-50%' },
          exit: { opacity: 0, scale: 0.95, x: 10, y: '-50%' }
        };
      case 'right':
        return {
          initial: { opacity: 0, scale: 0.95, x: -10, y: '-50%' },
          animate: { opacity: 1, scale: 1, x: 0, y: '-50%' },
          exit: { opacity: 0, scale: 0.95, x: -10, y: '-50%' }
        };
      case 'top':
      default:
        return {
          initial: { opacity: 0, scale: 0.95, x: '-50%', y: '-90%' },
          animate: { opacity: 1, scale: 1, x: '-50%', y: '-100%' },
          exit: { opacity: 0, scale: 0.95, x: '-50%', y: '-90%' }
        };
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'bottom': return 'bottom-full left-1/2 -translate-x-1/2 border-transparent border-b-slate-900 border-4';
      case 'left': return 'left-full top-1/2 -translate-y-1/2 border-transparent border-l-slate-900 border-4';
      case 'right': return 'right-full top-1/2 -translate-y-1/2 border-transparent border-r-slate-900 border-4';
      case 'top':
      default: return 'top-full left-1/2 -translate-x-1/2 border-transparent border-t-slate-900 border-4';
    }
  };

  if (!content) return <>{children}</>;

  return (
    <div 
      ref={triggerRef}
      className={`inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              {...getMotionProps()}
              transition={{ duration: 0.1, ease: "easeOut" }}
              style={{ 
                position: 'absolute',
                top: coords.top,
                left: coords.left,
                zIndex: 999999
              }}
              className="px-3 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-xl shadow-2xl whitespace-nowrap pointer-events-none border border-white/10"
            >
              {content}
              <div 
                className={`absolute ${getArrowClasses()}`} 
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
