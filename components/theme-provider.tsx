import { ReactNode, createContext, useContext, useMemo } from "react";
import { useColorScheme } from "../hooks/use-color-scheme";

type ThemePalette = {
  scheme: "light" | "dark";
  background: string;
  surface: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
};

const lightPalette: ThemePalette = {
  scheme: "light",
  background: "#f6f7fb",
  surface: "#ffffff",
  card: "#ffffff",
  textPrimary: "#0b0d16",
  textSecondary: "#6a6f82",
  border: "#e3e6ef",
};

const darkPalette: ThemePalette = {
  scheme: "dark",
  background: "#040507",
  surface: "#0E1015",
  card: "#14171f",
  textPrimary: "#f5f6f8",
  textSecondary: "#a3a7b4",
  border: "#1f222c",
};

const ThemeContext = createContext<ThemePalette>(lightPalette);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const scheme = useColorScheme();
  const palette = useMemo(
    () => (scheme === "dark" ? darkPalette : lightPalette),
    [scheme]
  );

  return <ThemeContext.Provider value={palette}>{children}</ThemeContext.Provider>;
};

export const useThemePalette = () => useContext(ThemeContext);


