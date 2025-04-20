import { useState, useEffect, useRef } from "react";

const VideoModal = ({ videoUrl }) => {
  const [showModal, setShowModal] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [muted, setMuted] = useState(true); // Start muted to ensure autoplay works
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if user has already watched or skipped the video
    const watchStatus = localStorage.getItem("envoyAngelVideoWatched");

    if (watchStatus !== "true") {
      // Add a small delay before showing the modal
      const timer = setTimeout(() => {
        setShowModal(true);
        
        // Try to autoplay with sound
        if (videoRef.current) {
          const playPromise = videoRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Autoplay started successfully
                setMuted(false); // Attempt to unmute
              })
              .catch(error => {
                // Autoplay was prevented, keep it muted
                console.log("Autoplay prevented:", error);
              });
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSkip = () => {
    // Mark as watched in localStorage
    localStorage.setItem("envoyAngelVideoWatched", "true");
    setHasWatched(true);
    setShowModal(false);
  };

  const handleVideoEnd = () => {
    // Also mark as watched when video completes
    localStorage.setItem("envoyAngelVideoWatched", "true");
    setHasWatched(true);
    setShowModal(false);
  };
  
  const toggleMute = () => {
    setMuted(!muted);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-75 z-50 flex items-center justify-center animate-fadeIn">
      <div className="relative w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 max-w-4xl rounded-lg overflow-hidden shadow-2xl">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-auto"
            src={videoUrl}
            autoPlay
            muted={muted}
            onEnded={handleVideoEnd}
            preload="metadata"
          />

          <div className="absolute bottom-4 left-4 flex space-x-3">
            <button
              className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 font-medium p-2 rounded-full shadow-md transition-all"
              onClick={toggleMute}
            >
              {muted ? (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                  <span className="ml-1">Unmute</span>
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span className="ml-1">Mute</span>
                </span>
              )}
            </button>
          </div>

          <button
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-200 transform hover:scale-105"
            onClick={handleSkip}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;