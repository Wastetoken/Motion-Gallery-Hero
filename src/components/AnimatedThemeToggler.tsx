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
      return document.documentElement.classList.contains("dark")
    }
    return true
  })

  // Sync state with DOM class changes (from App.tsx or other sources)
  useEffect(() => {
    const syncTheme = () => {
      const isDark = document.documentElement.classList.contains("dark")
      if (isDark !== darkMode) setDarkMode(isDark)
    }
    
    const observer = new MutationObserver(syncTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [darkMode])

  const onToggle = useCallback(async () => {
    if (!buttonRef.current) return

    const toggle = () => {
      const isDark = document.documentElement.classList.contains("dark")
      const next = !isDark
      
      document.documentElement.classList.toggle("dark", next)
      localStorage.setItem("theme", next ? "dark" : "light")
      setDarkMode(next)
    }

    // @ts-ignore
    if (!document.startViewTransition) {
      toggle()
      return
    }

    const { left, top, width, height } = buttonRef.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    const maxDistance = Math.hypot(
      Math.max(centerX, window.innerWidth - centerX),
      Math.max(centerY, window.innerHeight - centerY)
    )

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        toggle()
      })
    })

    await transition.ready

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
        "flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full outline-none focus:outline-none active:scale-90 transition-all duration-300",
        darkMode ? "bg-white/5 text-white/40 hover:text-white hover:bg-white/10" : "bg-black/5 text-black/40 hover:text-black hover:bg-black/10",
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
