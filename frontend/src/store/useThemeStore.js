import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("murmur-theme")||"night",
  setTheme: (theme) => {
    
    
    localStorage.setItem("murmur-theme", theme)
    set({ theme })},


  
}))


