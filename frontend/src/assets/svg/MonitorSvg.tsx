interface MonitorSvgProps {
  className?: string;
}

const MonitorSvg: React.FC<MonitorSvgProps> = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M17.56 2H6.41C3.98 2 2 3.98 2 6.41V12.91V13.11C2 15.55 3.98 17.52 6.41 17.52H10.25C10.8 17.52 11.25 17.97 11.25 18.52V19.49C11.25 20.04 10.8 20.49 10.25 20.49H7.83C7.42 20.49 7.08 20.83 7.08 21.24C7.08 21.65 7.41 22 7.83 22H16.18C16.59 22 16.93 21.66 16.93 21.25C16.93 20.84 16.59 20.5 16.18 20.5H13.76C13.21 20.5 12.76 20.05 12.76 19.5V18.53C12.76 17.98 13.21 17.53 13.76 17.53H17.57C20.01 17.53 21.98 15.55 21.98 13.12V12.92V6.42C21.97 3.98 19.99 2 17.56 2Z"
        fill="#292D32"
      />
    </svg>
  );
};

export default MonitorSvg;
