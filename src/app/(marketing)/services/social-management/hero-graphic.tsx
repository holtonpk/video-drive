import {Bolt, SmileDarkBlue} from "../../icons";

export const HeroGraphic = () => {
  return (
    <div className="w-full relative flex  justify-center">
      <div className="bg-white rounded-[30px]  max-w-[500px] w-full  max-h-[700px] h-full relative">
        <div className="absolute bg-theme-color1 rounded-[30px] -left-[15%] top-[10%] max-w-[400px] w-full  max-h-[500px] h-full overflow-hidden">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/editor.webp?alt=media&token=7802f8ef-5b63-471c-8bb4-2bc850038eb0"
            alt="editor"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bg-theme-color2 rounded-[30px] -right-10 top-[50%] max-w-[250px] w-full  max-h-[300px] h-full overflow-hidden">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/stock-worker.webp?alt=media&token=b689bc99-b78b-4b31-9822-6c8006a9448c"
            alt="editor"
            className="w-full h-full object-cover"
          />
        </div>
        <Bolt className="absolute top-[10%] right-0 translate-x-1/2  w-[100px] h-[100px] fill-theme-color2" />
        <SmileDarkBlue className="absolute bottom-[5%] left-0 -translate-x-1/2  w-[100px] h-[100px] fill-primary " />
      </div>
    </div>
  );
};
