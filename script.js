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





// 初期表示

createNameInputs(4);
