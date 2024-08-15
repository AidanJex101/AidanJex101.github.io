//Header stuff

let menu = document.querySelector("#menu");
let elements = document.querySelectorAll("header a");
let header = document.querySelector("header");
let clicked = false

menu.onclick = () => {
  if (clicked == false) {
    elements.forEach(element => {
      element.classList.add("menu-show")
      element.classList.remove("menu-hide")
    })
    clicked = true
  }
  else {
    elements.forEach(element => {
      element.classList.add("menu-hide")
      element.classList.remove("menu-show")
    })
    clicked = false
  }
  
}

window.addEventListener('load', function(){

  const canvas1 = document.getElementById('canvas1');
  const ctx1 = canvas1.getContext('2d');
  canvas1.width = window.innerWidth;
  canvas1.height = 500;

  const canvas2 = document.getElementById('canvas2');
  const ctx2 = canvas2.getContext('2d');
  canvas2.width = window.innerWidth;
  canvas2.height = 300;
  let fire = false
  let numClicks = 0
  let candlesButton = document.getElementById('cake-button')
  candlesButton.addEventListener('click', function() {
    animate2()
    
    if (numClicks % 2 == 0) {
      candlesButton.innerText = "Make a Wish"
      fire = true
    }
    else {
      fire = false
      candlesButton.innerText = "Light Candles"
    }
    numClicks += 1
  })

  


  class Particle {
    constructor(effect, x, y, color, name) {
      this.effect = effect;
      this.name = name
      if (name == "cake" && y > 100) {
        this.x = x
        this.y = y;
      }
      else {
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
      }

      this.randX = Math.random() * this.effect.width
      this.randY = Math.random() * this.effect.height
      
      this.originX = Math.floor(x);
      this.originY = Math.floor(y);
      this.color = color;
      this.size = this.effect.gap;
      this.vx = 0;
      this.vy = 0;
      this.ease = 0.05;
    }  
    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }

    fusion() {
      
      this.x += (this.originX - this.x) * this.ease;
      this.y += (this.originY - this.y) * this.ease;
    }

    explosion() {
      
      if (this.originY < 102) {
        this.x += (this.randX - this.x) * this.ease;
        this.y += (this.randY - this.y) * this.ease;
      }
      
    }

  }

  class Effect {
    constructor(width, height, image, name) {
      this.width = width;
      this.name = name;
      this.height = height;
      this.particleArray = []
      this.image = image;
      this.centerX = this.width * 0.5;
      this.centerY = this.height * 0.5;
      this.x = this.centerX - this.image.width * 0.5;
      this.y = this.centerY - this.image.height * 0.5;
      this.gap = 5;
    }
    init(context) {
      context.drawImage(this.image, this.x, this.y);
      const pixels = context.getImageData(0, 0, this.width, this.height).data;
      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3];
          const color = 'rgb(' + red + ',' + green + ',' + blue +  ')';

          if (alpha > 0) {
            this.particleArray.push(new Particle(this, x, y, color, this.name));
          }
          
        }
      }
    }

    draw(context) {
      this.particleArray.forEach(particle => particle.draw(context));
      
    }

    fusion() {
      this.particleArray.forEach(particle => particle.fusion());
    }

    explosion() {
      this.particleArray.forEach(particle => particle.explosion())
    }

  }

  const effect1 = new Effect(canvas1.width, canvas1.height, document.getElementById('baloons'), "baloons");
  effect1.init(ctx1);

  const effect2 = new Effect(canvas2.width, canvas2.height, document.getElementById('cake'), "cake");
  effect2.init(ctx2);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  effect2.draw(ctx2);

  function animate1() {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    effect1.draw(ctx1);
    effect1.fusion();
    window.requestAnimationFrame(animate1);
  }

  function animate2() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    effect2.draw(ctx2);
    if (fire == true) {
      effect2.fusion();
    }
    else {
      effect2.explosion()
    }
    
    window.requestAnimationFrame(animate2);
    
    
  }


  animate1();

})

