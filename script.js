// ==============================
// 要素取得
// ==============================

const settingScreen =
    document.getElementById("settingScreen");

const timerScreen =
    document.getElementById("timerScreen");


const startButton =
    document.getElementById("startGame");


const pauseButton =
    document.getElementById("pauseButton");


const resetButton =
    document.getElementById("resetButton");


const playersArea =
    document.getElementById("players");


const centerTimer =
    document.getElementById("centerTimer");




// 設定入力

const prepareInput =
    document.getElementById("prepareTime");


const playerTimeInput =
    document.getElementById("playerTime");


const playerCountInput =
    document.getElementById("playerCount");

const nameInputs =
    document.querySelectorAll(".playerNameInput");


// ==============================
// ゲームデータ
// ==============================


let game = {

    state:"setting",

    prepareTime:10,

    playerTime:30,

    playerCount:4,


    currentPlayer:0,


    players:[],


    startTime:null,

    remainingPrepare:0

};




// ==============================
// タイマークラス
// ==============================


class Timer {


    constructor(time){

        this.initial=time*1000;

        this.remaining=this.initial;

        this.running=false;

        this.startTime=null;

    }



    start(){

        if(this.running)return;


        this.running=true;

        this.startTime=
            performance.now();

    }



    update(){


        if(!this.running)return;


        let now=
            performance.now();


        let diff=
            now-this.startTime;


        this.remaining-=diff;


        this.startTime=now;



        if(this.remaining<=0){

            this.remaining=0;

            this.running=false;

        }

    }



    stop(){

        this.update();

        this.running=false;

    }



    reset(){

        this.remaining=
            this.initial;

        this.running=false;

    }



    text(){

        return(
            this.remaining/1000
        )
        .toFixed(3);

    }


    finished(){

        return this.remaining<=0;

    }


}





// ==============================
// プレイヤー
// ==============================


class Player{


    constructor(name,time){


        this.name=name;


        this.timer=
            new Timer(time);


    }



    start(){

        this.timer.start();

    }



    stop(){

        this.timer.stop();

    }



    update(){

        this.timer.update();

    }

}





// ==============================
// ゲーム開始
// ==============================


startButton.onclick=()=>{


    game.prepareTime=
        Number(prepareInput.value);


    game.playerTime=
        Number(playerTimeInput.value);


    game.playerCount=
        Number(playerCountInput.value);



    game.players=[];



     for(let i=0;i<game.playerCount;i++){
        let name =
            nameInputs[i].value;
    
    
        game.players.push(
    
            new Player(
    
                name,
    
                game.playerTime
    
            )
    
        );
    
    
    }



    createPlayers();



    settingScreen.style.display="none";


    timerScreen.style.display="flex";



    game.state="prepare";


    game.remainingPrepare=
        new Timer(
            game.prepareTime
        );


    game.remainingPrepare.start();


};






// ==============================
// プレイヤー表示作成
// ==============================


function createPlayers(){


    playersArea.innerHTML="";



    game.players.forEach(

        (player,index)=>{


            let div=
            document.createElement("div");



            div.className="player";


            div.innerHTML=`

                <div class="playerName">
                    ${player.name}
                </div>


                <div class="playerTime">
                    ${game.playerTime.toFixed(3)}
                </div>


                <button class="finishButton">

                    終了

                </button>

            `;



            div
            .querySelector(".finishButton")
            .onclick=()=>{


                if(
                    game.currentPlayer===index
                    &&
                    game.state==="playing"
                ){

                    nextPlayer();

                }


            };



            playersArea.appendChild(div);


        }

    );

}




// ==============================
// 次のプレイヤー
// ==============================


function nextPlayer(){


    game.players[
        game.currentPlayer
    ]
    .stop();



    game.currentPlayer++;



    if(
        game.currentPlayer>=
        game.players.length
    ){

        game.currentPlayer=0;

    }



    game.players[
        game.currentPlayer
    ]
    .start();


}





// ==============================
// 一時停止
// ==============================


pauseButton.onclick=()=>{


    if(game.state==="playing"){


        game.players[
            game.currentPlayer
        ]
        .stop();


        game.state="pause";

    }

    else if(game.state==="pause"){


        game.players[
            game.currentPlayer
        ]
        .start();


        game.state="playing";

    }

};





// ==============================
// リセット
// ==============================


resetButton.onclick=()=>{


    timerScreen.style.display="none";


    settingScreen.style.display="flex";


    game.state="setting";


};






// ==============================
// 表示更新
// ==============================


function update(){


    // 準備中

    if(game.state==="prepare"){


        game.remainingPrepare.update();



        centerTimer.textContent=
            game.remainingPrepare.text();



        if(
            game.remainingPrepare.finished()
        ){


            game.state="playing";


            game.currentPlayer=0;


            game.players[0].start();


        }


    }



    // プレイ中

    else if(game.state==="playing"){



        game.players[
            game.currentPlayer
        ]
        .update();



        centerTimer.textContent=
            "PLAY";



    }




    // プレイヤー表示更新


    document
    .querySelectorAll(".player")
    .forEach(

        (element,index)=>{


            element
            .querySelector(".playerTime")
            .textContent=
            game.players[index]
            .timer.text();



            if(
                index===
                game.currentPlayer
                &&
                game.state==="playing"
            ){

                element.classList.add(
                    "active"
                );

            }

            else{

                element.classList.remove(
                    "active"
                );

            }


        }

    );



    requestAnimationFrame(update);

}


update();
