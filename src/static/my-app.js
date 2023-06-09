// Jika belum ada maka buat local storage 
if (localStorage.getItem("open") === null) {
  localStorage.setItem("open","[]")
}else if (localStorage.getItem("char") === null) {
  localStorage.setItem("char","")
}else if (localStorage.getItem("about") === null) {
  localStorage.setItem("about","")
}


let hooray = new Audio('src/audio/Hooray.mp3');
let whoosh = new Audio('src/audio/Whoosh.mp3');
let click = new Audio('src/audio/Click.mp3');
let boom = new Audio('src/audio/Boom.mp3');
boom.volume = 0.5;
// jika opened true maka ketika mengklik kartu tidak akan naik keatas lagi
let opened = false

const divs = document.querySelectorAll('.button');

function clickSound(){
  click.play()
}

function removeScript(){
  document.querySelectorAll(".mindar-ui-overlay").forEach(el => el.remove());
  document.querySelectorAll(".new-script").forEach(el => el.remove());
}

function executeScript(html) {
  // Hapus dulu script lama
  removeScript()
  var scriptTags = html.match(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi);
  if (scriptTags) {
    for (var i = 0; i < scriptTags.length; i++) {
      var scriptTag = document.createElement("script");
      scriptTag.text = scriptTags[i].replace("<script>", "").replace("</script>", "");
      scriptTag.setAttribute("class","new-script")
      document.body.appendChild(scriptTag);
    }
  }
}

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: true,
  },
  // Add default routes
  routes: [
    {
      path: '/',
      url: './menu.html',
      on: {
        pageInit: function (e, page) {
          executeScript(document.getElementById('menu').innerHTML)
        },
      }
    },{
      path: '/open/',
      url: './open.html',
      on: {
        pageInit: function (e, page) {
          executeScript(document.getElementById('open').innerHTML)
        },
      }
    }, {
      path: '/scan/',
      url: './scan.html',
      on: {
        pageInit: function (e, page) {
          executeScript(document.getElementById('scan').innerHTML)
        }
      }
    }, {
      path: '/about/',
      url: './about.html',
      on: {
        pageInit: function (e, page) {
          executeScript(document.getElementById('about').innerHTML)
        },
      }
    }, {
      path: '/heroes/',
      url: './heroes.html',
      on: {
        pageInit: function (e, page) {
          executeScript(document.getElementById('heroes').innerHTML)
        },
      }
    },
  ],
});



var viewMain = app.views.create('.view-main');

function newCharacter(){
  let open = JSON.parse(localStorage.getItem("open"))
  let char = localStorage.getItem("char")
  // Jika karakter belum ada maka tambahkan
  if(!open.includes(char)){   
    open.push(char)
    console.log(open.toString())
    localStorage.setItem("open",JSON.stringify(open))
    setTimeout(function(){
      app.toast.create({
        text: 'New hero unlocked',
        closeTimeout: 3000,
      }).open();  
    }, 3000)
  }
}


let endConfetti = 0;
function confettiEffect(){

  (function frame() {
  confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
  });

  confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
  });

  if (Date.now() < endConfetti) {
      requestAnimationFrame(frame);
  }
  })();
}

function home(){
  app.views.main.router.navigate("/about/");
}

function openCard(){
  if(!opened){
      // Animation up
      whoosh.play()
      // locked card up
      document.querySelector("#locked-card").setAttribute("animation__up", "property: position;to: 0 3 -2;dur: 1000")
      document.querySelector("#click-text").setAttribute("animation__down","property: position;from:-0.4 -1 -2;to:-0.4 -3 -2; dur: 1000")
      setTimeout(function() {
          // unlocked card down
          document.querySelector("#unlocked-card").setAttribute("animation__down","property: position;to: 0 0.3 -2;easing: easeInCubic;dur: 700")
          // Show next btn
          document.querySelector("#next-btn").setAttribute("visible", "true")
          document.querySelector("#next-btn").setAttribute("animation__up","property: position;from:0 -3 -2; to: 0 -1 -2;dur: 700")
          boom.play()
          setTimeout(function(){
              endConfetti = Date.now() + 7 * 1000
              confettiEffect()
              hooray.play()
          }, 1000)
      }, 3000);
      newCharacter()
  }
  opened = true
}




