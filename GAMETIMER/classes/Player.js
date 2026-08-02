class Player {


    constructor(name, time) {


        // プレイヤー名
        this.name = name;


        // 自分専用タイマー
        this.timer = new Timer(time);



        // 現在ターン中か

        this.active = false;



        // 終了済みか

        this.finished = false;


    }





    // ターン開始

    startTurn(){


        this.active = true;


        this.timer.start();


    }





    // ターン終了

    finishTurn(){


        this.timer.stop();


        this.active = false;


        this.finished = true;


    }





    // 一時停止

    pause(){


        this.timer.stop();


    }





    // 再開

    resume(){


        if(this.active){

            this.timer.start();

        }


    }





    // リセット

    reset(){


        this.timer.reset();


        this.active = false;


        this.finished = false;


    }





    // 更新

    update(){


        this.timer.update();


    }





    // 表示用時間

    getTime(){


        return this.timer.display();


    }





    // 時間切れ

    isTimeOver(){


        return this.timer.isFinished();


    }


}