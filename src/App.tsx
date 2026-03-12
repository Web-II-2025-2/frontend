import HeroSection from "./components/layout/heroSection"
import NavBar from "./components/layout/navbar"

function App() {
  return (
    <>
      <NavBar />
      <HeroSection />

      <div style={{ height: "200vh", background: "black", color: "white" }}>
        <h1>teste scroll</h1>
      </div>
    </>
  )
}

export default App
