import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ChevronUp, Grip } from 'lucide-react';

interface BottomDrawerProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onStateChange?: (state: 'collapsed' | 'partial' | 'expanded') => void;
}

export function BottomDrawer({ children, isOpen = true, onStateChange }: BottomDrawerProps) {
  const [drawerHeight, setDrawerHeight] = useState(0);
  const [currentState, setCurrentState] = useState<'collapsed' | 'partial' | 'expanded'>('partial');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const y = useMotionValue(0);
  
  // Calculate drawer positions based on viewport height
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight;
      setDrawerHeight(vh);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Drawer position configurations
  const positions = {
    expanded: 0,
    partial: drawerHeight * 0.4, // Show 60% of screen
    collapsed: drawerHeight * 0.85 // Show only 15% (handle + preview)
  };

  const backgroundOpacity = useTransform(
    y,
    [positions.expanded, positions.collapsed],
    [0.3, 0]
  );

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.y;
    
    let newState: 'collapsed' | 'partial' | 'expanded' = currentState;
    
    // Determine new state based on drag direction and velocity
    if (Math.abs(velocity) > 300) {
      // Fast swipe - move to next/previous state
      if (velocity > 0) {
        // Downward swipe
        newState = currentState === 'expanded' ? 'partial' : 'collapsed';
      } else {
        // Upward swipe  
        newState = currentState === 'collapsed' ? 'partial' : 'expanded';
      }
    } else {
      // Slow drag - snap to nearest position
      const currentY = y.get();
      const expandedThreshold = (positions.expanded + positions.partial) / 2;
      const collapsedThreshold = (positions.partial + positions.collapsed) / 2;
      
      if (currentY < expandedThreshold) {
        newState = 'expanded';
      } else if (currentY < collapsedThreshold) {
        newState = 'partial';
      } else {
        newState = 'collapsed';
      }
    }
    
    setCurrentState(newState);
    onStateChange?.(newState);
  };

  // Animate to position when state changes
  useEffect(() => {
    y.set(positions[currentState]);
  }, [currentState, positions, y]);

  const handleHandleClick = () => {
    const newState = currentState === 'expanded' ? 'partial' : 
                    currentState === 'partial' ? 'collapsed' : 'expanded';
    setCurrentState(newState);
    onStateChange?.(newState);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay */}
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none z-40"
        style={{ opacity: backgroundOpacity }}
      />
      
      {/* Drawer */}
      <motion.div
        ref={containerRef}
        className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl shadow-2xl border border-border"
        style={{
          height: drawerHeight,
          y
        }}
        drag="y"
        dragConstraints={{
          top: positions.expanded,
          bottom: positions.collapsed
        }}
        dragElastic={0.1}
        dragMomentum={false}
        whileDrag={{ 
          transition: { type: "spring", damping: 50, stiffness: 400 }
        }}
        onDragEnd={handleDragEnd}
        initial={{ y: positions.partial }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300
        }}
      >
        {/* Drag Handle */}
        <div 
          className="flex flex-col items-center pt-3 pb-2 cursor-pointer"
          onClick={handleHandleClick}
        >
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mb-2" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Grip className="h-4 w-4" />
            <span className="text-sm">
              {currentState === 'collapsed' && 'Tap to view venues'}
              {currentState === 'partial' && 'Swipe up for more'}
              {currentState === 'expanded' && 'Swipe down to minimize'}
            </span>
            <ChevronUp className={`h-4 w-4 transition-transform ${
              currentState === 'collapsed' ? 'rotate-180' : ''
            }`} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-4 pb-8">
            {children}
          </div>
        </div>
      </motion.div>
    </>
  );
}