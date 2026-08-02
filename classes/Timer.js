class Timer {


    constructor(time) {

        // 初期時間(ms)
        this.initialTime = time * 1000;

        // 残り時間(ms)
        this.remaining = this.initialTime;


        // 動作状態
        this.running = false;


        // 開始した時刻
        this.startTime = null;

    }



    // 開始

    start() {

        if(this.running) return;


        this.running = true;


        // 現在時刻を記録
        this.startTime = performance.now();

    }



    // 停止

    stop() {

        if(!this.running) return;


        this.update();


        this.running = false;

    }




    // リセット

    reset() {


        this.remaining = this.initialTime;


        this.running = false;


        this.startTime = null;

    }




    // 時間更新

    update() {


        if(!this.running) return;



        const now = performance.now();



        const elapsed =
            now - this.startTime;



        this.remaining =
            this.remaining - elapsed;



        this.startTime = now;



        // 0以下防止

        if(this.remaining <= 0){

            this.remaining = 0;

            this.running = false;

        }


    }





    // 秒表示

    getSeconds(){


        return this.remaining / 1000;


    }





    // 表示文字

    display(){


        const sec =
            this.getSeconds();



        return sec.toFixed(3);


    }



    // 終了判定

    isFinished(){


        return this.remaining <= 0;


    }


}