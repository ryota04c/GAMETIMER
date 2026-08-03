const game={
    players:[],
    playerTime:30,
    prepareTime:10,
    state:"prepare",
    currentPlayer:0,
    prepareRemaining:0,
    lastTime:null
};

const board =
    document.getElementById("board");

const playerCount =
    document.getElementById("playerCount");

// 座席配置
const seatLayouts = {   
    2:[
        "top",
        "bottom"
    ],
    3:[
        "top",
        "right",
        "left"
    ],
    4:[
        "top",
        "right",
        "bottom",
        "left"
    ],
    5:[
        "top",
        "topRight",
        "bottomRight",
        "bottomLeft",
        "left"
    ],
    6:[
        "top",
        "topRight",
        "right",
        "bottomRight",
        "bottomLeft",
        "left"
    ],
    7:[
        "top",
        "topRight",
        "right",
        "bottomRight",
        "bottom",
        "bottomLeft",
        "left"
    ],
    8:[
        "top",
        "topRight",
        "right",
        "bottomRight",
        "bottom",
        "bottomLeft",
        "left",
        "topLeft"
    ]
};





// 回転

const rotations = {
    top:180,
    topRight:-135,
    right:-90,
    bottomRight:-45,
    bottom:0,
    bottomLeft:45,
    left:90,
    topLeft:135
};


const settingBoard =
    document.getElementById("settingBoard");

function createNameInputs(count){
    settingBoard.innerHTML="",
    let seats =
        seatLayouts[count];
    seats.forEach(
        (seat,index)=>{
            let div =
            document.createElement("div");
            div.className =
            "settingSeat setting-"+seat;
            div.innerHTML=`
                <div>
                    Player${index+1}
                </div>
                <input
                class="nameInput"
                value="Player${index+1}">
            `;
            settingBoard.appendChild(div);
        }
    );

}

function createSeats(count){
    board.innerHTML="";
    let seats =
        seatLayouts[count];
        seats.forEach(
        (seat,index)=>{
            let div =
            document.createElement("div");
            div.className =
                "seat seat-"+seat;
            div.innerHTML = `
                <div class="name">
                    Player${index+1}
                </div>
                <div class="time">
                    30.000
                </div>
                <button>
                    終了
                </button>
            `;
            board.appendChild(div);
        }

    );


}





playerCount.onchange=()=>{
    let count =
    Number(playerCount.value);
    createNameInputs(count);
};

const startButton =
document.getElementById("startGame");

startButton.onclick=()=>{

    let inputs =
    document.querySelectorAll(".nameInput");

    let seats =
    seatLayouts[
        Number(playerCount.value)
    ];
    game.players=[];


    seats.forEach(
        (seat,index)=>{


            game.players.push({
                seat:seat,
                name:inputs[index].value,        
                time:
                Number(playerTime.value),                    
                running:false
            });


        }
    );
    game.prepareTime =
    Number(prepareTime.value);



    // 設定画面非表示
    document
    .getElementById("settingScreen")
    .style.display="none";
    // タイマー画面表示
    document
    .getElementById("timerScreen")
    .style.display="block";
    
    createTimerSeats();
    startPrepareTimer();
};

function createTimerSeats(){
    board.innerHTML="";
    game.players.forEach(
        (player)=>{
            let div =
            document.createElement("div");
            div.className =
            "seat seat-"+player.seat;
            div.innerHTML=`
                <div class="name">
                    ${player.name}
                </div>
                <div class="time">
                    ${player.time.toFixed(3)}
                </div>
                <button>
                    終了
                </button>
            `;
            board.appendChild(div);
        }
    );
}
//タイマー処理
function startPrepareTimer(){
    game.state="prepare";
    game.prepareRemaining =
        game.prepareTime * 1000;
    game.lastTime =
    performance.now();
    requestAnimationFrame(updateTimer);
}
function updateTimer(now){
    let delta =
    now-game.lastTime;
    game.lastTime=now;
    // 準備中
    if(game.state==="prepare"){
        game.prepareRemaining
        -=delta;
        if(game.prepareRemaining<=0){
            game.prepareRemaining=0;
            game.state="playing";
            game.currentPlayer=0;
            game.players[0].running=true;
        }
        centerTimer.textContent =
        (game.prepareRemaining/1000)
        .toFixed(3);
    }
    // プレイ中
    else if(game.state==="playing"){
        let player =
        game.players[
            game.currentPlayer
        ];
        if(player.running){
            player.time
            -=delta/1000;
            if(player.time<0)
                player.time=0;
        }
        centerText.textContent =
        player.name+" のターン";
    }

    updatePlayerDisplay();
    requestAnimationFrame(updateTimer);
}
function updatePlayerDisplay(){
    document
    .querySelectorAll(".seat")
    .forEach((element,index)=>{
        if(!game.players[index])
            return;
        element
        .querySelector(".time")
        .textContent =
        game.players[index]
        .time
        .toFixed(3);
        if(index===game.currentPlayer){
            element.style
            .background="#0044aa";
        }else{
            element.style
            .background="#222";
        }
    });
}

// 初期表示
createNameInputs(
    Number(playerCount.value)
);
