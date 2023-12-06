interface RankItemProps {
  username: string;
  message: string;
  score: number;
}

const ResultRankItem: React.FC<RankItemProps> = ({ username, message, score }) => {
  return (
    <div className="relative flex justify-between items-center p-2 my-2 border-4 bg-black rounded-lg border-white text-xs">
      <div className="absolute top-[-20px] text-[0.5rem] bg-yellow px-1 rounded">{username}</div>
      <div className="text-[0.5rem] w-auto flex gap-3">
        <svg width="49" height="55" viewBox="0 0 49 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M26.75 2.56699C25.3577 1.76314 23.6423 1.76314 22.25 2.56699L4.03238 13.0849C2.64007 13.8888 1.78238 15.3744 1.78238 16.9821V38.0179C1.78238 39.6256 2.64007 41.1112 4.03238 41.9151L22.25 52.433C23.6423 53.2369 25.3577 53.2369 26.75 52.433L44.9676 41.9151C46.3599 41.1112 47.2176 39.6256 47.2176 38.0179V16.9821C47.2176 15.3744 46.3599 13.8888 44.9676 13.0849L26.75 2.56699Z"
            fill="#FEB938"
            stroke="#FEFEFD"
            strokeWidth="3"
          />
          <g filter="url(#filter0_d_0_1)">
            <path
              d="M17 26C19.0789 32.0058 20.1974 34.7034 20.7992 35.8677C21.182 36.6084 21.7605 36.1353 22.2451 35.4569L34 19"
              stroke="#FEFEFD"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </svg>
        {message}
      </div>
      <div className="text-lg">{score.toLocaleString()}점</div>
    </div>
  );
};

export default ResultRankItem;
