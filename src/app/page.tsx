import {
  Navbar,
  Hero,
  ProblemStatement,
  HowItWorks,
  Features,
  Mission,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemStatement />
        <HowItWorks />
        <Features />
        <Mission />
      </main>
      <Footer />
    </>
  );
}
