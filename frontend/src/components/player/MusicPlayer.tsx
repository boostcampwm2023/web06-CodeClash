import { useEffect, useRef, useState } from "react";
import Button from "../common/Button";

const MusicPlayer: React.FC = () => {
  const musicPlayer = useRef(new Audio("music/LobbyBGM.mp3"));
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    musicPlayer.current.autoplay = true;
    musicPlayer.current.volume = 0.1;
    musicPlayer.current.loop = true;

    const handleMusicEnded = () => {
      setIsPlaying(false);
    };

    musicPlayer.current.addEventListener("ended", handleMusicEnded);

    return () => {
      musicPlayer.current.removeEventListener("ended", handleMusicEnded);
    };
  }, []);

  useEffect(() => {
    isPlaying ? musicPlayer.current.play() : musicPlayer.current.pause();
  }, [isPlaying]);

  return (
    <Button
      title={isPlaying ? "BGM 멈춤" : "BGM 재생"}
      color={isPlaying ? "pink" : "skyblue"}
      onClick={() => setIsPlaying(play => !play)}
      className="absolute right-0 m-2 text-[0.5rem] px-[0.4rem] py-[0.4rem] border-[2px] rounded-md z-50"
    ></Button>
  );
};

export default MusicPlayer;
