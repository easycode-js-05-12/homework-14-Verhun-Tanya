class VideoPlayerBasic {
  constructor(settings) {
    this._settings = Object.assign(VideoPlayerBasic.getDefaultSettings(), settings);
    this._videoContainer = null;
    this._video = null;
    this._toggleBtn = null;
    this._progress = null;
    this._mouseDown = false;
    this._input = null;
    this._inputVolume = null;
    this._inputPlaybackRate = null;
    this._plusSkip = null;
    this._minusSkip = null;
  }

  init() {
    // Проверить передані ли  видео и контейнер
    if (!this._settings.videoUrl) return console.error("Передайте адрес видео");
    if (!this._settings.videoPlayerContainer) return console.error("Передайте селектор контейнера");

    // Создадим разметку и добавим ее на страницу
    this._addTemplate();
    // Найти все элементы управления
    this._setElements();
    // Установить обработчики событий
    this._setEvents();
  }

  /**
   * @name toggle
   * A function that turns video on and off after click
   */
  toggle() {
    const method = this._video.paused ? 'play' : 'pause';
    this._toggleBtn.textContent = this._video.paused ? '❚ ❚' : '►';
    this._video[method]();
  }

  /**
   * @name _handlerProgress
   * A function that shows the movement of the video while watching
   */
  _handlerProgress() {
    const percent = (this._video.currentTime / this._video.duration) * 100;
    this._progress.style.flexBasis = `${percent}%`;
  }

  /**
   * @name _scrub
   * A function that allows to rewind video by moving the mouse
   * 
   * @param{object} e - event after which a video rewind
   */
  _scrub(e) {
    this._video.currentTime = (e.offsetX / this._progressContainer.offsetWidth) * this._video.duration;
  }

  /**
 * @name _scrubPlus
 * A function that allows to rewind to a certain number of seconds forward
 */
  _scrubPlus() {
    this._video.currentTime = this._video.currentTime + Number(this._settings.timePlus);
  }

  /**
  * @name _scrubMinus
  * A function that allows to rewind to a certain number of seconds backward
  */
  _scrubMinus() {
    this._video.currentTime = this._video.currentTime - Number(this._settings.timeMinus);
  }

  /**
   * @name _volume
   * A function that allows to set a volume
   */
  _volume() {
    this._video.volume = this._inputVolume.value;
  }

  /**
   * @name _playbackRate
   * A function that allows to set a speed of the video
   */
  _playbackRate() {
    this._video.playbackRate = this._inputPlaybackRate.value;
  }

  /**
   * @name _doubleClickScrub
   * A function that allows to rewind a video by double click
   * 
   * @param{object} e - event after which a video rewind
   */
  _doubleClickScrub(e) {
    this._half = this._progressContainer.offsetWidth / 2;
    if (e.offsetX < this._half) {
      this._video.currentTime = this._video.currentTime - Number(this._settings.timeMinus);
    } else if (e.offsetX > this._half) {
      this._video.currentTime = this._video.currentTime + Number(this._settings.timeMinus);
    }
  }


  _setElements() {
    this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
    this._video = this._videoContainer.querySelector('video');
    this._toggleBtn = this._videoContainer.querySelector('.toggle');
    this._progress = this._videoContainer.querySelector('.progress__filled');
    this._progressContainer = this._videoContainer.querySelector('.progress');
    this._input = this._videoContainer.querySelectorAll('input');
    for (let i = 0; i < this._input.length; i++) {
      if (this._input[i].name === "volume") {
        this._inputVolume = this._input[i];
      } else if (this._input[i].name === "playbackRate") {
        this._inputPlaybackRate = this._input[i];
      }
    }
    this._buttons = this._videoContainer.querySelectorAll('button');
    for (let i = 0; i < this._buttons.length; i++) {
      if (this._buttons[i].dataset.skip === "1") {
        this._plusSkip = this._buttons[i];
      } else if (this._buttons[i].dataset.skip === "-1") {
        this._minusSkip = this._buttons[i];
      }
    }
  }

  _setEvents() {
    this._video.addEventListener('click', () => this.toggle());
    this._toggleBtn.addEventListener('click', () => this.toggle());
    this._video.addEventListener('timeupdate', () => this._handlerProgress());
    this._progressContainer.addEventListener('click', (e) => this._scrub(e));
    this._progressContainer.addEventListener('mousemove', (e) => this._mouseDown && this._scrub(e));
    this._progressContainer.addEventListener('mousedown', (e) => this._mouseDown = true);
    this._progressContainer.addEventListener('mouseup', (e) => this._mouseDown = false);
    this._inputVolume.addEventListener('mousemove', () => this._volume());
    this._inputPlaybackRate.addEventListener('mousemove', () => this._playbackRate());
    this._plusSkip.addEventListener('click', () => this._scrubPlus());
    this._minusSkip.addEventListener('click', () => this._scrubMinus());
    this._video.addEventListener('dblclick', (e) => this._doubleClickScrub(e));
  }

  _addTemplate() {
    const template = this._createVideoTemplate();
    const container = document.querySelector(this._settings.videoPlayerContainer);
    container ? container.insertAdjacentHTML("afterbegin", template) : console.error('контейнер не найден');
  }

  _createVideoTemplate() {
    return `
      <div class="player">
        <video class="player__video viewer" src="${this._settings.videoUrl}"> </video>
        <div class="player__controls">
          <div class="progress">
          <div class="progress__filled"></div>
          </div>
          <button class="player__button toggle" title="Toggle Play">►</button>
          <input type="range" name="volume" class="player__slider" min=0 max="1" step="0.05" value="${this._settings.volume}">
          <input type="range" name="playbackRate" class="player__slider" min="0.5" max="2" step="0.1" value="${this._settings.playbackRate}">
          <button data-skip="-1" class="player__button">« ${this._settings.timePlus}s</button>
          <button data-skip="1" class="player__button">${this._settings.timeMinus}s »</button>
        </div>
      </div>
      `;
  }

  static getDefaultSettings() {
    /**
     * Список настроек
     * - адрес видео
     * - тип плеера "basic", "pro"
     * - controls - true, false
     */
    return {
      videoUrl: '',
      videoPlayerContainer: '.myplayer',
      volume: 1,
      playbackRate: 1,
      timePlus: 2,
      timeMinus: 2
    }
  }
}

const myPlayer = new VideoPlayerBasic({
  videoUrl: 'video/mov_bbb.mp4',
  videoPlayerContainer: 'body',
  skipNext: 10,
  skipPrev: -10,
  volume: 0.5,
  playbackRate: 1.2
});

myPlayer.init();