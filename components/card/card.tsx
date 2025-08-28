"use client";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CardProps = {
  src: string;
  title: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  userId?: string | number;
  currentUserId?: string | number;
};

export const Card = ({
  src,
  title,
  isFavorite,
  onToggleFavorite,
  userId,
  currentUserId,
}: CardProps) => {
  return (
    <div className="px-4 pb-2 w-40 flex flex-col justify-between">
      <div className="w-40 text-[#000000]">{title}</div>
      <div className="flex justify-center relative">
        <img
          className="w-32 h-24 shadow-sm border rounded-lg object-cover"
          src={src}
          alt={title}
        />
        {onToggleFavorite && String(userId) !== String(currentUserId) && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute -bottom-1 right-1 text-xl"
          >
            <FontAwesomeIcon
              icon={isFavorite ? solidHeart : regularHeart}
              className={isFavorite ? "text-red-500" : "text-white"}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export const SrcCard = (props: CardProps) => {
  const { src, title } = props;
  return (
    <div className="px-3 bg-[#DADADA] rounded-lg">
      <div className="w-20 text-[#000000]">{title} </div>
      <img
        className="w-20 h-auto mb-5 shadow-sm border rounded-lg"
        src={src}
        alt={title}
      />
    </div>
  );
};
