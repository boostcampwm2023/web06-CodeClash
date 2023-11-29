interface SmallWordSvgProps {
  className?: string;
}

const SmallWordSvg: React.FC<SmallWordSvgProps> = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M1.99146 5.92995V4.41995C1.99146 3.39995 2.82146 2.56995 3.84145 2.56995H16.7615C17.7815 2.56995 18.6115 3.39995 18.6115 4.41995V5.92995"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.3015 18.0999V3.31995"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.90146 18.1H12.4815"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.6815 10.34H20.6915C21.4215 10.34 22.0115 10.93 22.0115 11.66V12.46"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.0815 21.43V10.87"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.9415 21.4301H18.2215"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default SmallWordSvg;
