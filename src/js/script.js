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

AFRAME.registerComponent('open', {
    schema: {
        txt: {default:'default'}
    },        
    init: function () {
        var data = this.data;
        var el = this.el;        
        el.addEventListener('click', function () {            
            // Animation up
            this.setAttribute("animation__up", "property: position;to: 0 3 -2;dur: 1000")
            document.querySelector("#click-text").setAttribute("animation__down","property: position;from:-0.5 -1 -2;to:-0.5 -3 -2; dur: 1000")
            setTimeout(function() {
                // Set texture
                var char = localStorage.getItem("char")
                document.querySelector("#card").setAttribute("src", "src/Unlocked/"+char+".png")
                // Down Again
                document.querySelector("#card").setAttribute("animation__down_again","property: position;to: 0 0.3 -2;dur: 1000")
                // Show next btn
                document.querySelector("#next-btn").setAttribute("visible", "true")
                document.querySelector("#next-btn").setAttribute("animation__up","property: position;from:0 -3 -2; to: 0 -1 -2;dur: 1000")
            }, 3000);
            newCharacter()
        });        
    }
});

AFRAME.registerComponent('clickhandler', {
    schema: {
        txt: {default:'default'}
    },        
    init: function () {
        var data = this.data;
        var el = this.el;        
        el.addEventListener('click', function () {     
            var char = el.parentElement.getAttribute('id')
            localStorage.setItem("char", char)
            console.log(localStorage.getItem("char"))
            window.location.href = "#open";
        });        
    }
});


AFRAME.registerComponent('toabout', {
    schema: {
        txt: {default:'default'}
    },        
    init: function () {
        var data = this.data;
        var el = this.el;        
        el.addEventListener('click', function () {     
            localStorage.setItem("about", localStorage.getItem("char"))
            window.location.href = "#about";
        });        
    }
});