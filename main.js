const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    pixelArt: true,
    zoom: 2,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let player, cursors, bullets, enemies, lastFired = 0, score = 0;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('background', 'assets/background.png');
}

function create() {
    this.add.image(160, 120, 'background').setScale(0.2);

    scoreText = this.add.text(10, 10, 'Score: 0', {
        fontSize: '12px',
        fill: '#ffffff'
    });

    player = this.physics.add.sprite(160, 200, 'player').setScale(0.05);
    cursors = this.input.keyboard.createCursorKeys();

    bullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, runChildUpdate: true });
    enemies = this.physics.add.group();

    for (let i = 0; i < 5; i++) {
        const enemy = enemies.create(
            Phaser.Math.Between(50, 270),
            Phaser.Math.Between(20, 100),
            'enemy'
        );
        enemy.setScale(0.03);
    }

    this.physics.add.overlap(bullets, enemies, (bullet, enemy) => {
        bullet.destroy();
        enemy.setPosition(
            Phaser.Math.Between(50, 270),
            Phaser.Math.Between(20, 100)
        );

        score += 1;
        scoreText.setText('Score: ' + score);
    });
}

function update(time) {
    player.setVelocity(0);

    player.x = this.input.activePointer.x;
    player.y = this.input.activePointer.y;

    if (this.input.activePointer.isDown && time > lastFired) {
        const bullet = bullets.get(player.x, player.y - 10, 'bullet');
        if (bullet) {
        bullet.setActive(true).setVisible(true);
        bullet.setScale(0.02);
        bullet.body.velocity.y = -200;
        lastFired = time + 300;
        }
    }
}