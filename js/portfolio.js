window.onload = function(){
        // --------------------돔 구조--------------------
    const MAP = document.getElementById("field"); //전체 맵
    const CHAR = document.getElementById("char"); //캐릭터
    const MENT = CHAR.getElementsByClassName("ment")[0];
    const GOOSE = document.getElementById("goose"); //메인거위
    const TREE = document.querySelector("#object>.trees"); //나무들
    const EGGS = document.querySelector("#object>.eggs"); //필드 달걀
    const eggPlate = document.querySelector("#controller>.eggPlate");
    const ctrlActive = document.getElementById("active");
    const ctrlTouch = document.querySelector("#controller>.touch");
    const loadSection = document.querySelector("#load>.before_start");
    const explainDiv = document.getElementsByClassName("explain")[0];
    const endingSection = document.querySelector(".ending");
    // -------------------- 상수 --------------------
    const CHAR_WIDTH = 150; // 캐릭터 너비
    const CHAR_HEIGHT = 200; // 캐릭터 높이
    const MAP_WIDTH = 6000; // 맵 전체 너비
    const MAP_HEIGHT = 5000; // 맵 전체 높이
    const CHAR_MOVE_FPS = 60; //max(300) 초당 n회
    const CHAR_MOVE_PX = 9; // max(9) (CHAR_MOVE_PX * CHAR_MOVE_SPEED px/s)
    const CHAR_CROSS_PX = CHAR_MOVE_PX / Math.sqrt(2); //대각선 이동 속도
    const GOOSE_MOVE_FPS = 60; //max(300) 
    const GOOSE_MOVE_PX = 10.5;
    const ANI_MOVE_PX = 5;
    const MAP_RATIO = 0.8; // 맵 비율
    const key = keyFuncs();
    const move = moveFuncs();
    const goose = animalFunc(GOOSE,GOOSE_MOVE_PX);
    const geese = Array(4);
    const pigs = Array(4);
    const cows = Array(2);
    const babycows = Array(2);
    const sheep = Array(4);
    for(let i = 0; i < 4; i++){
        geese[i] = animalFunc(document.querySelectorAll(".geese>li")[i],ANI_MOVE_PX);
        geese[i].creatureMove(1200,700);
        pigs[i] = animalFunc(document.querySelectorAll(".pigs>li")[i],ANI_MOVE_PX);
        pigs[i].creatureMove(800,700);
        sheep[i] = animalFunc(document.querySelectorAll(".sheep>li")[i],ANI_MOVE_PX);
        sheep[i].creatureMove(800,700);
    }
    for(let i = 0; i < 2; i++){
        cows[i] = animalFunc(document.querySelectorAll(".cows>li")[i],ANI_MOVE_PX);
        cows[i].creatureMove(800,700);
        babycows[i] = animalFunc(document.querySelectorAll(".babycows>li")[i],ANI_MOVE_PX);
        babycows[i].creatureMove(800,700);
    }
    const touch = touchFunc();
    const egg = eggFunc();
    const ment = mentFunc();
    // -------------------- 변수 --------------------
    let screenWidth = window.innerWidth; // 스크린 너비
    let screenHeight = window.innerHeight; // 스크린 높이
    let focusX = screenWidth / 2 - CHAR.offsetLeft - (CHAR_WIDTH / 2); // 초점 X값(음수)
    let focusY = screenHeight / 2 - CHAR.offsetTop - (CHAR_HEIGHT / 2); //초점 Y값(음수)
    
    // --------------------제한구역 이미지 설정--------------------
    let limitImg = document.getElementById('limit_img');
    let limitCanvas = document.createElement("canvas");
    // limitImg.crossOrigin = "anonymous";
    limitCanvas.width = limitImg.width;
    limitCanvas.height = limitImg.height;
    limitCanvas.getContext('2d').drawImage(limitImg,0,0,limitImg.width,limitImg.height);

    // --------------------이벤트 리스너 함수들--------------------
    const moveKey1 = ["arrowup","arrowleft","arrowdown","arrowright"];
    const moveKey2 = ["w","a","s","d"];
    const activeKey = [" ","f"];
    const keydown = function (e) {
        const mk1 = moveKey1.indexOf(e.key.toLowerCase());
        const mk2 = moveKey2.indexOf(e.key.toLowerCase());
        const ac = activeKey.indexOf(e.key.toLowerCase());
        if(ac !== -1){
            e.preventDefault();
            if(!key.active()){
                egg.eggActive(CHAR.offsetLeft,CHAR.offsetTop);
                goose.gooseActive(CHAR.offsetLeft,CHAR.offsetTop);
                key.activeTrue();
            }
        }
        if(key.move(mk1) === false){
            key.presskey(mk1);
        } else if(key.move(mk2) === false){
            key.presskey(mk2);
        }
        (key.flag()) ? false : key.setKeyTimer(keyDown,0);
    }
    const keyup = function (e) {
        const mk1 = moveKey1.indexOf(e.key.toLowerCase());
        const mk2 = moveKey2.indexOf(e.key.toLowerCase());
        const ac = activeKey.indexOf(e.key.toLowerCase());
        if(ac !== -1){
            key.activeFalse();
        }
        if(key.move(mk1) === true){
            key.removeKey(mk1);
        } else if(key.move(mk2) === true){
            key.removeKey(mk2);
        }
        if(!key.keyCode()) {
            if(CHAR.getAttribute("class") ? CHAR.getAttribute("class").indexOf("__") === -1 : false){CHAR.setAttribute("class", "_" + CHAR.getAttribute("class"));}
            key.reset();
            key.flagFalse();
        }
    }
    const clickActive = function(){
        egg.eggActive(CHAR.offsetLeft,CHAR.offsetTop);
        goose.gooseActive(CHAR.offsetLeft,CHAR.offsetTop);
    }
    const touchstart = function (e) {
        if(e.target === ctrlActive){
            egg.eggActive(CHAR.offsetLeft,CHAR.offsetTop);
            goose.gooseActive(CHAR.offsetLeft,CHAR.offsetTop);
        }
        else if(ElementIndex(EGGS.children,e.target)){
            egg.eggActive(CHAR.offsetLeft,CHAR.offsetTop);
            goose.gooseActive(CHAR.offsetLeft,CHAR.offsetTop);
            
        }
        else if(!touch.getFlag()){
            touch.setFlag(true);
            ctrlTouch.classList.add("on");
            ctrlTouch.style.left = e.targetTouches[0].clientX - 15 + "px";
            ctrlTouch.style.top = e.targetTouches[0].clientY - 15 + "px";
            touch.setTouch(e.targetTouches[0].clientX,e.targetTouches[0].clientY,e.targetTouches[0].identifier);
        }
    }
    const tocuhmove = function(e){
        if(e.cancelable) e.preventDefault();
        let {x,y,id} = touch.getTouch();
        if(e.targetTouches[0].identifier === id){
            let _x = e.targetTouches[0].clientX - x;
            let _y = e.targetTouches[0].clientY - y;
            let dir = {x : Math.cos(Math.atan2(_y,_x)), y : Math.sin(Math.atan2(_y,_x)), deg : Math.atan2(_y,_x) * 180 / Math.PI};
            touch.setMoveInfo(dir);
            if(!touch.getTouching()){
                touch.move();
                touch.setTouching(true);
            }
        }
    }
    const touchend = function (e) {
        if(e.touches.length === 0){
            ctrlTouch.children[0].style.left = 0;
            ctrlTouch.children[0].style.top = 0;
            if(CHAR.getAttribute("class") ? CHAR.getAttribute("class").indexOf("__") === -1 : false){CHAR.setAttribute("class", "_" + CHAR.getAttribute("class"));}
            touch.stop();
            touch.setFlag(false);
            touch.setTouch(0,0,null);
            ctrlTouch.classList.remove("on");
            touch.setTouching(false);
        } else if(e.touches[0].identifier !== id){
            ctrlTouch.children[0].style.left = 0;
            ctrlTouch.children[0].style.top = 0;
            if(CHAR.getAttribute("class") ? CHAR.getAttribute("class").indexOf("__") === -1 : false){CHAR.setAttribute("class", "_" + CHAR.getAttribute("class"));}
            touch.stop();
            touch.setFlag(false);
            touch.setTouch(0,0,null);
            ctrlTouch.classList.remove("on");
            touch.setTouching(false);
        }
    }
    // --------------------로딩중...--------------------
    main();
    function main(){
        for(let i = 0; i < 43; i++){ // 나무 생성
            let tree = document.createElement("ul");
            for(let j = 0; j < 3; j++){
                let fruits = document.createElement("li");
                tree.appendChild(fruits);
            }
            tree.setAttribute("class","tree");
            switch (Math.floor(Math.random()*6)) { // 과일 랜덤 생성
                case 0:
                    tree.classList.add("apple");
                    break;
                case 1:
                    tree.classList.add("blueberry");
                    break;
                case 2:
                    tree.classList.add("lemon");
                    break;
                case 3:
                    tree.classList.add("orange");
                    break;
                case 4:
                    tree.classList.add("peach");
                    break;
                default: // 그냥 나무
                    break;
            } 
            TREE.appendChild(tree);
        }
        const mapImg = document.createElement("img"); // 메인 배경
        mapImg.setAttribute("src", "./img/map.png");
        mapImg.setAttribute("alt", "배경 이미지");
        mapImg.setAttribute("id", "mapImg");
        MAP.appendChild(mapImg);
        // MAP.style.transformOrigin = -focusX + "px " + -focusY + "px";
        mapImg.onload = function(){ // --------------------------------------------------------------로딩완료
            document.querySelector("#load>span").classList.add("on");
            loadSection.classList.add("on");
            document.querySelector("#load>section .start").addEventListener("click",load);
            document.querySelector("#load>section .cheat").addEventListener("click",cheatMod);
        }
    }
    function cheatMod(){
        goose.cheat();
        goose.end();
        GOOSE.classList.add("click");
        loadSection.classList.remove("on");
        loadSection.classList.add("off");
        let ratioW = screenWidth / MAP_WIDTH
        MAP.style.animation = "load" + parseInt((ratioW) * 100 + 1) + "Ani 2500ms ease";
        document.getElementById("load").classList.add("load");
        let aniTime = setTimeout(function(){
            MAP.style.transition = "1s";
            screenFocus();
        },1500);
        let loadTime = setTimeout(function(){
            egg.cheatEeg();
            afterLoad(); //로딩이 끝난 뒤 호출
            MAP.style.transition = "none";
            clearTimeout(aniTime);
            clearTimeout(loadTime);;
        },2000);
    }
    function load(){
        explain(); // x를 누르면 afterLoad();호출
        loadSection.classList.remove("on");
        loadSection.classList.add("off");
        let ratioW = screenWidth / MAP_WIDTH
        MAP.style.animation = "load" + parseInt((ratioW) * 100 + 1) + "Ani 5s ease";
        document.getElementById("load").classList.add("load");
        let aniTime = setTimeout(function(){
            MAP.style.transition = "2s";
            screenFocus();
        },3000);
        let loadTime = setTimeout(function(){
            MAP.style.transition = "none";
            clearTimeout(aniTime);
            clearTimeout(loadTime);
        },5000);
    }
    function afterLoad(){ //-----------------------------------------------------------로딩 완료까지 호출 x

        document.addEventListener("keydown",keydown,false);
        document.addEventListener("keyup", keyup,false);
        ctrlActive.addEventListener("click",clickActive,false);
        
        document.addEventListener("touchstart",touchstart,false);
        document.addEventListener("touchmove",tocuhmove,false);
        document.addEventListener("touchend",touchend,false);
        document.addEventListener("touchcancel",touchend,false);

    }

    function isEntryPossible(x,y){ // 이동 가능구역인지 확인
        if(x > CHAR_WIDTH / 2 && x < MAP_WIDTH - CHAR_WIDTH / 2 && y > CHAR_HEIGHT && y < MAP_HEIGHT){

            return !(limitCanvas.getContext('2d').getImageData(x,y,1,1).data[3])
        }else return false
    }
    window.addEventListener("resize", function(){ // 창 크기 변경시 
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        screenFocus();
    });
    function keyFuncs(){ // 키보드 관련 클로져
        let move = [false,false,false,false];
        let keycode = 0;
        let active = false;
        let keyFlag = false;
        let keyTimer = null;
        return {
            presskey : function(index){
                move[index] = true;
                move[index > 1 ? index - 2 : index + 2] = false;
            },
            removeKey : function(index){
                move[index] = false;
            },
            keyCode : function(){
                    keycode = 0;
                    for(let i = 0; i < 4; i++){
                        if(move[i]){keycode += Math.pow(2,i)}
                    }
                    return keycode;
                /*  up => 1             down => 4
                    left => 2           right => 8
                    left up => 3        right up => 9
                    left down => 6      right down => 12    */
            },
            move : function(index){ return index === -1 ? -1 : move[index] },
            length : function(){return moveKeyCodes.length},
            flag : function(){return keyFlag},
            flagFalse : function(){keyFlag = false; 
                return keyFlag},
            flagTrue : function(){keyFlag = true; 
                return keyFlag},
            active : function(){return active},
            activeFalse : function(){active = false; 
                return active},
            activeTrue : function(){active = true; 
                return active},
            setKeyTimer: function(func,time){
                keyTimer = setTimeout(func,time);
            },
            reset : function(){
                move = [false,false,false,false];
                clearTimeout(keyTimer);
            }
        }
    }
    function moveFuncs(){ // 움직임 관련 클로져
        let moveX = CHAR.offsetLeft;
        let moveY = CHAR.offsetTop;
        return{
            moveTo : function(x,y){ // x,y만큼 이동
                let isBlock = true;
                let count = 0;
                if(x&&isEntryPossible(moveX + CHAR_WIDTH / 2 + x,moveY +  CHAR_HEIGHT)){
                    moveX += x;
                    CHAR.style.left = moveX + "px";
                    isBlock = false;
                }
                if(y&&isEntryPossible(moveX + CHAR_WIDTH / 2,moveY +  CHAR_HEIGHT + y)){
                    moveY += y;
                    CHAR.style.top = moveY + "px";
                    CHAR.style.zIndex = parseInt(moveY + CHAR_HEIGHT / 3);
                    isBlock = false;
                }
                while (isBlock && count < 5) { // 막힐 때 부드러운 움직임
                    count += 2;
                    isBlock = this.moveSmooth(x,y,count);
                } 
                screenFocus();
                goose.sensor(moveX,moveY); //거위센서 온
            },
            moveSmooth : function(x,y,count){ // 방해물에 막혔을 때 
                let dir = [];
                if(x === 0){
                    dir.push(isEntryPossible(moveX + CHAR_WIDTH / 2 - CHAR_CROSS_PX * count,moveY +  CHAR_HEIGHT + y));
                    dir.push(isEntryPossible(moveX + CHAR_WIDTH / 2 + CHAR_CROSS_PX * count,moveY +  CHAR_HEIGHT + y));
                    if(dir[0]^dir[1]){
                        x = dir[0] ? -CHAR_CROSS_PX : CHAR_CROSS_PX;
                        y = y > 0 ? CHAR_CROSS_PX : -CHAR_CROSS_PX;
                        this.moveTo(x,y);
                        return false;
                    }
                } else if(y === 0){
                    dir.push(isEntryPossible(moveX + CHAR_WIDTH / 2 + x, moveY +  CHAR_HEIGHT - CHAR_CROSS_PX * count));
                    dir.push(isEntryPossible(moveX + CHAR_WIDTH / 2 + x, moveY +  CHAR_HEIGHT + CHAR_CROSS_PX * count));
                    if(dir[0]^dir[1]){
                        y = dir[0] ? -CHAR_CROSS_PX : CHAR_CROSS_PX;
                        x = x > 0 ? CHAR_CROSS_PX : -CHAR_CROSS_PX;
                        this.moveTo(x,y)
                        return false;
                    }
                } else{
                    dir.push(isEntryPossible(moveX + CHAR_WIDTH / 2 - x * count, moveY + CHAR_HEIGHT + y * count));
                    dir.push(isEntryPossible(moveX + CHAR_WIDTH / 2 + x * count, moveY + CHAR_HEIGHT - y * count));
                    if(dir[0]^dir[1]){
                        if(dir[0]){
                            this.moveTo(-x,y);
                            return false;
                        } else{
                            this.moveTo(x,-y);
                            return false;
                        }
                    }
                } return true;
            }
        }
    }
    function animalFunc(animalElement,ANI_MOVE_PX){ // 동물 동작 클로져
        const senserLength = 300;
        let posX = animalElement.offsetLeft;
        let posY = animalElement.offsetTop;
        let posBox = [posX - senserLength,posX + senserLength, posY - senserLength, posY + senserLength];
        let gooseLevel = 0;
        let isMoving = false;
        let isEnd = false;
        return{
            moveTo : function(x,y,fly){ // 좌표로 이동
                isMoving = true;
                posX = animalElement.offsetLeft;
                posY = animalElement.offsetTop;
                let speedX = Math.cos(Math.atan2((y - posY),(x - posX)))*ANI_MOVE_PX;
                let speedY = Math.sin(Math.atan2((y - posY),(x - posX)))*ANI_MOVE_PX;
                let moveTimes = (x - posX)/speedX;
                let deg = Math.atan2((y - posY),(x - posX))*180 / Math.PI;
                let count = 0;
                let timer = setTimeout(movement, 0);
                if(deg + 180 >= 45 && deg + 180 < 135){
                    animalElement.setAttribute("class","back");
                } else if(deg + 180 >= 135 && deg + 180 < 225){
                    animalElement.setAttribute("class","right");
                } else if(deg + 180 >= 225 && deg + 180 < 315){
                    animalElement.setAttribute("class","front");
                } else {
                    animalElement.setAttribute("class","left");
                }
                if(fly){animalElement.classList.add("fly");}
                function movement(){
                    posX = animalElement.offsetLeft;
                    posY = animalElement.offsetTop;
                    speedX = Math.cos(Math.atan2((y - posY),(x - posX)))*ANI_MOVE_PX;
                    speedY = Math.sin(Math.atan2((y - posY),(x - posX)))*ANI_MOVE_PX;
                    count++
                    animalElement.style.left = (speedX + animalElement.offsetLeft)+ "px";
                    animalElement.style.top = (speedY + animalElement.offsetTop) + "px";
                    animalElement.style.zIndex = parseInt(y) + 10;
                    if(count < Math.ceil(moveTimes)){timer = setTimeout(movement, 1000 / GOOSE_MOVE_FPS);}
                    else{
                        isMoving = false;
                        clearTimeout(timer);
                        animalElement.classList.remove("fly");
                        animalElement.setAttribute("class", "_"+animalElement.getAttribute("class"));
                    };
                }
                return true
            },
            sensor : function(x,y){ // 거위근처로 갔나?
                posX = animalElement.offsetLeft;
                posY = animalElement.offsetTop;
                posBox = [posX - senserLength,posX + senserLength, posY - senserLength, posY + senserLength];
                if( posBox[0] < x && posBox[1] > x && posBox[2] < y && posBox[3] > y && !isMoving){
                    this.level();
                    return true;
                } else return false;
            },
            level : function(){ // 거위 근처로 가면 순서대로 작동
                switch (gooseLevel){
                    case  0 : //스타트
                        this.moveTo(1100,700,true);
                        startMent1();
                        function startMent1(){
                            CHAR.setAttribute("class","__8");
                            let setTime = setTimeout(ment.ex,1300);
                            setTime = setTimeout(ment.ment1,2500);
                            setTime = setTimeout(function(){
                                ment.move();
                                clearTimeout(setTime);
                            },5000);
                        }
                        break;
                    case  1 : //스타트 -> 다리 앞
                        this.moveTo(1250,1300,false);
                        egg.fieldGen(animalElement.offsetLeft + 51,animalElement.offsetTop + 84,1);
                        startMent2();
                        function startMent2(){
                            ment.ex();
                            let setTime = setTimeout(ment.ment2,1200);
                            setTime = setTimeout(ment.get,3500);
                            setTime = setTimeout(function(){clearTimeout(setTime)},3600);
                        }
                        break;
                    case  2 : //다리 건너기
                        this.moveTo(1250,2000,false);
                        break;
                    case  3 : //다리에서 밭1
                        this.moveTo(500,2500,false);
                        break;
                    case  4 : //밭1에서 밭3
                        egg.fieldGen(animalElement.offsetLeft + 51,animalElement.offsetTop + 84,2);
                        this.moveTo(500,3500,false);
                        break;
                    case  5 : //밭3에서 호수 앞
                        this .moveTo(1100,4500,false);
                        break;
                    case  6 : //호수 다리 위
                        this.moveTo(2900,4280,false);
                        break;
                    case  7 : //호수 건너기
                        this.moveTo(4500,4600,false);
                        egg.fieldGen(animalElement.offsetLeft + 51,animalElement.offsetTop + 84,3);
                        break;
                    case  8 : //강 다리 2 앞
                        this.moveTo(5000,4000,false);
                        break;
                    case  9 : //강 다리 2 건너기
                        this.moveTo(5000,3000,true);
                        break;
                    case  10 : //돼지우리 건너
                        this.moveTo(5700,2600,true);
                        break;
                    case  11 : //외양간 건너
                        this.moveTo(5300,1900,true);
                        egg.fieldGen(animalElement.offsetLeft + 51,animalElement.offsetTop + 84,4);
                        break;
                    case  12 : //숲 속 진입
                        this.moveTo(4500,1500,false);
                        break;
                    case  13 : //더 깊은 곳으로
                        this.moveTo(3800,1200,false);
                        egg.fieldGen(animalElement.offsetLeft + 51,animalElement.offsetTop + 84,5);
                        break;
                    case  14 : //엔딩 포인트
                        this.moveTo(5000,500,true);
                        break;
                    case 15 :
                        this.end();
                        startMent3();
                        function startMent3(){
                            ment.ment4();
                            let setTime = setTimeout(function(){
                                ment.get();
                                clearTimeout(setTime);
                            },2500);
                        }
                        break;
                    default : break;
                }
                gooseLevel++;
            },
            end : function () {
                gooseLevel = 16;
                let that = this;
                animalElement.classList.add("click");
                animalElement.addEventListener("click",function() {
                    that.gooseActive(animalElement.offsetLeft,animalElement.offsetTop);
                },false);   
                isEnd = true;
            },
            cheat: function(){
                this.moveTo(1100,700,true);
            },
            gooseActive : function (x,y) {
                if(isEnd){
                    let box = [animalElement.offsetLeft - CHAR.offsetWidth, animalElement.offsetLeft + animalElement.offsetWidth, animalElement.offsetTop - CHAR.offsetHeight, animalElement.offsetTop + animalElement.offsetHeight]
                    if(x > box[0] && x < box[1] && y > box[2] && y < box[3]){
                        ending();
                        if(ment.getGet()){ment.mentEnd();}
                        document.getElementById("load").classList.remove("load");
                        document.removeEventListener("keydown",keydown);
                        document.removeEventListener("keyup", keyup);
                        document.removeEventListener("touchstart",touchstart);
                        document.removeEventListener("touchmove",tocuhmove);
                        document.removeEventListener("touchend",touchend);
                        document.removeEventListener("touchcancel",touchend);
                        ctrlActive.removeEventListener("click",clickActive);
                        MAP.style.animation = "end" + parseInt((screenWidth / MAP_WIDTH) * 100 + 1) + "Ani 3000ms ease";
                    }
                }
            },
            creatureMove : function(w,h){
                let moveTimer = null;
                let that = this;
                moveTimer = setTimeout(moveRand,0);
                async function moveRand(){
                    let isMove = false;
                    let randX = Math.floor(Math.random()*(w - 400)) + 200;
                    let randY = Math.floor(Math.random()*(h - 400)) + 200;
                    let randT = Math.floor(Math.random()*3000) + 2000;
                    isMove = await that.moveTo(randX,randY,false);
                    if(isMove){
                        moveTimer = setTimeout(moveRand,randT);
                    }
                }
            }
        }
    }
    function eggFunc(){
        let eggs = [ // @6 알 정보들
            {
                id : 1, // 알순서
                title : "웹 표준, 접근성, 호환성 준수 새창에서 열기", // 알에 마우스 호버했 때 나오는 문구
                text : "Samsung E.M.", //알에 적힐 글씨
                url : "http://sujin0594.dothome.co.kr/ss/" // 알이랑 연결될 주소
            },
            {
                id : 2,
                title : "반응형 웹 마크업 &amp; 코딩 새창에서 열기",
                text : "CJ One",
                url : "http://sujin0594.dothome.co.kr/cjone/"
            },
            {
                id : 3,
                title : "반응형 웹 디자인 새창에서 열기",
                text : "BOBBI BROWN",
                url : "http://sujin0594.dothome.co.kr/bb/"
            },
            {
                id : 4,
                title : "웹앱 디자인 &amp; 코딩 새창에서 열기",
                text : "MOMO",
                url : "http://sujin0594.dothome.co.kr/app/"
            },
            {
                id : 5,
                title : "React웹앱 코딩 새창에서 열기",
                text : "KaKao",
                url : "https://sujin94k05.github.io/movie_app/"
            }
        ]
        function plateGen($id){
            let newEgg = document.createElement("a");
            newEgg.classList.add("goldenEgg");
            newEgg.classList.add("egg"+eggs[$id - 1].$id);
            newEgg.classList.add("blink");
            newEgg.setAttribute("href",eggs[$id - 1].url);
            newEgg.setAttribute("target","_blank");
            newEgg.setAttribute("rel","noreferrer noopener");
            newEgg.setAttribute("title",eggs[$id - 1].title);
            newEgg.textContent = eggs[$id - 1].text;
            if(eggPlate.children[$id - 1].childElementCount === 0){
                eggPlate.children[$id - 1].appendChild(newEgg);
            } else {newEgg.remove()}
            newEgg.addEventListener("click",function(){newEgg.classList.remove("blink");},false);
        }
        return{
            fieldGen : function(x,y,id){
                let newEgg = document.createElement("button");
                newEgg.classList.add("goldenEgg");
                newEgg.classList.add("egg" + eggs[id - 1].id);
                newEgg.setAttribute("type","button");
                newEgg.style.left = x + "px";
                newEgg.style.top = y + "px";
                newEgg.style.zIndex = y;
                if(id === 3) {newEgg.style.zIndex = 6000;}
                newEgg.addEventListener("click",function(){
                    let show = setTimeout(function(){
                        plateGen(id);
                        clearTimeout(show);
                    },1000); 
                    newEgg.classList.add("disapear");
                });
                EGGS.appendChild(newEgg);
            },
            eggActive : function(x,y){
                const eggs = EGGS.children;
                for(let i = 0; i < eggs.length; i++){
                    let box = [eggs[i].offsetLeft - CHAR.offsetWidth, eggs[i].offsetLeft + eggs[i].offsetWidth, eggs[i].offsetTop - CHAR.offsetHeight, eggs[i].offsetTop + eggs[i].offsetHeight]
                    if(x > box[0] && x < box[1] && y > box[2] && y < box[3]){
                        let id = eggs[i].getAttribute("class").replace(/[^0-9]/g,"");
                        let show = setTimeout(function(){
                            plateGen(id);
                            clearTimeout(show);
                        },1500); 
                        eggs[i].classList.add("disapear");
                        if(ment.getGet()){ment.ment3();}
                    }
                }
            },
            cheatEeg : function(){
                for(let i = 1; i <= 5; i++){
                    plateGen(i);
                }
            }
        }
    }
    function keyDown(){ // 키가 눌리면 setTimeOut 루프 시작
        key.flagTrue();
        switch (key.keyCode()) {
            case 1: //up
                move.moveTo(0,-CHAR_MOVE_PX);
                break;
            case 2: //left
                move.moveTo(-CHAR_MOVE_PX,0);
                break;
            case 4: //down
                move.moveTo(0,CHAR_MOVE_PX);
                break;
            case 8: //right
                move.moveTo(CHAR_MOVE_PX,0);
                break;
            case 3: //left up
                move.moveTo(-CHAR_CROSS_PX,-CHAR_CROSS_PX);
                break;
            case 9: //right up
                move.moveTo(CHAR_CROSS_PX,-CHAR_CROSS_PX);
                break;
            case 6: //left down
                move.moveTo(-CHAR_CROSS_PX,CHAR_CROSS_PX);
                break;
            case 12: //right down
                move.moveTo(CHAR_CROSS_PX,CHAR_CROSS_PX);
                break;
            case 0:
                return false;
        }
        function setDir(key){
            CHAR.setAttribute("class","");
            CHAR.classList.add("_"+key);
        }
        setDir(key.keyCode());
        key.setKeyTimer(keyDown,1000/CHAR_MOVE_FPS);
    }
    function touchFunc(){ //터치관련 클로저
        let touchId = null;
        let x = 0;
        let y = 0;
        let touchStart = false;
        let moveTimeout = null;
        let isTouching = false;
        let moveInfo ={ x : 0, y : 0, deg : 0};
        return{
            setFlag : function(set){touchStart = set;},
            getFlag : function(){return touchStart},
            setTouching : function(set){isTouching = set;},
            getTouching : function(){return isTouching},
            setTouch : function(_x,_y,id){x = _x; y = _y; touchId = id;},
            getTouch : function(){return {x: x, y: y, id : touchId}},
            setMoveInfo : function({x,y,deg}){
                moveInfo.x = x;
                moveInfo.y = y;
                moveInfo.deg = deg;
            },
            move : function(){
                clearTimeout(moveTimeout);
                moveTimeout = setTimeout(repeatMove,0);
                function repeatMove(){
                    move.moveTo(moveInfo.x*CHAR_MOVE_PX,moveInfo.y*CHAR_MOVE_PX);
                    ctrlTouch.children[0].style.left = moveInfo.x*20 + "px";
                    ctrlTouch.children[0].style.top = moveInfo.y*20 + "px";
                    moveTimeout = setTimeout(repeatMove,1000 / CHAR_MOVE_FPS);
                    if(moveInfo.deg + 180 >= 45 && moveInfo.deg + 180 < 135){
                        CHAR.setAttribute("class","_1");
                    } else if(moveInfo.deg + 180 >= 135 && moveInfo.deg + 180 < 225){
                        CHAR.setAttribute("class","_8");
                    } else if(moveInfo.deg + 180 >= 225 && moveInfo.deg + 180 < 315){
                        CHAR.setAttribute("class","_4");
                    } else {
                        CHAR.setAttribute("class","_2");
                    }
                }
            },
            stop : function(){
                clearTimeout(moveTimeout);
            }
        }
    }
    function screenFocus(){ // 캐릭터에 초점을 맞춰 이동(맵 끝으로 가면 고정)
        focusX = screenWidth / 2 - CHAR.offsetLeft * MAP_RATIO - (CHAR_WIDTH / 2);
        focusY = screenHeight / 2 - CHAR.offsetTop * MAP_RATIO - (CHAR_HEIGHT / 2);
        focusX = focusX >= 0 ? 0 : focusX <= screenWidth - MAP_WIDTH * MAP_RATIO ? MAP.offsetLeft : focusX;
        focusY = focusY >= 0 ? 0 : focusY <= screenHeight - MAP_HEIGHT * MAP_RATIO ? MAP.offsetTop : focusY;
        MAP.style.left = focusX  + "px";
        MAP.style.top = focusY + "px";
    }
    function ElementIndex(eles, ele){
        for(i in eles){
            if(eles[i] == ele){return i;}
        }
        return false
    }
    function explain(){
        explainDiv.setAttribute("class","explain on");
        explainDiv.getElementsByClassName("close")[0].addEventListener("click",function(){
            explainDiv.setAttribute("class","explain off");
            goose.level();
            afterLoad();
        },false);
    }
    function ending(){
        endingSection.classList.add("on"); 
            endingSection.getElementsByClassName("next")[0].addEventListener("click",function(){
            endingSection.setAttribute("class","ending on c");
        },false);
        endingSection.getElementsByClassName("prev")[0].addEventListener("click",function(){
            endingSection.setAttribute("class","ending on p");
        },false);
        endingSection.getElementsByClassName("close")[0].addEventListener("click",backToMap,false);
        endingSection.getElementsByClassName("close")[1].addEventListener("click",backToMap,false);
        function backToMap(){
            endingSection.setAttribute("class","ending");
            document.getElementById("load").classList.add("load");
            afterLoad();
        }

    }
    function mentFunc(){
        let mentTimer = null;
        let get = false;
        return{
            ment1 : function(){
                get = false;
                MENT.setAttribute("class","ment ment1");
                MENT.textContent = "거위가 도망쳤잖아!";
                mentTimer = setTimeout(function(){
                    MENT.setAttribute("class","ment");
                    MENT.textContent = "";
                    clearTimeout(mentTimer);
                },2000);
            },
            ment2 : function(){
                get = false;
                MENT.setAttribute("class","ment ment2");
                MENT.textContent = "황금알이다!!";
                mentTimer = setTimeout(function(){
                    MENT.setAttribute("class","ment");
                    MENT.textContent = "";
                    clearTimeout(mentTimer);
                },2000);
            },
            ment3 : function(){
                get = false;
                MENT.setAttribute("class","ment ment3");
                MENT.textContent = "알을 주워가며 계속 쫓아 가보자";
                mentTimer = setTimeout(function(){
                    MENT.setAttribute("class","ment");
                    MENT.textContent = "";
                    clearTimeout(mentTimer);
                    get = false;
                },2000);
            },
            ment4 : function(){
                get = false;
                MENT.setAttribute("class","ment ment1");
                MENT.textContent = "드디어 잡았다!!!";
                mentTimer = setTimeout(function(){
                    MENT.setAttribute("class","ment");
                    MENT.textContent = "";
                    clearTimeout(mentTimer);
                },3000);
            },
            ex : function(){
                get = false;
                MENT.textContent = "";
                MENT.setAttribute("class","ment ex");
                mentTimer = setTimeout(function(){
                    MENT.setAttribute("class","ment");
                    clearTimeout(mentTimer);
            },1000);
            },
            get : function(){
                MENT.textContent = "";
                MENT.setAttribute("class","ment get");
                get = true;
            },
            move : function(){
                get = false;
                MENT.textContent = "";
                MENT.setAttribute("class","ment move");
                right = true;
            },
            mentEnd : function(){
                get = false;
                MENT.textContent = "";
                MENT.setAttribute("class","ment");
            },
            getGet :function(){return get;}
        }
    }
    skillGraph();
    function skillGraph(){
        let timer = setTimeout(function(){
            const status = document.querySelectorAll(".skill .status");
            for(let i = 0; i < 6; i++){
                let statW = status[i].textContent;
                status[i].style.width = statW - 5 + "%";
            }
            clearTimeout(timer);
        },4300);
    }
}