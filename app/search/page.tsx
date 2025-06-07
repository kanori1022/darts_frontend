import { Card } from "@/components/card/card";

export default function search() {
  const array = [
    { src: "sampl1.png", title: "サンプル1" },
    { src: "sampl2.jpg", title: "サンプル2" },
    { src: "sampl3.jpg", title: "サンプル3" },
    { src: "sampl4.jpg", title: "サンプル4" },
    { src: "sampl5.jpg", title: "サンプル5" },
    { src: "sampl6.jpeg", title: "サンプル6" },
    { src: "sampl7.jpeg", title: "サンプル7" },
    { src: "sampl8.jpg", title: "サンプル8" },
    { src: "sampl9.jpg", title: "サンプル9" },
    { src: "sampl10.jpg", title: "サンプル10" },
  ];

  return (
    <div className="h-screen flex flex-col">
      <div className="p-3 font-bold bg-white sticky top-18 mb-1 z-10">一覧</div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-3">
          {array.map((image, index) => (
            <Card src={image.src} title={image.title} key={index} />
          ))}
        </div>
      </div>
      <div className="p-3 font-bold sticky top-18 mb-1 z-10">
        前のページ 1/3 次のページ{" "}
      </div>
    </div>
  );
}
