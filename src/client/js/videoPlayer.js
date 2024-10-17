const currentTime = document.getElementById("currentTime");

const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");

const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");

const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");

const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

const video = document.querySelector("video");
const volumeRange = document.getElementById("volume");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

// video element에 내장된 paused() <= return true / false로
// video 를 play() 및 pause()를 할 수 있는 로직
const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
};

// mute 버튼 클릭시 video 음소거 로직
const handleMute = () => {
  if (video.muted) {
    video.muted = false;
    if (volumeValue === 0) {
      volumeValue = 0.5;
      video.volume = 0.5;
    }
  } else {
    video.muted = true;
  }
  muteBtnIcon.className = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }

  volumeValue = Number(value);
  video.volume = value;

  if (volumeValue === 0) {
    video.muted = true;
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetaData = () => {
  //video element의 내장 함수인 duration을 통하여
  //video 영상의 전체 길이를 알 수 있다.
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpDate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
    fullScreenBtnIcon.classList = "fas fa-expand";
  } else {
    fullScreenBtnIcon.classList = "fas fa-compress";
    videoContainer.requestFullscreen();
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  //기본적으로 fetch()는 get()방식이다.
  //하지만 apiROuter에서 조회수 로직의 방식을 post로 하였으므로
  //fetch의 method를 post로 재정의한다.
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
fullScreenBtn.addEventListener("click", handleFullScreen);

volumeRange.addEventListener("input", handleVolumeChange);
timeline.addEventListener("input", handleTimelineChange);

video.addEventListener("ended", handleEnded);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpDate);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
