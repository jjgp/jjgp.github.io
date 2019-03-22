import Typography from "typography"

const fonts = [
  "Avenir Next",
  "Helvetica Neue",
  "Segoe UI",
  "Helvetica",
  "Arial",
  "sans-serif",
]

const typography = new Typography({
  baseFontSize: "18px",
  baseLineHeight: 1.666,
  headerFontFamily: fonts,
  bodyFontFamily: fonts,
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
