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
    lastPrepareSecond:-1,
    holding:false,
    holdStart:null,
    holdDuration:1000,
    holdPlayer:null,
    holdingDiv:null,
    holdTimer:null,
    holdInterval:null,
    rankTop:1,
    rankBottom:null,
    selectedLosePlayer:null
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
const forceLoseButton =
    document.getElementById("forceLoseButton");
const confirmScreen =
    document.getElementById("confirmScreen");
const confirmYes =
    document.getElementById("confirmYes");
const confirmNo =
    document.getElementById("confirmNo");
const loseSelectArea =
    document.getElementById("loseSelectArea");

// 座席配置
const seatLayouts = {   
    2:[
        "bottom",
        "top"
    ],
    3:[
        "bottom",
        "left",
        "right",
        
    ],
    4:[
        "bottom",
        "left",
        "top",
        "right"
    ],
    5:[
        "bottom",
        "bottomLeft",
        "topLeft",
        "topRight",
        "bottomRight"
    ],
    6:[
        "bottom",
        "bottomLeft",
        "topLeft",
        "top",
        "topRight",
        "bottomRight"
    ],
    7:[
        "bottom",
        "bottomLeft",
        "left",
        "topLeft",
        "topRight",
        "right",
        "bottomRight"
    ],
    8:[
        "bottom",
        "bottomLeft",
        "left",
        "topLeft",
        "top",
        "topRight",
        "right",
        "bottomRight"
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
                alive:true,
                rank:null
            });
        }
    );
    forceLoseButton.style.display="none";
    game.rankTop = 1;
    game.rankBottom = game.players.length;
    game.prepareTime =Number(prepareTime.value);
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
                    <div class="nameBar">
                        <div class="name">
                            ${player.name}
                        </div>
                    </div>
                    <div class="timeArea">
                        <div class="time">
                            ${player.time.toFixed(3)}
                        </div>
                    </div>
                    <div class="holdBar">
                        <div class="holdProgress"></div>               
                    </div>
                </div>
            `;
            board.appendChild(div);        
                div.onpointerdown=(e)=>{
                    if(game.state!=="playing" || game.paused)
                        return;         
                    if(index!==game.currentPlayer)
                        return;
                    game.holding=true;
                    game.holdPlayer=index;
                    game.holdingDiv=div;
                    div.classList.add("holding");
                    game.paused=true;
                    const progress =
                    div.querySelector(".holdProgress");
                    let start =
                    performance.now();
                    game.holdInterval=setInterval(()=>{
                        let elapsed =
                        performance.now()-start;
                        let percent =
                        Math.min(
                            elapsed/game.holdDuration*100,
                            100
                        );
                        progress.style.width =
                        percent+"%";
                    },20);
                    game.holdTimer=setTimeout(()=>{
                        clearInterval(game.holdInterval);
                        progress.style.width="0%";
                        div.classList.remove("holding");
                        game.holding=false;
                        game.paused=false;
                        finishHold(index);
                    },game.holdDuration);
                
                };
        }
    );
}
document.addEventListener(
    "pointerup",
    cancelHold
);
document.addEventListener(
    "pointercancel",
    cancelHold
);
//ホールド終了処理
function cancelHold(){
    if(!game.holding)
        return;
    clearTimeout(game.holdTimer);
    clearInterval(game.holdInterval);
    if(game.holdingDiv){
        const progress =
            game.holdingDiv
            .querySelector(".holdProgress");
        progress.style.width="0%";
        game.holdingDiv
        .classList.remove("holding");
    }
    game.holding=false;
    game.holdingDiv=null;
    if(game.state==="playing"){
        game.paused=false;
        game.lastTime =
        performance.now();
         nextPlayer();
    }
}
//上がり処理
function finishHold(index){
    const player =
    game.players[index];
    player.alive=false;
    player.running=false;
    player.rank = game.rankTop;
    game.rankTop++;
    const card =
        document.querySelectorAll(".seat")
        [index];
    card.classList.add(
        "finished"
    );
    card.querySelector(".time")
    .textContent=
        player.rank+"位";
    centerText.textContent =
        player.name+" 上がり";
    setTimeout(()=>{
        nextPlayer();
    },800);
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
        if(second <= 3&&second > 0&&second !== game.lastPrepareSecond){
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
            forceLoseButton.style.display="block";
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
        if(second<=3&&second!==game.lastSecond){
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
            }else if(player.time<=7){
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
    player.rank = game.rankBottom;
    game.rankBottom--;
    const card =
    document.querySelectorAll(".seat")[ game.currentPlayer];
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
        .textContent=player.rank+"位";
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
        const lastPlayer =
            alivePlayers[0];
        lastPlayer.rank =
            game.rankTop;
        game.state="end";
        forceLoseButton.style.display="none";
        showRanking();
        // アニメーション
        centerText.classList.remove("turnAnimation");
        void centerText.offsetWidth;   // アニメーションをリセット
        centerText.classList.add("turnAnimation");
        return;
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
//強制敗北処理
forceLoseButton.onclick=()=>{
    if(game.state!=="playing")
        return;
    game.paused=true;
    createLoseSelect();
    confirmScreen.style.display="block";
    loseSelectScreen.style.display="block";
};
loseYes.onclick=()=>{
    confirmScreen.style.display="none";
    loseConfirmScreen.style.display="none";
    game.paused=false;
    forceLose(
        game.selectedLosePlayer
    );
    game.selectedLosePlayer=null;
};
loseNo.onclick=()=>{
    loseConfirmScreen.style.display="none";
    loseSelectScreen.style.display="block";
};
loseCancel.onclick=()=>{
    confirmScreen.style.display="none";
    game.paused=false;
    game.selectedLosePlayer=null;
    game.lastTime=
    performance.now();
};
function createLoseSelect(){
    loseSelectArea.innerHTML="";
    game.players.forEach((player,index)=>{
        if(!player.alive)
            return;
        const button =
        document.createElement("button");
        button.textContent =
        player.name;
        button.onclick=()=>{
            game.selectedLosePlayer=index;
            loseSelectScreen.style.display="none";
            loseConfirmScreen.style.display="block";
            loseConfirmText.textContent =
            player.name+
            "を敗北させますか？";
        };
        loseSelectArea.appendChild(button);
    });
}
function forceLose(index){
    const player =
        game.players[index];
    if(!player.alive)
        return;
    player.alive=false;
    // 下位から順位付け
    player.rank =
        game.rankBottom;
    game.rankBottom--;
    player.running=false;
    const card =
        document.querySelectorAll(".seat")
        [index];
    card.classList.add(
        "eliminated"
    );
    card.querySelector(".time")
        .textContent=player.rank+"位";
    // 現在ターンなら次へ
    if(index===game.currentPlayer){
        setTimeout(()=>{
            nextPlayer();
        },800);
    }else{
        //現在ターンでないなら続行
        game.lastTime =
            performance.now();
    }
}
function showRanking(){
    const ranking =
    [...game.players]
    .sort((a,b)=>a.rank-b.rank);
    centerText.classList.add("ranking");
    centerText.innerHTML =
    ranking.map(
        player =>
        `${player.rank}位 ${player.name}`
    )
    .join("<br>");
    centerTimer.textContent =
    "GAME END";
    pauseButton.textContent =
    "END";
}
//一時停止処理
pauseButton.onclick=()=>{
    if(game.state==="end"){
        location.reload();
        return;
    }
    game.paused =
    !game.paused;
    if(game.paused){
        pauseButton.textContent =
        "RESTART";
        centerText.textContent =
        "PAUSE";
    }else{
        pauseButton.textContent =
        "PAUSE";
        if(game.state==="prepare"){
            centerText.textContent ="READY";
        }else if(game.state==="playing"){
            centerText.textContent =
            "▶ "+
            game.players[
                game.currentPlayer
            ].name+
            " のターン";
        }
        game.lastTime =
        performance.now();
    }
};

const audioCtx=new AudioContext();
//時間切れ音声
function playTimeOverSound(){
    const ctx =audioCtx;
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
    const ctx =audioCtx;
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
    const ctx =audioCtx;
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
