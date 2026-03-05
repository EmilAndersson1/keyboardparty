import { SparklesBackground } from "@/components/effects/sparkles-background";

export const HomeHeroSection = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 h-screen w-full">
        <SparklesBackground
          id="home-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="h-full w-full"
          particleColor="#FFFFFF"
        />
      </div>
      <h1 className="relative z-20 text-center text-xl font-bold text-white md:text-2xl lg:text-3xl">
        Lets have some fun - Smash that keyboard and see what happens!
      </h1>
    </section>
  );
};
