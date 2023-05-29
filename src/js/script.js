function executeScript(html) {
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


// Membuat observer untuk memantau perubahan pada elemen dengan ID "myElement"
var myElement = document.getElementById('content');
var observer = new MutationObserver(function(mutationsList, observer) {
    // Melakukan tindakan yang diinginkan ketika terjadi perubahan pada elemen
    if(document.getElementById('heroes')){
        // Mengeksekusi script yang ada pada halaman heroes.html
        executeScript(document.getElementById('heroes').innerHTML)
    }else if(document.getElementById('about')){
        // Mengeksekusi script yang ada pada halaman about.html
        executeScript(document.getElementById('about').innerHTML)
    }else if(!document.getElementById('scan')){
        // Mengeksekusi script yang ada pada halaman about.html
        document.querySelectorAll(".mindar-ui-overlay").forEach(el => el.remove());
    }else{
        document.querySelectorAll(".new-script").forEach(el => el.remove());
    }
});

// Memulai pemantauan perubahan pada elemen "myElement"
observer.observe(myElement, { attributes: true, childList: true, subtree: true });

// Jika belum ada maka buat local storage 
if (localStorage.getItem("open") === null) {
    localStorage.setItem("open","[]")
}else if (localStorage.getItem("char") === null) {
    localStorage.setItem("char","")
}else if (localStorage.getItem("about") === null) {
    localStorage.setItem("about","")
}

function newCharacter(){
    var open = JSON.parse(localStorage.getItem("open"))
    var char = localStorage.getItem("char")
    // Jika karakter belum ada maka tambahkan
    if(!open.includes(char)){   
        open.push(char)
        console.log(open.toString())
        localStorage.setItem("open",JSON.stringify(open))
    }
}

function confettiEffect(){
    const end = Date.now() + 7 * 1000;

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

    if (Date.now() < end) {
        requestAnimationFrame(frame);
    }
    })();
}

var hooray = new Audio('src/audio/Hooray.mp3');
var whoosh = new Audio('src/audio/Whoosh.mp3');
var click = new Audio('src/audio/Click.mp3');
var boom = new Audio('src/audio/Boom.mp3');
boom.volume = 0.5;
var opened = false

function open(){
    if(!opened){
        // Animation up
        whoosh.play()
        document.querySelector("#open-card").setAttribute("animation__up", "property: position;to: 0 3 -2;dur: 1000")
        document.querySelector("#click-text").setAttribute("animation__down","property: position;from:-0.4 -1 -2;to:-0.4 -3 -2; dur: 1000")
        setTimeout(function() {
            // Set texture
            var char = localStorage.getItem("char")
            document.querySelector("#open-card").setAttribute("src", "src/unlocked/"+char+".png")
            // Down Again
            document.querySelector("#open-card").setAttribute("animation__down_again","property: position;to: 0 0.3 -2;easing: easeInCubic;dur: 700")
            // Show next btn
            document.querySelector("#next-btn").setAttribute("visible", "true")
            document.querySelector("#next-btn").setAttribute("animation__up","property: position;from:0 -3 -2; to: 0 -1 -2;dur: 700")
            boom.play()
            setTimeout(function(){
                confettiEffect()
                hooray.play()
            }, 1000)
        }, 3000);
        newCharacter()
    }
    opened = true
}

function ARcard(){
    var char = document.querySelector("#ar-card").parentElement.getAttribute('id')
    localStorage.setItem("char", char)
    console.log(localStorage.getItem("char"))
    window.location.href = "#open";
}

function next(){

}


AFRAME.registerComponent('clickhandler', {
    schema: {
        txt: {default:'default'}
    },        
    init: function () {
        var data = this.data;
        var el = this.el;        
        el.addEventListener('click', function () {     
            if(data.txt == "open-card"){
                open()
            }else if(data.txt == "ar-card"){
                ARcard()
            }else if(data.txt == "next-btn"){
                click.play()
                localStorage.setItem("about", localStorage.getItem("char"))
                window.location.href = "#about";
            }
        });        
    }
});

