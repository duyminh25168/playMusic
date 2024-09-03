const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const songList = $("#song__list");
const titleName = $("#title__name");
const thumbnail__link = $("#thumbnail__link");
const audio = $("#audio");
const btnPlay = $("#btn__play");
const audioSoure = $("#audio__soure");
const input = $("input");
const redo = $("#btn__redo");
const random = $("#btn__random");
const prev = $("#btn__prev");
const next = $("#btn__next");
const randomAndRepeat = "randomAndRepeat";

let app = {
  isplay: false,
  isCurrenSong: 0,
  isRedo: false,
  isRandom: false,
  arr: [],
  song: [
    {
      name: "thăm cố tri",
      singer: "Thiển Ảnh A",
      path: "./assets/audio/thamcotri.mp3",
      image: "./assets/img/blog1.jpg",
    },
    {
      name: "Daylight",
      singer: "david kushner",
      path: "./assets/audio/daylight.mp3",
      image: "./assets/img/about2.jpg",
    },
    {
      name: "lý ngựa ô",
      singer: "Team ST _ AnSMOKE",
      path: "./assets/audio/lynguao.mp3",
      image: "./assets/img/about1.jpg",
    },
    {
      name: "lý nhân sầu",
      singer: "lý liên kiệt(NVH remix)",
      path: "./assets/audio/lynhansau.mp3",
      image: "./assets/img/team4.jpg",
    },
    {
      name: "truyền thái y",
      singer: "ngô kiến huyx masew x đinh hà uyên thư",
      path: "./assets/audio/truyenthaiy.mp3",
      image: "./assets/img/team3.jpg",
    },
    {
      name: "OMFG - Hello",
      singer: "NCS",
      path: "./assets/audio/omfghello.mp3",
      image: "./assets/img/team2.jpg",
    },
    {
      name: "chashkakefira",
      singer: "DJ PXRPLE – KOKIYO",
      path: "./assets/audio/chashkakefira.mp3",
      image: "./assets/img/team1.jpg",
    },
  ],
  getlocalStorage: JSON.parse(localStorage.getItem(randomAndRepeat)) || {},
  setlocalStorage: function (key, value) {
    this.getlocalStorage[key] = value;
    localStorage.setItem(randomAndRepeat, JSON.stringify(this.getlocalStorage));
  },
  updateValue: function () {
    let get = this.getlocalStorage;
    this.isRedo = get.redo;
    this.isRandom = get.random;
    this.isCurrenSong = get.isCurrenSong;
    if (this.isRandom == undefined) {
      this.isRandom = false;
    }
    if (this.isRedo == undefined) {
      this.isRedo = false;
    }
    if (this.isCurrenSong == undefined) {
      this.isCurrenSong = 0;
    }
    //
    if (this.isRandom) {
      random.style.color = "#ec1f55";
    }
    if (this.isRedo) {
      redo.style.color = "#ec1f55";
    }
    console.log(this.isCurrenSong,get.isCurrenSong);
  },
  selectMusic: function (index = 0) {
    let songItem = $$("#song__item");
    titleName.innerText = `${this.song[index].name}`;
    thumbnail__link.setAttribute("src", `${this.song[index].image}`);
    thumbnail__link.setAttribute("alt", `${this.song[index].name}`);
    audioSoure.setAttribute("src", `${this.song[index].path}`);
    audio.load();
    songItem.forEach((item) => {
      item.classList.remove("active");
    });
    songItem[index].classList.add("active");
  },
  render: function () {
    let html = this.song.map((item) => {
      return `
        <li class="song__item" id="song__item">
            <img src="${item.image}" alt="${item.name}" class="song__img" />
            <div class="song__desc">
            <h3 class="song__name">${item.name}</h3>
            <p class="song__singer">${item.singer}</p>
            </div>
            <div class="song__icon">
            <i class="fa-solid fa-ellipsis" style="color: #fff"></i>
            </div>
        </li>
        `;
    });
    songList.innerHTML = html.join("");
  },

  handlEvents: function () {
    //scroll
    window.addEventListener("scroll", () => {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;
      newSize = 200 - scrollTop;
      if (newSize < 0) {
        thumbnail__link.style.width = "0px";
        thumbnail__link.style.height = "0px";
      } else if (scrollTop <= 200) {
        thumbnail__link.style.width = `${newSize}px`;
        thumbnail__link.style.height = `${newSize}px`;
      }
    });
    // play,pause music
    btnPlay.onclick = () => {
      if (this.isplay === true) {
        btnPlay.innerHTML = `<i class="fas fa-play icon-play"></i>`;
        audio.pause();
        cd.pause();
        this.isplay = false;
      } else {
        btnPlay.innerHTML = `<i class="fa-solid fa-stop"></i>`;
        this.isplay = true;
        audio.play();
        cd.play();
      }
    };
    // change music
    input.addEventListener("input", function () {
      audio.currentTime = audio.duration * (input.value / 100);
    });
    // click any song
    let songItem = $$("#song__item");
    songItem.forEach((item, index) => {
      item.addEventListener("click", () => {
        this.setlocalStorage("isCurrenSong", index);
        songItem.forEach((item) => {
          item.classList.remove("active");
        });
        item.classList.add("active");
        this.selectMusic(index);
        app.isCurrenSong = index;
        btnPlay.innerHTML = `<i class="fa-solid fa-stop"></i>`;
        this.isplay = true;
        audio.play();
      });
    });
    // handl on end music 
    audio.addEventListener("play", () => {
      audio.addEventListener("timeupdate", function () {
        input.value = Math.floor((audio.currentTime / audio.duration) * 100);
        if (audio.currentTime === audio.duration) {
          if (app.isRedo) {
            app.isplay = true;
            audio.play();
          } else if (app.isRandom) {
            let i = app.isCurrenSong;
            if (app.arr.length === app.song.length) {
              app.arr = [];
            }
            do {
              i = Math.floor(Math.random() * app.song.length);
            } while (app.arr.includes(i));
            app.arr.push(i);
            app.isCurrenSong = i;
            app.selectMusic(app.isCurrenSong);
            app.setlocalStorage("isCurrenSong", app.isCurrenSong);
            btnPlay.innerHTML = `<i class="fa-solid fa-stop"></i>`;
            app.isplay = true;
            audio.play();
          } else {
            if (app.isCurrenSong === app.song.length) {
              app.isCurrenSong = 0;
            }
            app.isCurrenSong++;
            app.selectMusic(app.isCurrenSong);
            this.setlocalStorage("isCurrenSong", this.isCurrenSong);
            btnPlay.innerHTML = `<i class="fa-solid fa-stop"></i>`;
            app.isplay = true;
            audio.play();
          }
        }
      });
    });
    // handle button ---------------------------
    // redo
    redo.addEventListener("click", () => {
      if (this.isRedo) {
        redo.style.color = "black";
        this.isRedo = false;
        this.setlocalStorage("redo", this.isRedo);
      } else {
        redo.style.color = "#ec1f55";
        this.isRedo = true;
        this.setlocalStorage("redo", this.isRedo);
      }
    });
    //ramdom
    random.addEventListener("click", () => {
      if (this.random) {
        random.style.color = "black";
        this.random = false;
        arr = [];
        this.setlocalStorage("random", this.random);
      } else {
        random.style.color = "#ec1f55";
        this.arr[0] = this.isCurrenSong;
        this.random = true;
        this.setlocalStorage("random", this.random);
      }
    });
    //prev
    prev.addEventListener("click", () => {
      if (this.isRandom == true) {
        let index = this.arr.indexOf(this.isCurrenSong);
        if (index > 0) {
          console.log(this.arr, this.isCurrenSong, index, this.arr[index - 1]);
          this.isCurrenSong = this.arr[index - 1];
          this.setlocalStorage("isCurrenSong", this.isCurrenSong);
          app.selectMusic(this.isCurrenSong);
          btnPlay.innerHTML = `<i class="fa-solid fa-stop"></i>`;
          app.isplay = true;
          audio.play();
        } else {
          if (this.isCurrenSong > 0) {
            --this.isCurrenSong;
            this.setlocalStorage("isCurrenSong", this.isCurrenSong);
            app.selectMusic(this.isCurrenSong);
            btnPlay.innerHTML = `<i class="fa-solid fa-stop"></i>`;
            app.isplay = true;
            audio.play();
          }
        }
      } else {
        if (this.isCurrenSong > 0) {
          app.selectMusic(this.isCurrenSong - 1);
          this.isCurrenSong--;
          this.setlocalStorage("isCurrenSong", this.isCurrenSong);
          btnPlay.innerHTML = `<i class="fa-solid fa-stop"></i>`;
          app.isplay = true;
          audio.play();
        } else {
          app.isplay = true;
          audio.play();
        }
      }
    });
    // next
    next.addEventListener("click", () => {
      if (this.isRandom == true) {
        let index = this.arr.indexOf(this.isCurrenSong);
        if (index >= this.arr.length - 1) {
          
          let i = app.isCurrenSong;
          if (this.arr.length === app.song.length) {
            app.arr = [];
          }
          do {
            i = Math.floor(Math.random() * app.song.length);
          } while (app.arr.includes(i));
          app.arr.push(i);
          app.isCurrenSong = i;
          this.setlocalStorage("isCurrenSong", app.isCurrenSong);
          app.selectMusic(app.isCurrenSong);
          btnPlay.innerHTML = `<i class="fa-solid fa-stop"></i>`;
          app.isplay = true;
          audio.play();
        } else {
          this.isCurrenSong = this.arr[index + 1];
          this.setlocalStorage("isCurrenSong", this.isCurrenSong);
          app.selectMusic(this.isCurrenSong);
          btnPlay.innerHTML = `<i class="fa-solid fa-stop"></i>`;
          app.isplay = true;
          audio.play();
        }
      } else {
        if (this.isCurrenSong < this.song.length) {
          this.isCurrenSong++;
          app.selectMusic(this.isCurrenSong);
          this.setlocalStorage("isCurrenSong", this.isCurrenSong);
          btnPlay.innerHTML = `<i class="fa-solid fa-stop"></i>`;
          app.isplay = true;
          audio.play();
        } else {
          app.isplay = true;
          audio.play();
        }
      }
    });
    // cd
    let cd = thumbnail__link.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cd.pause();
  },
  start: function () {
    this.setlocalStorage();
    this.updateValue();
    this.render();
    this.selectMusic(this.isCurrenSong)
    this.handlEvents();
  },
};

app.start();
