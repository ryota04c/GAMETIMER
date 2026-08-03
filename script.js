// ゲーム管理オブジェクト作成

let game =
    new GameManager(
        PRESETS.daifugo
    );

const presetSelect =
    document.getElementById(
        "presetSelect"
    );



presetSelect.addEventListener(
    "change",
    ()=>{

        game = new GameManager(

            PRESETS[
                presetSelect.value
            ];
             prepareInput.value=preset.preparation;

            timeInput.value=preset.playerTime;
        
            playerInput.value=preset.players;

        );

    }
);


// HTML取得

const centerTimer =
    document.getElementById("centerTimer");


const players =
    document.querySelectorAll(".player");



const startButton =
    document.getElementById("start");


const pauseButton =
    document.getElementById("pause");


const resetButton =
    document.getElementById("reset");

const presetSelect=document.getElementById("presetSelect");
const prepareInput=document.getElementById("prepareInput");
const timeInput=document.getElementById("timeInput");
const playerInput=document.getElementById("playerInput");



// 開始ボタン

startButton.addEventListener(
    "click",
    ()=>{

        game.start();

    }
);




// 一時停止

pauseButton.addEventListener(
    "click",
    ()=>{

        game.pause();

    }
);



// リセット

resetButton.addEventListener(
    "click",
    ()=>{

        game.reset();

    }
);





// 各プレイヤー終了ボタン

players.forEach(
    (element,index)=>{


        const button =
            element.querySelector(".finish-btn");


        button.addEventListener(
            "click",
            ()=>{


                // 現在のプレイヤーなら進む

                if(
                    game.currentPlayer === index
                    &&
                    game.state === "PLAYING"
                ){

                    game.nextPlayer();

                }


            }
        );


    }
);





// 画面更新

function render(){



    // ゲーム更新

    game.update();




    // 準備時間表示

    if(
        game.state === "PREPARATION"
    ){

        centerTimer.textContent =
            game.prepareTimer.display();

    }

    else if(
        game.state === "PLAYING"
    ){

        centerTimer.textContent =
            "START";

    }

    else{

        centerTimer.textContent =
            "READY";

    }






    // プレイヤー表示

    game.players.forEach(
        (player,index)=>{


            const element =
                players[index];


            const timer =
                element.querySelector(".timer");



            timer.textContent =
                player.getTime();




            // 現在ターン表示

            if(
                game.currentPlayer === index
                &&
                game.state === "PLAYING"
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




    requestAnimationFrame(render);

}



// 開始

render();
