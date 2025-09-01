"use client";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

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
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="px-4 pb-2 w-40 flex flex-col justify-between">
      <div className="w-40 text-[#000000]">{title}</div>
      <div className="flex justify-center relative">
        {/* 画像読み込み中のスケルトン */}
        {imageLoading && (
          <div className="w-32 h-24 bg-gray-200 animate-pulse rounded-lg border shadow-sm" />
        )}

        {/* エラー時のフォールバック */}
        {imageError ? (
          <div className="w-32 h-24 bg-gray-100 rounded-lg border shadow-sm flex items-center justify-center">
            <span className="text-gray-400 text-sm">画像なし</span>
          </div>
        ) : (
          <Image
            className={`w-32 h-24 shadow-sm border rounded-lg object-cover ${imageLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
            src={src}
            alt={title}
            width={128}
            height={96}
            priority={false}
            loading="lazy"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        )}

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
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="px-3 bg-[#DADADA] rounded-lg">
      <div className="w-20 text-[#000000]">{title} </div>
      {imageError ? (
        <div className="w-20 h-16 bg-gray-100 rounded-lg border shadow-sm flex items-center justify-center mb-5">
          <span className="text-gray-400 text-xs">画像なし</span>
        </div>
      ) : (
        <>
          {imageLoading && (
            <div className="w-20 h-16 bg-gray-200 animate-pulse rounded-lg border shadow-sm mb-5" />
          )}
          <Image
            className={`w-20 h-auto mb-5 shadow-sm border rounded-lg ${imageLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
            src={src}
            alt={title}
            width={80}
            height={64}
            priority={false}
            loading="lazy"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        </>
      )}
    </div>
  );
};
