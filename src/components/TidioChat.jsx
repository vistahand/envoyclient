import { useEffect } from "react";

const TidioChat = () => {
  useEffect(() => {
    // Load Tidio script
    const script = document.createElement("script");
    script.src = `//code.tidio.co/${import.meta.env.VITE_TIDIO_PUBLIC_KEY}.js`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(script);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default TidioChat;
