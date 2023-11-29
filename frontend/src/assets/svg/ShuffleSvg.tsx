interface ShuffleSvgProps {
  className?: string;
}

const ShuffleSvg: React.FC<ShuffleSvgProps> = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M16.45 6L21 6.02002"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3 17.98L5.54999 17.99C6.45999 17.99 7.31 17.54 7.81 16.79L8.98999 15.02L9.75 13.88L13.67 8"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M19 19.98L21 17.98" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M8.89001 8.61993L7.81 7.11993C7.3 6.40993 6.47999 5.98993 5.60999 5.99993L3 6.00994"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12.97 15.38L14.19 16.95C14.7 17.61 15.5 18 16.34 18L21.01 17.98"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M21 6.02002L19 4.02002"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ShuffleSvg;
