
import MovieCard from "@/components/movieCard";
import MovieSlider from "@/components/movieSlider";
import { useEffect } from "react";

export default function Home() {
  // useEffect(() => {
  //   let lastScrollY = window.scrollY;

  //   const smoothScroll = (targetY: number, duration: number) => {
  //     const startY = window.scrollY;
  //     const diffY = targetY - startY;
  //     let start: number;
  
  //     const step = (timestamp: number) => {
  //       if (!start) start = timestamp;
  //       const time = timestamp - start;
  //       const percent = Math.min(time / duration, 1);
  //       window.scrollTo(0, startY + diffY * percent);
  //       if (time < duration) {
  //         requestAnimationFrame(step);
  //       }
  //     };
  
  //     requestAnimationFrame(step);
  //   };

  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY;
  //     const sliderOffsetTop = document.getElementById("slider")!.offsetTop;
  //     const moviesOffsetTop = document.getElementById("movies")!.offsetTop;

  //     if (currentScrollY > lastScrollY && currentScrollY < moviesOffsetTop) {
  //       // Scroll down
  //       smoothScroll(moviesOffsetTop, 50);
  //     } else if (currentScrollY < lastScrollY && currentScrollY > sliderOffsetTop) {
  //       // Scroll up
  //       smoothScroll(sliderOffsetTop, 50);
  //     }

  //     lastScrollY = currentScrollY;
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <div>
      <main className="h-screen" id="slider">
        <MovieSlider />
      </main>
      <div className="flex h-screen" id="movies">
        <div>
          <MovieCard />
          <MovieCard />
        </div>
        <div>
          <MovieCard />
          <MovieCard />
        </div>
      </div>
    </div>
  );
}
