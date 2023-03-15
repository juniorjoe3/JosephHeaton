console.log('load audio')

const audioList = [
    {
        name: 'childuhoh',
        fileName: 'childuhoh.mp3',
        volume: 100,
        type: 'voice'
    },
    {
        name: 'childgoodbye',
        fileName: 'childgoodbye.mp3',
        volume: 100,
        type: 'voice'
    },
    {
        name: 'childok',
        fileName: 'childok.mp3',
        volume: 100,
        type: 'voice'
    },
    {
        name: 'childno',
        fileName: 'childno.mp3',
        volume: 100,
        type: 'voice'
    },
    {
        name: 'childyes',
        fileName: 'childyes.mp3',
        volume: 100,
        type: 'voice'
    },
    {
        name: 'wow',
        fileName: 'wow.mp3',
        volume: 100,
        type: 'voice'
    },
    {
        name: 'update',
        fileName: 'update.mp3',
        volume: 100,
        type: 'ui'
    },
    {
        name: 'delete',
        fileName: 'delete.mp3',
        volume: 100,
        type: 'ui'
    },
    {
        name: 'sadtrumpet',
        fileName: 'sadtrumpet.mp3',
        volume: 100,
        type: 'effect'
    },
    {
        name: 'wrong',
        fileName: 'wrong.mp3',
        volume: 100,
        type: 'effect'
    },
    {
        name: 'coin',
        fileName: 'coin.mp3',
        volume: 100,
        type: 'effect'
    },
    {
        name: 'ohno',
        fileName: 'ohno.mp3',
        volume: 100,
        type: 'voice'
    },
    {
        name: 'click',
        fileName: 'click.mp3',
        volume: 100,
        type: 'ui'
    },
    {
        name: 'pop',
        fileName: 'pop.mp3',
        volume: 100,
        type: 'effect'
    },
    {
        name: 'bounce',
        fileName: 'bounce.mp3',
        volume: 100,
        type: 'effect'
    },
]


export function getAudioHandler() {
    const obj = new AudioHandler(audioList);
    return obj;
} 


  class AudioHandler {
    //properties
    uiVol = 100; voiceVol = 100; effectsVol = 100; masterVol = 100;
    #audioMap = new Map(); #audioFolderPath = '';
    //constructor
    constructor(audioList) {
        for (let i = 0; i < audioList.length;i++) {
            const obj = audioList[i];
            this.#audioMap.set(obj.name, obj);
        }
    }
    //methods
    play(name) {
        const obj = this.#audioMap.get(name);
        const filePath = this.audioFolderPath + obj.fileName;
        let volume = 1;
        switch(obj.type) {
            case "ui":
                volume = this.uiVol;
                break;
            case "effect":
                volume = this.effectsVol;
                break;
            case "voice":
                volume = this.voiceVol;
                break;
        }
        const audio = new Audio(filePath);
        audio.volume = (volume/100) * (obj.volume/100) * (this.masterVol/100);
        audio.play();
    }
    preLoad() {
        const oldVol = this.masterVol;
        this.masterVol = 0;
        console.log('preload audio')
        for (const name of this.#audioMap.keys()) {
            this.play(name);
          }
        this.masterVol = oldVol;
    }
    get audioFolderPath() {
        return this.#audioFolderPath;
    }
    set audioFolderPath(path) {
        this.#audioFolderPath = path;
        this.preLoad();
    }
  }


