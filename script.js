const game={
    players:[],
    playerTime:30,
    prepareTime:10,
    state:"prepare",
    currentPlayer:0,
    prepareRemaining:0,
    lastTime:null,
    paused:false,
    lastSecond:-1,
    lastPrepareSecond:-1
};
const board =
    document.getElementById("board");
const playerCount =
    document.getElementById("playerCount");
const prepareTime =
    document.getElementById("prepareTime");
const playerTime =
    document.getElementById("playerTime");
const pauseButton =
    document.getElementById("pauseButton");

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
    settingBoard.innerHTML="";
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
    seatLayouts[Number(playerCount.value)];
    game.players=[];
    seats.forEach(
        (seat,index)=>{
            game.players.push({
                seat:seat,
                name:inputs[index].value,        
                time:
                Number(playerTime.value),                    
                running:false,
                alive:true
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
        (player,index)=>{
            let div =
            document.createElement("div");
            div.className =
            "seat seat-"+player.seat;
            div.innerHTML=`
                <div class="seatContent">
                    <div class="name">
                        ${player.name}
                    </div>
                    <div class="time">
                        ${player.time.toFixed(3)}
                    </div>
                </div>
            `;
            board.appendChild(div);        
                div.onclick=()=>{
                    if(game.state !== "playing" ||game.paused) return;
                    if(index !== game.currentPlayer){
                        div.animate([
                            {transform:"scale(1)"},
                            {transform:"scale(.95)"},
                            {transform:"scale(1)"}
                        ],{ duration:120});              
                        return;
                    }
                    finishTurn();
                };
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
    if(game.paused){
        game.lastTime=now;
        requestAnimationFrame(updateTimer);
        return;
    }
    let delta =
    now-game.lastTime;
    game.lastTime=now;
    // 準備中
    if(game.state==="prepare"){
        game.prepareRemaining
        -=delta;
        let second =
        Math.ceil(
            game.prepareRemaining / 1000
        );
        if(second <= 5&&second > 0&&second !== game.lastPrepareSecond){
            game.lastPrepareSecond = second;
            playWarningSound();
        }
        if(game.prepareRemaining<=0){
            game.prepareRemaining=0;
            // 開始音
            playStartSound();
            game.state="playing";
            game.currentPlayer=0;
            game.players[0].running=true;
            centerText.textContent =
             "▶ "+game.players[0].name+" のターン";
            centerTimer.textContent="";
            game.lastPrepareSecond=-1;
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
            if(player.time<0){
                player.time=0;
                timeOver();
            }
        }
        centerTimer.textContent = "";
        let second =
            Math.ceil(player.time); 
        if(second<=10&&second!==game.lastSecond){
            game.lastSecond=second;
            playWarningSound();
        }
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
        const player =
            game.players[index];
        const timeElement =
            element.querySelector(".time");
        if(!player.alive){
            element.classList.add("eliminated");
            return;
        }else{
            element.classList.remove("eliminated");
        }
        timeElement.textContent =
            player.time.toFixed(3);
        // 色リセット
        timeElement.classList.remove(
            "warning",
            "danger"
        );
        // 現在ターンのみ警告
        if(index===game.currentPlayer&&player.alive ){
            if(game.state === "playing"){
                element.classList.add(
                    "currentTurn"
                );
            }
            if(player.time<=3){
                timeElement
                .classList.add(
                    "danger"
                );
            }else if(player.time<=10){
                timeElement
                .classList.add(
                    "warning"
                );
            }
        }else{
             element.classList.remove(
                "currentTurn"
            );
        }
    });
}
//ターン終了処理
function finishTurn(){
    if(game.state!=="playing"||game.paused)
        return;
    nextPlayer();
}
//時間切れ処理
function timeOver(){
    let player =
    game.players[
        game.currentPlayer
    ];
    player.running=false;
    player.alive=false;
    const card =
    document.querySelectorAll(".seat")
    [
        game.currentPlayer
    ];
    card.classList.add("timeOut");
    
    card
        .querySelector(".time")
        .textContent =
    "TIME OUT";
    // 効果音
    playTimeOverSound();
    // 少し待って次へ
    setTimeout(()=>{
        card.classList.remove(
            "timeOut"
        );
        card.classList.add(
            "eliminated"
        );
        card
        .querySelector(".time")
        .textContent="LOSE";
        nextPlayer();
    },1000);
}
//プレイヤー遷移
function nextPlayer(){
    game.players[
        game.currentPlayer
    ].running=false;
    let count=0;
    do{
        game.currentPlayer++;
        if(game.currentPlayer >= game.players.length){
            game.currentPlayer=0;
        }
        count++;
    }
    while(
        !game.players[
            game.currentPlayer
        ].alive 
        &&
        count < game.players.length
    );
    // 残った人を開始
    game.players[
        game.currentPlayer
    ].running=true;
    //プレイヤー残数検知
    const alivePlayers =
    game.players.filter(
        p=>p.alive
    );
    if(alivePlayers.length===1){
        game.state="end";
        centerText.textContent =
        alivePlayers[0].name+
        " WIN";   
        centerTimer.textContent =
        "GAME END";
        return;
        // アニメーション
        centerText.classList.remove("turnAnimation");
        void centerText.offsetWidth;   // アニメーションをリセット
        centerText.classList.add("turnAnimation");
    }else{
        // 中央表示更新
        centerText.textContent =
            "▶ " + game.players[game.currentPlayer].name + " TURN";
        // アニメーション
        centerText.classList.remove("turnAnimation");
        void centerText.offsetWidth;   // アニメーションをリセット
        centerText.classList.add("turnAnimation");
    }
}
//一時停止処理
pauseButton.onclick=()=>{
    if(game.state==="end")
        return;
    game.paused =
    !game.paused;
    if(game.paused){
        pauseButton.textContent =
        "再開";
        centerText.textContent =
        "一時停止";
    }else{
        pauseButton.textContent =
        "一時停止";
        centerText.textContent =
        "▶ "+
        game.players[
            game.currentPlayer
        ].name+
        " のターン";
        game.lastTime =
        performance.now();
    }
};
//時間切れ音声
function playTimeOverSound(){
    const ctx =
        new AudioContext();
    const osc =
        ctx.createOscillator();
    osc.frequency.value=880;
    osc.connect(
        ctx.destination
    );
    osc.start();
    osc.stop(
        ctx.currentTime+0.3
    );
}
//警告音
function playWarningSound(){
    const ctx =
        new AudioContext();
    const osc =
        ctx.createOscillator();
    osc.frequency.value=440;
    osc.connect(
        ctx.destination
    );
    osc.start();
    osc.stop(
        ctx.currentTime+0.1
    );
}
//開始音
function playStartSound(){
    const ctx =
        new AudioContext();
    const osc =
        ctx.createOscillator();
    const gain =
    ctx.createGain();
    osc.type="square";
    osc.frequency.value=880;
    osc.connect(gain);
    gain.connect(
        ctx.destination
    );
    gain.gain.value=0.3;
    osc.start();
    osc.frequency.exponentialRampToValueAtTime(
        1320,
        ctx.currentTime+0.2
    );
    osc.stop(
        ctx.currentTime+0.4
    );
}
// 初期表示
createNameInputs(
    Number(playerCount.value)
);
