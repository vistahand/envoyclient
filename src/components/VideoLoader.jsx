import { useState, useEffect } from "react";
import VideoModal from "./VideoModal";

const VideoLoader = () => {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    // Load the video with lazy loading approach
    const videoSource =
      import.meta.env.VITE_INTRO_VIDEO ||
      "https://res.cloudinary.com/dtx1gvrwe/video/upload/v1745180915/envoy-intro-video/drusqgwwhizcs4hox3xk.mp4";
    // const videoSource = "/videos/envoy-angel-intro.mp4";

    // Create a link preload for the video
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "video";
    preloadLink.href = videoSource;
    document.head.appendChild(preloadLink);

    // Set the video URL
    setVideoUrl(videoSource);

    return () => {
      // Clean up preload link when component unmounts
      document.head.removeChild(preloadLink);
    };
  }, []);

  return <VideoModal videoUrl={videoUrl} />;
};

export default VideoLoader;
