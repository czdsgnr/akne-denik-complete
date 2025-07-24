import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from './button'

const BottomSheet = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxHeight = '85vh',
  showCloseButton = true,
  footerContent = null,
  showFooter = false
}) => {
  const bottomSheetRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bottomSheetRef.current && !bottomSheetRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
      
      // Najít bottom navigation různými způsoby
      const bottomNav = document.querySelector('[data-bottom-navigation]') || 
                        document.querySelector('nav[class*="fixed"][class*="bottom"]') ||
                        document.querySelector('.fixed.bottom-0') ||
                        document.querySelector('nav:last-of-type')
      
      if (bottomNav) {
        bottomNav.style.visibility = 'hidden'
        bottomNav.style.zIndex = '0'
      }
    } else {
      document.body.style.overflow = 'unset'
      
      const bottomNav = document.querySelector('[data-bottom-navigation]') || 
                        document.querySelector('nav[class*="fixed"][class*="bottom"]') ||
                        document.querySelector('.fixed.bottom-0') ||
                        document.querySelector('nav:last-of-type')
      
      if (bottomNav) {
        bottomNav.style.visibility = 'visible'
        bottomNav.style.zIndex = '50'
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
      
      const bottomNav = document.querySelector('[data-bottom-navigation]') || 
                        document.querySelector('nav[class*="fixed"][class*="bottom"]') ||
                        document.querySelector('.fixed.bottom-0') ||
                        document.querySelector('nav:last-of-type')
      
      if (bottomNav) {
        bottomNav.style.visibility = 'visible'
        bottomNav.style.zIndex = '50'
      }
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Pozadí s blur efektem */}
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out" />

      {/* Bottom Sheet Container */}
      <div className="fixed inset-0 z-[100] flex items-end justify-center p-0">
        
        {/* Bottom Sheet Content */}
        <div 
          ref={bottomSheetRef}
          className="w-full max-w-2xl mx-auto bg-white rounded-t-3xl shadow-2xl transform transition-all duration-300 ease-out flex flex-col"
          style={{ 
            height: '85vh',
            maxHeight: '85vh'
          }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="hover:bg-gray-100 rounded-full p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          )}

          {/* Content s scrollem */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="px-6 py-4">
              {children}
            </div>
          </div>

          {/* Fixed footer - vždy viditelný na spodku */}
          {showFooter && footerContent && (
            <div className="flex-shrink-0 border-t border-gray-100 bg-white px-6 py-4 safe-area-pb">
              {footerContent}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default BottomSheet