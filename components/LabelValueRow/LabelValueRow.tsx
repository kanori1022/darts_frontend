type Props = {
  label: string;
  value: string;
};

export default function LabelValueRow({ label, value }: Props) {
  return (
    <div className="border border-gray-300 rounded p-3 bg-white shadow-sm">
      <span className="text-gray-600">{label}</span> {value}
    </div>
  );
}
