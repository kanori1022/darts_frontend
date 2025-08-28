type Props = {
  label: string;
  value: string;
};

export default function LabelValueRow({ label, value }: Props) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-gray-800 font-semibold">{value || "未設定"}</span>
      </div>
    </div>
  );
}
