declare namespace THREE {
  export class KeyFrameAnimation {
    constructor(animation: any);

    timeScale: number;
    loop: boolean;

    play(startTime: number): void;
  }
}
