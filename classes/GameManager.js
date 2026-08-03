class GameManager {

       constructor(preset){

            this.preset = preset;
        
            this.prepareTimer =
                new Timer(
                    preset.preparation
                );
        
        
        
            this.players=[];
        
        
        
            for(
                let i=0;
                i<preset.players;
                i++
            ){
        
                this.players.push(
        
                    new Player(
        
                        "Player"+(i+1),
        
                        preset.playerTime
        
                    )
        
                );
        
            }
        
        
        
            this.currentPlayer=0;
        
            this.state="READY";
        
        }


        // 現在のプレイヤー番号

        this.currentPlayer = 0;



        // 状態

        this.state = "READY";


    // 更新

    update(){


        if(this.state === "PREPARATION"){


            this.prepareTimer.update();



            // 準備終了

            if(this.prepareTimer.isFinished()){


                this.startPlayerTurn();


            }


        }



        else if(this.state === "PLAYING"){


            let player =
                this.players[this.currentPlayer];


            player.update();



            // 時間切れ

            if(player.isTimeOver()){


                this.nextPlayer();


            }

        }


    }





    // プレイヤーターン開始

    startPlayerTurn(){


        this.state = "PLAYING";


        this.currentPlayer = 0;


        this.players[
            this.currentPlayer
        ].startTurn();


    }





    // 次のプレイヤー

    nextPlayer(){


        // 現在停止

        this.players[
            this.currentPlayer
        ].finishTurn();



        // 次へ

        this.currentPlayer++;



        // 最後ならPlayer1へ

        if(
            this.currentPlayer >=
            this.players.length
        ){

            this.currentPlayer = 0;

        }



        this.players[
            this.currentPlayer
        ].startTurn();


    }





    // 一時停止

    pause(){


        if(this.state === "PREPARATION"){


            this.prepareTimer.stop();


        }


        if(this.state === "PLAYING"){


            this.players[
                this.currentPlayer
            ].pause();


        }



        this.state="PAUSE";


    }





    // 再開

    resume(){


        if(this.state !== "PAUSE")
            return;



        if(
            this.prepareTimer.remaining > 0
            &&
            this.currentPlayer === 0
            &&
            this.state !== "PLAYING"
        ){

            this.prepareTimer.start();

        }


        else{


            this.players[
                this.currentPlayer
            ].resume();


        }


        this.state="PLAYING";


    }





    // リセット

    reset(){


        this.prepareTimer.reset();



        this.players.forEach(
            player=>{
                player.reset();
            }
        );



        this.currentPlayer=0;


        this.state="READY";


    }





    // 現在表示用

    getCurrentPlayer(){


        return this.players[
            this.currentPlayer
        ];

    }


}
