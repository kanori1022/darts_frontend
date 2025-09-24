"use client";

import { Button } from "@/components/Button/Button";
import { InputLong, InputShort } from "@/components/Input/Input";
import { useCreateCombination } from "@/hooks/api/useCreateCombination";
import useAuth from "@/hooks/auth/useAuth";
import { CombinationParams } from "@/types/combination";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
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
    tags: [], // タグ配列を追加
    full_setting_length: "",
    full_setting_weight: "",
    barrel_weight: "",
    barrel_max_diameter: "",
    barrel_min_diameter: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState(""); // タグ入力用の状態
  const { createCombination } = useCreateCombination();
  const inputRef = useRef<HTMLInputElement>(null);
  const { loginUser } = useAuth();
  const router = useRouter();

  const handleGuestLogin = async () => {
    try {
      const { getAuth, signInWithEmailAndPassword } = await import(
        "firebase/auth"
      );
      const auth = getAuth();
      const result = await signInWithEmailAndPassword(
        auth,
        "gest@1.com",
        "33443344"
      );
      console.log("ゲストログイン成功:", result);
      alert("ゲストユーザーとしてログインしました");
      router.push("/home");
    } catch (error) {
      console.error("ゲストログインエラー:", error);
      alert(
        "ゲストログインに失敗しました。しばらくしてから再度お試しください。"
      );
    }
  };

  // タグ追加処理の関数
  const handleAddTags = () => {
    const currentTags = combination.tags || [];
    if (tagInput.trim() && currentTags.length < 5) {
      const newTags = tagInput
        .split("/")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0 && !currentTags.includes(tag)) // 重複チェック
        .slice(0, 5 - currentTags.length); // 残り追加可能数まで

      if (newTags.length > 0) {
        setCombination({
          ...combination,
          tags: [...currentTags, ...newTags],
        });
      }
      setTagInput("");
    }
  };

  if (!loginUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-blue-500 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            ログインが必要です
          </h1>
          <p className="mb-8 text-gray-600 leading-relaxed text-center max-w-sm mx-auto">
            投稿機能をご利用いただくには
            <br />
            ログインまたは新規登録が必要です
          </p>
          <div className="space-y-6">
            <Link href="/login">
              <Button color="bg-blue-500 hover:bg-blue-600">ログイン</Button>
            </Link>

            {/* 区切り線 */}
            <div className="flex items-center justify-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500 bg-white">
                または
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <button
              onClick={handleGuestLogin}
              className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer border border-slate-500 hover:border-slate-400 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                <span>ゲストユーザーでログイン</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            </button>

            <Link href="/newprofile">
              <Button color="bg-gray-500 hover:bg-gray-600">新規登録</Button>
            </Link>
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
              placeholder="タイトルを入力してください（20文字以内）"
              maxLength={20}
              value={combination.title}
              onChange={(e) => {
                setCombination({ ...combination, title: e.target.value });
              }}
            >
              タイトル
            </InputLong>
            <div className="mt-1 flex justify-between items-center">
              <p className="text-xs text-gray-500">
                ※20文字以内で入力してください
              </p>
              <span
                className={`text-xs ${combination.title.length > 15 ? "text-orange-500" : combination.title.length === 20 ? "text-red-500" : "text-gray-400"}`}
              >
                {combination.title.length}/20文字
              </span>
            </div>
          </div>

          {/* 画像アップロード */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              投稿画像 *
            </label>
            <div className="flex justify-center">
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="選択された画像"
                    width={400}
                    height={300}
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

        {/* ダーツ詳細情報 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            ダーツ詳細情報
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            以下の項目は任意入力です。入力されていなくても投稿可能です。
          </p>

          <div className="space-y-4">
            <InputShort
              placeholder="例：160mm"
              value={combination.full_setting_length}
              onChange={(e) => {
                setCombination({
                  ...combination,
                  full_setting_length: e.target.value,
                });
              }}
            >
              フルセッティング時の全長
            </InputShort>
            <InputShort
              placeholder="例：23.5g"
              value={combination.full_setting_weight}
              onChange={(e) => {
                setCombination({
                  ...combination,
                  full_setting_weight: e.target.value,
                });
              }}
            >
              フルセッティング時の重さ
            </InputShort>
            <InputShort
              placeholder="例：18.0g"
              value={combination.barrel_weight}
              onChange={(e) => {
                setCombination({
                  ...combination,
                  barrel_weight: e.target.value,
                });
              }}
            >
              バレル単体の重さ
            </InputShort>
            <InputShort
              placeholder="例：8.2mm"
              value={combination.barrel_max_diameter}
              onChange={(e) => {
                setCombination({
                  ...combination,
                  barrel_max_diameter: e.target.value,
                });
              }}
            >
              バレル最大径
            </InputShort>
            <InputShort
              placeholder="例：7.8mm"
              value={combination.barrel_min_diameter}
              onChange={(e) => {
                setCombination({
                  ...combination,
                  barrel_min_diameter: e.target.value,
                });
              }}
            >
              バレル最小径
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タグ（最大5個）
            </label>
            <p className="text-xs text-gray-500 mb-2">
              /で区切って複数入力可能。「タグを追加」ボタンまたはEnterキーで追加
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="例：初心者向け/バランス重視/軽量"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onBlur={handleAddTags}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTags();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddTags}
                disabled={
                  !tagInput.trim() || (combination.tags || []).length >= 5
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                タグを追加
              </button>
            </div>

            {/* タグ表示エリア */}
            {combination.tags && combination.tags.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-700 mb-2">設定されたタグ：</p>
                <div className="flex flex-wrap gap-2">
                  {combination.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags =
                            combination.tags?.filter((_, i) => i !== index) ||
                            [];
                          setCombination({ ...combination, tags: newTags });
                        }}
                        className="ml-1.5 text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {(combination.tags || []).length}/5個
                </p>
              </div>
            )}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              color="bg-blue-600 hover:bg-blue-700"
              onClick={async () => {
                const requiredFields = ["title", "image", "description"];
                const hasEmptyRequiredField = requiredFields.some(
                  (field) => !combination[field as keyof CombinationParams]
                );

                if (hasEmptyRequiredField) {
                  alert(
                    "必須項目（タイトル、画像、説明）の入力が完了していません！"
                  );
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
