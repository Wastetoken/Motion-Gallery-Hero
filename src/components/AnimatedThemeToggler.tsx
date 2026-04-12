import { useEffect, useRef, useState, useCallback } from "react"
import { flushSync } from "react-dom"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "../lib/utils"

type AnimatedThemeTogglerProps = {
  className?: string
}

export const AnimatedThemeToggler = ({ className }: AnimatedThemeTogglerProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme")
      if (saved) return saved === "dark"
      return document.documentElement.classList.contains("dark")
    }
    return true
  })

  useEffect(() => {
    const syncTheme = () => setDarkMode(document.documentElement.classList.contains("dark"))
    const observer = new MutationObserver(syncTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    
    syncTheme()
    
    return () => observer.disconnect()
  }, [])

  const onToggle = useCallback(async () => {
    if (!buttonRef.current) return

    // @ts-ignore - startViewTransition is not yet in the standard TS types
    if (!document.startViewTransition) {
      const toggled = !darkMode
      setDarkMode(toggled)
      document.documentElement.classList.toggle("dark", toggled)
      localStorage.setItem("theme", toggled ? "dark" : "light")
      return
    }

    // @ts-ignore
    await document.startViewTransition(() => {
      flushSync(() => {
        const toggled = !darkMode
        setDarkMode(toggled)
        document.documentElement.classList.toggle("dark", toggled)
        localStorage.setItem("theme", toggled ? "dark" : "light")
      })
    }).ready

    const { left, top, width, height } = buttonRef.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    const maxDistance = Math.hypot(
      Math.max(centerX, window.innerWidth - centerX),
      Math.max(centerY, window.innerHeight - centerY)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${centerX}px ${centerY}px)`,
          `circle(${maxDistance}px at ${centerX}px ${centerY}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [darkMode])

  return (
    <button
      ref={buttonRef}
      onClick={onToggle}
      aria-label="Switch theme"
      className={cn(
        "flex items-center justify-center p-2 rounded-full outline-none focus:outline-none active:outline-none focus:ring-0 cursor-pointer transition-colors duration-500",
        darkMode ? "text-white/20 hover:text-white" : "text-black/20 hover:text-black",
        className
      )}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.span
            key="sun-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: 25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
          >
            <Sun size={18} />
          </motion.span>
        ) : (
          <motion.span
            key="moon-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
          >
            <Moon size={18} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
