"use client";

import { Button } from "@/components/Button/Button";
import { InputLong, InputShort } from "@/components/Input/Input";
import useAuth from "@/hooks/auth/useAuth";
import { useFetch } from "@/hooks/fetch/useFetch";
import { Combination } from "@/types/combination";
import {
  faArrowLeft,
  faSave,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function EditCombination({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // paramsをアンラップ
  const { id } = use(params);

  // 既存の投稿データを取得
  const { data: combinationData, isLoading: dataLoading } =
    useFetch<Combination>(`http://localhost:8000/combinations/${id}`);

  const [combination, setCombination] = useState<Combination>({
    id: "",
    user_id: "",
    title: "",
    image: "",
    flight: "",
    shaft: "",
    barrel: "",
    tip: "",
    description: "",
  });

  // データが取得できたらstateを更新
  useEffect(() => {
    if (combinationData && combinationData.id) {
      console.log("取得したデータ:", combinationData); // デバッグ用
      console.log("フライト:", combinationData.flight); // デバッグ用
      console.log("シャフト:", combinationData.shaft); // デバッグ用
      console.log("バレル:", combinationData.barrel); // デバッグ用
      console.log("チップ:", combinationData.tip); // デバッグ用

      setCombination({
        id: combinationData.id,
        user_id: combinationData.user_id,
        title: combinationData.title || "",
        image: combinationData.image || "",
        flight: combinationData.flight || "",
        shaft: combinationData.shaft || "",
        barrel: combinationData.barrel || "",
        tip: combinationData.tip || "",
        description: combinationData.description || "",
      });
      setImagePreview(combinationData.image || null);
    }
  }, [combinationData]);

  if (!loginUser) {
    return (
      <div className="pl-10 pr-10 pt-10 pb-10 bg-white mb-10 text-center">
        <p className="mb-3">
          その他の機能を利用するには新規登録をしてください。
        </p>
        <Link href="/login">
          <Button color="bg-[#3B82F6]">新規登録はコチラ</Button>
        </Link>
        <div className="pt-3">
          ※登録済みの方はメニューよりログインをしてください。
        </div>
      </div>
    );
  }

  // データがまだ読み込まれていない場合のローディング表示
  if (dataLoading || !combinationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 font-medium">
          データを読み込み中...
        </span>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("combination[title]", combination.title);
      formData.append("combination[flight]", combination.flight);
      formData.append("combination[shaft]", combination.shaft);
      formData.append("combination[barrel]", combination.barrel);
      formData.append("combination[tip]", combination.tip);
      formData.append("combination[description]", combination.description);

      if (imageFile) {
        formData.append("combination[image]", imageFile);
      }

      const response = await fetch(`http://localhost:8000/combinations/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${await loginUser.getIdToken()}`,
        },
        body: formData,
      });

      if (response.ok) {
        // 保存成功後、自分の投稿一覧に戻る
        router.push("/myposts");
      } else {
        console.error("更新に失敗しました");
        alert("更新に失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-6 px-6 mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/myposts">
              <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                投稿一覧に戻る
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">投稿を編集</h1>
            <div></div> {/* 中央寄せのための空要素 */}
          </div>
        </div>
      </div>

      {/* Edit Form Section */}
      <div className="max-w-4xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
              基本情報
            </h2>

            {/* タイトル入力 */}
            <div className="mb-6">
              <InputLong
                placeholder={combination.title || "タイトルを入力してください"}
                value={combination.title || ""}
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
                投稿画像
              </label>
              <div className="flex justify-center">
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faUpload}
                        className="text-gray-400 text-3xl mb-2"
                      />
                      <p className="text-gray-500 text-sm text-center">
                        画像をクリックして
                        <br />
                        アップロード
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Parts Info Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
              パーツ情報
            </h2>

            <div className="space-y-4">
              <InputShort
                placeholder={combination.flight || "フライト"}
                value={combination.flight || ""}
                onChange={(e) => {
                  setCombination({ ...combination, flight: e.target.value });
                }}
              >
                フライト
              </InputShort>

              <InputShort
                placeholder={combination.shaft || "シャフト"}
                value={combination.shaft || ""}
                onChange={(e) => {
                  setCombination({ ...combination, shaft: e.target.value });
                }}
              >
                シャフト
              </InputShort>

              <InputShort
                placeholder={combination.barrel || "バレル"}
                value={combination.barrel || ""}
                onChange={(e) => {
                  setCombination({ ...combination, barrel: e.target.value });
                }}
              >
                バレル
              </InputShort>

              <InputShort
                placeholder={combination.tip || "チップ"}
                value={combination.tip || ""}
                onChange={(e) => {
                  setCombination({ ...combination, tip: e.target.value });
                }}
              >
                チップ
              </InputShort>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
              詳細
            </h2>

            <div className="mb-6">
              <InputLong
                placeholder={
                  combination.description || "説明を入力してください"
                }
                value={combination.description || ""}
                onChange={(e) => {
                  setCombination({
                    ...combination,
                    description: e.target.value,
                  });
                }}
              >
                説明
              </InputLong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-center space-x-4">
              <Link href="/myposts">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  キャンセル
                </button>
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center"
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {isLoading ? "保存中..." : "保存する"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
