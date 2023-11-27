import { useEffect, useRef, useState } from "react";
import { getFailedGif } from "../../../../api/gif";
import { motion } from "framer-motion";

const EyeStolen: React.FC = () => {
  const [gifUrl, setGifUrl] = useState<string>("");
  const [imgPos, setImgPos] = useState({
    x: 0,
    y: 0,
  });
  const imgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    getFailedGif().then(url => {
      setGifUrl(url);
    });

    const intervalId = setInterval(() => {
      setImgPos({
        x: Math.random() * (window.innerWidth - (imgRef.current?.width ?? 0)),
        y: Math.random() * (window.innerHeight - (imgRef.current?.height ?? 0)),
      });
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <motion.img
      ref={ref => (imgRef.current = ref)}
      src={gifUrl}
      animate={{
        x: imgPos.x,
        y: imgPos.y,
      }}
      transition={{
        duration: 0.1,
      }}
      className="absolute w-[15%] top-0 left-0 object-cover pointer-events-none z-50"
    />
  );
};

export default EyeStolen;
