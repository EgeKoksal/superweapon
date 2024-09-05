class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 100;
    this.x = this.game.width * 0.5 - this.width * 0.5; // oyun yazarken nesnelerin ekrandaki yeri genelde x ve y ile belirtilir.
    this.y = this.game.height - this.height;
    this.speed = 5;
  }
  draw(context) {
    context.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    //yatay hareket
    if (this.game.keys.indexOf("ArrowLeft") > -1) this.x -= this.speed;
    if (this.game.keys.indexOf("ArrowRight") > -1) this.x += this.speed;
    //yatay sınırlar
    if (this.x < -this.width * 0.5) this.x = -this.width * 0.5;
    else if (this.x > this.game.width - this.width * 0.5)
      this.x = this.game.width - this.width * 0.5;
  }
  shoot() {
    const projectile = this.game.getProjectile();
    if (projectile) projectile.start(this.x + this.width * 0.5, this.y);
  }
}

class Projectile {
  constructor() {
    this.width = 8;
    this.height = 40;
    this.x = 0;
    this.y = 0;
    this.speed = 10;
    this.free = true;
  }
  draw(context) {
    if (!this.free) {
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  update() {
    if (!this.free) {
      this.y -= this.speed;
      if (this.y < -this.height) this.reset();
    }
  }
  start(x, y) {
    this.x = x;
    this.y = y;
    this.free = false;
  }
  reset() {
    this.free = true;
  }
}

class Enemy {}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.keys = [];
    this.player = new Player(this); // Player nesnesi oluşturuluyor ve oyuna ekleniyor.
    this.projectilesPool = [];
    this.NumberOfProjectiles = 10;
    this.createProjectiles();
    console.log(this.projectilesPool);

    //eventlisteners burada
    window.addEventListener("keydown", (e) => {
      if (this.keys.indexOf(e.key) === -1) this.keys.push(e.key);
      if (e.key === "1") this.player.shoot();
    });
    window.addEventListener("keyup", (e) => {
      const index = this.keys.indexOf(e.key);
      if (index > -1) this.keys.splice(index, 1);
    });
  }
  render(context) {
    this.player.draw(context); // Oyuncu çiziliyor.
    this.player.update(); // Oyuncunun konumu güncelleniyor.
    this.projectilesPool.forEach((projectile) => {
      projectile.update();
      projectile.draw(context);
    });
  }

  //projectile yaratımı
  createProjectiles() {
    for (let i = 0; i < this.NumberOfProjectiles; i++) {
      this.projectilesPool.push(new Projectile());
    }
  }
  // havuzdan projectile seçimi
  getProjectile() {
    for (let i = 0; i < this.projectilesPool.length; i++) {
      if (this.projectilesPool[i].free) return this.projectilesPool[i];
    }
  }
}

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d"); // 2D çizim bağlamı alınıyor.
  canvas.width = 600;
  canvas.height = 800;

  const game = new Game(canvas); // Game sınıfından bir oyun oluşturuluyor.

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Ekranı temizler (önceki çerçeveleri siler).
    game.render(ctx); // Oyunu çizip, güncelleme yapar.
    requestAnimationFrame(animate); // Bir sonraki animasyon karesi için tekrar çağrılır.
  }
  animate(); // Animasyon başlatılır.
});
