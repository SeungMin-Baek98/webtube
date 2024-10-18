import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);

  actionBtn.innerText = "Transcoding...";

  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({
    log: true,
  });
  await ffmpeg.load();

  //가상의 컴퓨터에다가 우리가 녹화한 비디오의 파일을 만들기 위하여
  //0과1의 정보를 전달해 줘야된다.
  //여기서는 videoFile이 된다.

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  //ffmpeg.run()은 가상의 컴퓨터에 이미 존재하는 파일을 "-i"를 통하여
  //파일을 input으로 받게다는 코드이다.
  //2번쨰, 3번째인자는 내가 녹화한 webm확장자의 영상들을 output.mp4의 확장자로서
  //출력을 하겠다는 뜻이다.
  //결국에는 webm으로 녹화된 비디오영상들이 mp4의 형태로서 재생이 될 수 있다.
  // -r / 60은 초당 60프레임으로 영상을 만들겠다라는 뜻.
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  actionBtn.disabled = false;
  init();
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
};

const handleStart = () => {
  actionBtn.innerText = "Recording";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);

  //영상의 녹화를 위하여 MediaRecorder()내장함수 사용.
  //stream을 전달하기위하여 기존의 const 로 사용한 변수를
  //let으로 바꿈으로서 전역변수로 만들어주었다.
  //기존의 함수{}블럭내에서만 사용할 수 있었던 stream을
  //다른 함수내에서도 사용할 수 있게하는 용도이다.

  //또한 URL.createObjectURL()안에 event.data를 사용하여
  //현재 내가 녹화하고있는 영상의 url 주소를 내 플젝 웹주소에서만 보여지게끔 하였다.
  // --> 만들어진 video영상의 파일은 내 플젝 웹 브라우저의 메모리 상에만 있는것이다.
  //ondataavailable는 video가 영상 녹화를 중단하였을경우 발생되는 event handler이다.
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const init = async () => {
  //mediaDevices.getUserMedia()는 사용자의 navigator에서 카메라와 오디오를 가져올 수 있게한다.
  //HTML의 요소인 video에서 video의 property인 src는 getUserMedia가 대신하여 src를 주기때문에
  //pug페이지에서 video property는 필요없다.

  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 1024,
      height: 576,
    },
  });
  video.srcObject = stream;
  video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
