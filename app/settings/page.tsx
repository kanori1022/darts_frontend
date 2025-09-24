"use client";

import { Button } from "@/components/Button/Button";
import useAuth from "@/hooks/auth/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Settings() {
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
            設定機能をご利用いただくには
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-6 px-6 mb-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">設定</h1>
          <p className="text-gray-600">
            アカウントやアプリの設定を管理できます
          </p>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            アカウント設定
          </h2>
          <div className="space-y-4">
            <Link href="/mypage" className="block">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium text-gray-800">マイページ</h3>
                  <p className="text-sm text-gray-600">
                    投稿履歴やお気に入りを確認
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            <Link href="/newprofile" className="block">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium text-gray-800">
                    プロフィール編集
                  </h3>
                  <p className="text-sm text-gray-600">
                    ユーザー名や自己紹介を変更
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            <Link href="/change-password" className="block">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium text-gray-800">パスワード変更</h3>
                  <p className="text-sm text-gray-600">
                    ログインパスワードを変更
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            アプリ設定
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">通知設定</h3>
                <p className="text-sm text-gray-600">
                  お気に入りやコメントの通知
                </p>
              </div>
              <div className="text-sm text-gray-500">準備中</div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">プライバシー設定</h3>
                <p className="text-sm text-gray-600">プロフィールの公開設定</p>
              </div>
              <div className="text-sm text-gray-500">準備中</div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">サポート</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div>
                <h3 className="font-medium text-gray-800">お問い合わせ</h3>
                <p className="text-sm text-gray-600">不具合報告やご要望</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div>
                <h3 className="font-medium text-gray-800">利用規約</h3>
                <p className="text-sm text-gray-600">
                  サービス利用に関する規約
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div>
                <h3 className="font-medium text-gray-800">
                  プライバシーポリシー
                </h3>
                <p className="text-sm text-gray-600">
                  個人情報の取り扱いについて
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            color="bg-gray-600 hover:bg-gray-700"
            onClick={() => router.back()}
          >
            戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
