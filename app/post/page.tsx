"use client";

import { Button } from "@/components/Button/Button";
import { InputLong, InputShort } from "@/components/Input/Input";
import { useCreateCombination } from "@/hooks/api/useCreateCombination";
import useAuth from "@/hooks/auth/useAuth";
import { CombinationParams } from "@/types/combination";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Post() {
  const [combination, setCombination] = useState<CombinationParams>({
    title: "",
    image: null,
    flight: "",
    shaft: "",
    barrel: "",
    tip: "",
    description: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { createCombination } = useCreateCombination();
  const inputRef = useRef<HTMLInputElement>(null);
  const { loginUser } = useAuth();
  const router = useRouter();

  if (!loginUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <p className="mb-4 text-gray-600">
            その他の機能を利用するには新規登録をしてください。
          </p>
          <Link href="/login">
            <Button color="bg-blue-600 hover:bg-blue-700">
              新規登録はコチラ
            </Button>
          </Link>
          <div className="pt-3 text-sm text-gray-500">
            ※登録済みの方はメニューよりログインをしてください。
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-6 px-6 mb-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">新規投稿</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">基本情報</h2>

          {/* タイトル入力 */}
          <div className="mb-6">
            <InputLong
              placeholder="タイトルを入力してください"
              onChange={(e) => {
                setCombination({ ...combination, title: e.target.value });
              }}
            >
              タイトル
            </InputLong>
          </div>

          {/* 画像アップロード */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              投稿画像 *
            </label>
            <div className="flex justify-center">
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="選択された画像"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      inputRef.current?.click();
                    }}
                  />
                ) : (
                  <label
                    htmlFor="imageUpload"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faUpload}
                      className="text-gray-400 text-3xl mb-2"
                    />
                    <span className="text-sm text-gray-500">画像を選択</span>
                  </label>
                )}
              </div>
            </div>

            <input
              id="imageUpload"
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setCombination({ ...combination, image: file });
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
              className="hidden"
            />

            <p className="text-center mt-2 text-sm text-gray-500">
              画像をクリックして変更できます
            </p>
          </div>
        </div>

        {/* パーツ情報 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            パーツ情報
          </h2>

          <div className="space-y-4">
            <InputShort
              placeholder="フライト"
              onChange={(e) => {
                setCombination({ ...combination, flight: e.target.value });
              }}
            >
              フライト
            </InputShort>
            <InputShort
              placeholder="シャフト"
              onChange={(e) => {
                setCombination({ ...combination, shaft: e.target.value });
              }}
            >
              シャフト
            </InputShort>
            <InputShort
              placeholder="バレル"
              onChange={(e) => {
                setCombination({ ...combination, barrel: e.target.value });
              }}
            >
              バレル
            </InputShort>
            <InputShort
              placeholder="チップ"
              onChange={(e) => {
                setCombination({ ...combination, tip: e.target.value });
              }}
            >
              チップ
            </InputShort>
          </div>
        </div>

        {/* 説明とタグ */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">詳細情報</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明 *
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="例：バレルの重心を感じやすく、初心者におすすめな組み合わせになっている。"
              onChange={(e) => {
                setCombination({ ...combination, description: e.target.value });
              }}
            />
          </div>

          <div>
            <InputLong placeholder="タグを入力してください（任意）">
              タグ
            </InputLong>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              color="bg-blue-600 hover:bg-blue-700"
              onClick={async () => {
                const hasEmptyField = Object.values(combination).some(
                  (value) => !value
                );

                if (hasEmptyField) {
                  alert("値の入力または画像の選択が完了していません！");
                  return;
                }

                console.log("投稿処理開始");
                await createCombination({ combination: combination });
                router.push("/home");
              }}
            >
              投稿する
            </Button>

            <Link href="/home">
              <Button color="bg-gray-600 hover:bg-gray-700">キャンセル</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
