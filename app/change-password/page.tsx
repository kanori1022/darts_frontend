"use client";

import { Button } from "@/components/Button/Button";
import useAuth from "@/hooks/auth/useAuth";
import { updatePassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loginUser } = useAuth();
  const router = useRouter();

  if (!loginUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-blue-500 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            ログインが必要です
          </h1>
          <p className="mb-8 text-gray-600 leading-relaxed text-center max-w-sm mx-auto">
            パスワード変更機能をご利用いただくには
            <br />
            ログインが必要です
          </p>
          <Link href="/login">
            <Button color="bg-blue-500 hover:bg-blue-600">ログイン</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // バリデーション
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError("すべての項目を入力してください");
        setIsLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("新しいパスワードが一致しません");
        setIsLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setError("新しいパスワードは6文字以上で入力してください");
        setIsLoading(false);
        return;
      }

      if (currentPassword === newPassword) {
        setError(
          "新しいパスワードは現在のパスワードと異なるものを入力してください"
        );
        setIsLoading(false);
        return;
      }

      // Firebase Authを使用してパスワードを更新
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth();

      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // 3秒後に設定ページに戻る
        setTimeout(() => {
          router.push("/settings");
        }, 3000);
      }
    } catch (error: any) {
      console.error("パスワード変更エラー:", error);

      // Firebase Authのエラーメッセージを日本語に変換
      switch (error.code) {
        case "auth/weak-password":
          setError("パスワードが弱すぎます。6文字以上で入力してください");
          break;
        case "auth/requires-recent-login":
          setError(
            "セキュリティのため、再度ログインしてからパスワードを変更してください"
          );
          break;
        case "auth/wrong-password":
          setError("現在のパスワードが正しくありません");
          break;
        case "auth/too-many-requests":
          setError(
            "リクエストが多すぎます。しばらくしてから再度お試しください"
          );
          break;
        default:
          setError(
            "パスワードの変更に失敗しました。しばらくしてから再度お試しください"
          );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            パスワード変更完了
          </h1>
          <p className="mb-8 text-gray-600 leading-relaxed text-center">
            パスワードが正常に変更されました。
            <br />
            3秒後に設定ページに戻ります。
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-6 px-6 mb-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">
            パスワード変更
          </h1>
          <p className="text-gray-600">ログインパスワードを変更できます</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 現在のパスワード */}
            <div>
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="現在のパスワードを入力してください"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* パスワード表示切り替えチェックボックス */}
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="showCurrentPassword"
                  checked={showCurrentPassword}
                  onChange={(e) => setShowCurrentPassword(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="showCurrentPassword"
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  現在のパスワードを表示する
                </label>
              </div>
            </div>

            {/* 新しいパスワード */}
            <div>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="新しいパスワードを入力してください（6文字以上）"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* パスワード表示切り替えチェックボックス */}
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="showNewPassword"
                  checked={showNewPassword}
                  onChange={(e) => setShowNewPassword(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="showNewPassword"
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  新しいパスワードを表示する
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ※6文字以上で入力してください
              </p>
            </div>

            {/* パスワード確認 */}
            <div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="新しいパスワードを再入力してください"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* パスワード表示切り替えチェックボックス */}
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="showConfirmPassword"
                  checked={showConfirmPassword}
                  onChange={(e) => setShowConfirmPassword(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="showConfirmPassword"
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  パスワード確認を表示する
                </label>
              </div>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-red-500 text-lg mr-2">⚠️</div>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* 注意事項 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-500 text-lg mr-2 mt-0.5">ℹ️</div>
                <div className="text-blue-700 text-sm">
                  <p className="font-medium mb-1">
                    パスワード変更時の注意事項：
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>新しいパスワードは6文字以上で設定してください</li>
                    <li>セキュリティのため、現在のパスワードが必要です</li>
                    <li>
                      パスワード変更後は新しいパスワードでログインしてください
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="submit"
                color="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    変更中...
                  </div>
                ) : (
                  "パスワードを変更"
                )}
              </Button>

              <Link href="/settings">
                <Button
                  type="button"
                  color="bg-gray-600 hover:bg-gray-700"
                  disabled={isLoading}
                >
                  キャンセル
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
