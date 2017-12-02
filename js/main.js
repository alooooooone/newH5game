var Game = function() {
    var o = {
        WINDOW_WIDTH: 960,
        WINDOW_HEIGHT: 640,
        BALLRADIUS: 50,
        SPEED: 10,
        colors: ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"],
        balls: [],
        ballsNum: 1,
        angle: Math.PI,
        batteryX: 480,
        batteryY: 520,
        bulls: [],
        score: 0,
        bnum: 1,
        timer: null,
        fps: 1000/30,
    }
    o.init = function () {
        var game = $("#canvas1").getEle().getContext('2d');
        var bg_sky = $("#canvas2").getEle().getContext('2d');

        o.drawSky(bg_sky);
        o.createBall(o.ballsNum);

        o.timer = setInterval(
            function () {
                o.render(game);
                o.drawBattery(game);
                o.addScore();
                o.leavelup();
                o.judgeGameOver(game);
                o.updateBalls();
                o.updateBulls();
                log(o.balls)
            },
            o.fps
        );
        o.bindEvent()

    }

    o.drawSky = function(ctx) {
        var linearGradSky = ctx.createLinearGradient(0, 0, 0, 640);
        linearGradSky.addColorStop(0.0, "blue");
        linearGradSky.addColorStop(1.0, "#fff");
        ctx.fillStyle = linearGradSky;
        ctx.fillRect(0, 0, 960, 640);

        var linearGradLand = ctx.createLinearGradient(0, 0, 0, 640);
        linearGradLand.addColorStop(0.6, "	#9ACD32");
        linearGradLand.addColorStop(1.0, "green");
        ctx.fillStyle = linearGradLand;

        ctx.beginPath();
        ctx.moveTo(0, 440);
        ctx.bezierCurveTo(217, 99, 310, 503, 960, 420);
        ctx.lineTo(960, 640);
        ctx.lineTo(0, 640);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(480, 640, 120, 0, Math.PI, true);
        ctx.closePath();
        ctx.fill();

    }

    o.drawBattery = function(ctx) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(480, 580, 60, -(Math.PI - o.angle), -(Math.PI - o.angle + Math.PI), false);
        ctx.lineTo(o.batteryX, o.batteryY);
        ctx.closePath();
        ctx.fill();
    }

    o.createBall = function(num) {
        for (var i = 0; i < num; i++) {
            var BallR = o.createRandom(o.BALLRADIUS - 10) + 10;
            var ball = {
                x: o.createRandom(o.WINDOW_WIDTH),
                y: o.createRandom(o.WINDOW_HEIGHT / 2),
                r: BallR,
                score: o.BALLRADIUS - BallR + 1,
                vx: Math.pow(-1, parseInt(Math.random() * 1000)) * o.createRandom(o.SPEED),
                vy: Math.pow(-1, parseInt(Math.random() * 1000)) * o.createRandom(o.SPEED),
                color: o.colors[o.createRandom(o.colors.length)]
            };
            o.balls.push(ball);
        }
    }

    o.updateBalls = function() {
        for (var i = 0; i < o.balls.length; i++) {

            o.balls[i].x += o.balls[i].vx;
            o.balls[i].y += o.balls[i].vy;

            if (o.balls[i].y >= o.WINDOW_HEIGHT - o.balls[i].r) {
                o.balls[i].y = o.WINDOW_HEIGHT - o.balls[i].r;
                o.balls[i].vy = o.createRandom(o.SPEED) * -1;
            }
            if (o.balls[i].y < o.balls[i].r) {
                o.balls[i].y = o.balls[i].r;
                o.balls[i].vy = o.createRandom(o.SPEED);
            }
            if (o.balls[i].x >= o.WINDOW_WIDTH - o.balls[i].r) {
                o.balls[i].x = o.WINDOW_WIDTH - o.balls[i].r;
                o.balls[i].vx = o.createRandom(o.SPEED) * -1;
            }
            if (o.balls[i].x < o.balls[i].r) {
                o.balls[i].x = o.balls[i].r;
                o.balls[i].vx = o.createRandom(o.SPEED);
            }
        }
    }

    o.updateBulls = function() {
        for (var i = 0; i < o.bulls.length; i++) {

            o.bulls[i].x += o.bulls[i].vx;
            o.bulls[i].y += o.bulls[i].vy;

            if (o.bulls[i].y >= o.WINDOW_HEIGHT - o.bulls[i].r) {
                o.bulls.splice(i, 1);
            }
        }
    }

    o.addScore = function() {

        for (var i = 0; i < o.bulls.length; i++) {
            for (var j = 0; j < o.balls.length; j++) {
                var distance = Math.pow(o.bulls[i].x - o.balls[j].x, 2) +
                    Math.pow(o.bulls[i].y - o.balls[j].y, 2);
                var minDis = Math.pow(o.balls[j].r, 2) + 100;
                if (distance <= minDis) {
                    o.score += o.balls[j].score;
                    o.balls.splice(j, 1);
                }
            }
        }
    }

    o.judgeGameOver = function(ctx) {
        for (var i = 0; i < o.balls.length; i++) {
            var distance = Math.pow(480 - o.balls[i].x, 2) +
                Math.pow(640 - o.balls[i].y, 2);
            var minDis = Math.pow(o.balls[i].r + 120, 2);
            if (distance <= minDis) {
                ctx.font = "48px serif";
                ctx.fillText("GameOver", 40, 50);
                clearInterval(o.timer);
            }
        }
    }

    o.leavelup = function() {
        if (o.balls.length == 0) {
            o.SPEED++;
            o.createBall(o.ballsNum + o.bnum);
            o.bnum++;
        }
    }

    o.render = function(ctx) {

        ctx.clearRect(0, 0, o.WINDOW_WIDTH, o.WINDOW_HEIGHT);

        o.drawCircle(o.balls, ctx)
        o.drawCircle(o.bulls, ctx)

        ctx.font = "48px serif";
        ctx.fillText("score:" + o.score, 400, 50);
        ctx.fillText("第" + o.bnum + "关", 700, 50);
    }

    o.bindEvent = function() {
        $("#all_canvas").on("click", function(event) {
            var e = event || window.event;
            var windowX = e.pageX;
            var windowY = e.pageY;
            var all_canvas = document.getElementById('all_canvas');
            var canvasX = windowX - all_canvas.offsetLeft;
            var canvasY = windowY - all_canvas.offsetTop;
            var x = canvasX - 480;
            var y = canvasY - 640;
            o.angle = Math.atan(x / y);
            o.batteryY = 640 - Math.cos(o.angle) * 120;
            o.batteryX = 480 - Math.sin(o.angle) * 120;

            bull = {
                x: o.batteryX,
                y: o.batteryY,
                r: 10,
                vx: Math.floor(-Math.sin(o.angle) * 10),
                vy: Math.floor(-Math.cos(o.angle) * 10),
                color: "black"
            };
            o.bulls.push(bull);
        })
    }

    o.drawCircle = function(obj, ctx) {
        obj.forEach((ele, index) => {
            ctx.fillStyle = ele.color;
            ctx.beginPath();
            ctx.arc(ele.x, ele.y, ele.r, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.fill();
        })
    }

    o.createRandom = function(num) {
        return Math.floor(Math.random() * num)
    }

    o.getMinDis = function() {
        
    }

    o.getDis = function() {
        
    }

    return o
}

new Game().init()