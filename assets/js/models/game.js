class Game {

    constructor(canvasId, introId) {
        this.canvas = document.getElementById(canvasId);
        this.intro = document.getElementById(introId);
        this.canvas.width = 1366;
        this.canvas.height = 768;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = "2.5em Rockwell";
        this.ctx.fillStyle = "#FFFFFF";

        this.fps = 1000 / 60;
        this.drawIntervalId = undefined;

        this.background = new Background(this.ctx);
        this.ada = new Ada(this.ctx, 15, 550);
    
        this.enemies = [];
        this.weapons = [];
        this.maxY = this.canvas.height - 140;
        this.minY = Math.floor(this.canvas.height / 1.7);
       
        this.shield = new Shield(this.ctx, 1240, 15);
        this.heart = new Heart(this.ctx, 25, 15);
        // this.comment = new Comment();
        this.points = 3;
        this.defendPoints = 0;
        //this.weapons = this.enemies.map(enemy => enemy.weapon);
    }


    start() {
        this.intro.style.display = "none";
        this.canvas.style.display = "block";
        if (!this.drawIntervalId) {
            
            setInterval(() => {
                let enemyId = Math.floor(Math.random() * 10) + 1;
                // let enemyY = Math.floor(Math.random() * this.maxY) + this.minY;
                let enemyY = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
                // enemyY = (enemyY > this.maxY)? this.maxY : enemyY;
                // console.log(enemyY," ", this.maxY);
                this.enemies.push(new Enemy(this.ctx, this.canvas.width -50, enemyY, 'enemy' + enemyId));
                this.weapons = this.enemies.map(enemy=>enemy.weapon).filter(weapon => weapon!=false);
            }, 3000);

            this.drawIntervalId = setInterval(() => {
                this.clear();
                this.move();
                this.draw();
                this.checkCollisions();
            }, this.fps);
            
        }
    }

    onKeyEvent(event) {
        this.ada.onKeyEvent(event);
        this.background.onKeyEvent(event);
        const status = event.type === 'keydown';
        switch (event.keyCode) {
            case KEY_START:
                this.start();
                break;
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ada.clear();
    }

    stop() {
        clearInterval(this.drawIntervalId);
        this.drawIntervalId = undefined;
    }

    startGame() {
        this.score = 0;
        //this.weapons = [];
        this.ada.x = 0;
        this.ada.y = 0;
        this.start();
    }

    draw() {
        this.background.draw();
        this.ada.draw();
        //this.weapons.forEach(weapon => weapon.draw());
        this.enemies.map(enemy => enemy.draw());
        this.setScore(this.points);
        if (this.points <= 0) {
            this.endGame();
        }
        this.setScoreDefend(this.defendPoints);
        this.heart.draw();
        this.shield.draw();
    }

    setScore(score) {
        this.ctx.save();
        this.ctx.fillText(score, 80, 50);
        this.ctx.restore();
    }

    setScoreDefend(score) {
        this.ctx.save();
        this.ctx.fillText(score, 1300, 50);
        this.ctx.restore();
    }

    move() {
        if (this.ada.x >= this.ada.maxX) {
            //this.weapons.forEach(weapon => weapon.move());
            this.background.move();
        }
        this.ada.move();
    }

    checkCollisions() {
        
        const restOfWeapons = this.weapons.filter(weapon => !this.ada.collidesWidth(weapon));
        const newPoints = this.weapons.length - restOfWeapons.length;
            
            if (this.ada.movements.defending) {
                this.defendPoints += newPoints;
            } else {
                this.points -= newPoints;
                
            }
        // Array(newPoints).fill().forEach(() => {
        //      this.sounds.weapon.currentTime = 0;
        //      this.sounds.weapon.play();
        //  })
            // console.log(restOfWeapons);
        this.weapons = restOfWeapons;
    }

    endGame() {
        clearInterval(this.drawIntervalId);
    }
}