document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
})


// Add on-click border effect to search bar
document.querySelector(".search-bar").addEventListener("click", (event) => {
    document.querySelector(".search-bar").style.border = "3px solid white";
    event.stopPropagation();
})

document.addEventListener("click", () => {
    document.querySelector(".search-bar").style.border = "none";
    document.querySelector(".create-playlist").classList.add("visible");
})


// Adding click features to the navbar
let collection = document.querySelector(".right-nav").getElementsByTagName("span");
collection[0].addEventListener("click", () => {
    window.open("https://www.spotify.com/in-en/premium/", "_self");
})

collection[1].addEventListener("click", () => {
    window.open("https://support.spotify.com/in-en/");
})

collection[2].addEventListener("click", () => {
    window.open("https://www.spotify.com/in-en/download/windows/");
})

document.querySelector(".installApp").addEventListener("click", () => {
    window.open("https://open.spotify.com/download", "_self");
})

document.querySelector(".signup-btn").addEventListener("click", () => {
    window.open("https://www.spotify.com/in-en/signup?forward_url=https%3A%2F%2Fopen.spotify.com%2F", "_self");
})

document.querySelector(".login-btn").addEventListener("click", () => {
    window.open("https://accounts.spotify.com/en-GB/login?continue=https%3A%2F%2Fopen.spotify.com%2F", "_self");
})


// Adding functionalities to the left container
document.querySelector(".plus").addEventListener("click", (event) => {
    document.querySelector(".create-playlist").classList.toggle("visible");
    event.stopPropagation();
})

document.querySelector(".create-playlist").addEventListener("click", (event) => {
    document.querySelector(".first-card").querySelector("button").classList.add("hover");
    setTimeout(() => {
        document.querySelector(".first-card").querySelector("button").classList.remove("hover");
    }, 1000);
})

document.querySelector(".first-card").querySelector("button").addEventListener("click", () => {
    window.open("https://accounts.spotify.com/en-GB/login?continue=https%3A%2F%2Fopen.spotify.com%2F", "_self");
})

document.querySelector(".second-card").querySelector("button").addEventListener("click", () => {
    window.open("https://open.spotify.com/genre/podcasts-web", "_self");
})


// Adding play music, play-pause, previous & next functionalities to the trending-songs slides
let audio = new Audio();
function playAudio(index) {
    trendingSongs[index].querySelector(".play-button").addEventListener("click", async (event) => {
        document.querySelector(".controls").querySelectorAll("img")[1].setAttribute("src", "assets/pause.svg");
        let str = trendingSongs[index].querySelector("p").innerText;
        document.querySelector(".song-name").innerText = str;
        str = str.replaceAll('"', "");
        str = str.replaceAll('(', "");
        str = str.replaceAll(')', "");
        let song = await fetch("http://127.0.0.1:5500/songs/" + str + ".mp3");
        audio.src = song.url;
        audio.play();

        // Adding pop up style to the music playbar
        document.querySelector(".playbar").style.bottom = "0";
        document.querySelector(".playbar").style.opacity = "1";

        audio.addEventListener("loadedmetadata", () => {
            let duration = "";
            let currentTime = "";
            duration = parseInt(audio.duration / 60) < 10 ? duration + "0" + parseInt(audio.duration / 60) : duration + parseInt(audio.duration / 60);
            duration = parseInt(audio.duration) % 60 < 10 ? duration + ":0" + parseInt(audio.duration) % 60 : duration + ":" + parseInt(audio.duration) % 60;
            document.querySelector(".duration").innerText = duration;

            audio.addEventListener("timeupdate", () => {
                currentTime = parseInt(audio.currentTime / 60) < 10 ? "0" + parseInt(audio.currentTime / 60) : parseInt(audio.currentTime / 60);
                currentTime = parseInt(audio.currentTime) % 60 < 10 ? currentTime + ":0" + parseInt(audio.currentTime) % 60 : currentTime + ":" + parseInt(audio.currentTime) % 60;
                document.querySelector(".currentTime").innerText = currentTime;
                document.querySelector(".circle").style.left = `${audio.currentTime / audio.duration * 100 - 1}%`;
            })

            document.querySelector(".seekbar").addEventListener("click", (event) => {
                let rect = document.querySelector(".seekbar").getBoundingClientRect();
                audio.currentTime = audio.duration * parseInt((event.clientX - parseInt(rect.left)) / parseInt(rect.width) * 100) / 100;
                document.querySelector(".circle").style.left = `${parseInt((event.clientX - parseInt(rect.left)) / parseInt(rect.width) * 100) - 1}%`;
            });
        })

        playPause(index);

        prev(index);

        next(index);

        document.querySelector(".volume-seekbar").addEventListener("click", (event) => {
            document.querySelector(".volume-circle").style.left = `${parseInt((event.clientX - parseInt(document.querySelector(".volume-seekbar").getBoundingClientRect().left)) / parseInt(document.querySelector(".volume-seekbar").getBoundingClientRect().width) * 100) - 1}%`;

            audio.volume = parseInt((event.clientX - parseInt(document.querySelector(".volume-seekbar").getBoundingClientRect().left)) / parseInt(document.querySelector(".volume-seekbar").getBoundingClientRect().width) * 100) / 100;
        })

        // Setting mute property of the music playbar
        let muteNode = document.createElement("img");
        if (audio.muted) {
            muteNode.src = "assets/mute.svg";
            document.querySelector(".volume-seekbar").style.display = "none";
        } else {
            muteNode.src = "assets/volume.svg";
            document.querySelector(".volume-seekbar").style.display = "block";
        }
        muteNode.setAttribute("width", "20px");
        muteNode.className = `mute${index}`;
        document.querySelector(".volume").querySelector("img").replaceWith(muteNode);
        document.querySelector(".volume").querySelector("img").addEventListener("click", (event) => {
            if (audio.muted) {
                document.querySelector(".volume").querySelector("img").src = "assets/volume.svg";
                audio.muted = false;
                document.querySelector(".volume-seekbar").style.display = "block";
            } else {
                document.querySelector(".volume").querySelector("img").src = "assets/mute.svg";
                audio.muted = true;
                document.querySelector(".volume-seekbar").style.display = "none";
            }
        })
    })
}

function playPause(index) {
    let playPause = document.createElement("img");
        playPause.src = "assets/pause.svg";
        playPause.id = `playpause${index}`;
        playPause.setAttribute("width", "25px");
        document.querySelector(".controls").querySelectorAll("img")[1].replaceWith(playPause);
        document.getElementById(`playpause${index}`).addEventListener("click", (event) => {
            if (audio.paused) {
                document.getElementById(`playpause${index}`).setAttribute("src", "assets/pause.svg");
                audio.play();
            } else {
                document.getElementById(`playpause${index}`).setAttribute("src", "assets/play.svg");
                audio.pause();
            }
        })
}

function prev(index) {
    let previous = document.createElement("img");
    previous.src = "assets/previous.svg";
    previous.id = `previous${index}`;
    previous.setAttribute("width", "25px");
    document.querySelector(".controls").querySelectorAll("img")[0].replaceWith(previous);
    document.getElementById(`previous${index}`).addEventListener("click", (event) => {
        if (index == 0)
            trendingSongs[trendingSongs.length - 1].querySelector(".play-button").click();
        else
            trendingSongs[index - 1].querySelector(".play-button").click();
    })
}

function next(index) {
    let next = document.createElement("img");
    next.src = "assets/next.svg";
    next.id = `next${index}`;
    next.setAttribute("width", "25px");
    document.querySelector(".controls").querySelectorAll("img")[2].replaceWith(next);
    document.getElementById(`next${index}`).addEventListener("click", (event) => {
        trendingSongs[(index + 1) % trendingSongs.length].querySelector(".play-button").click();
    })
}

// Adding play button functionality upon hovering on the slides on the right side
let trendingSongs = document.querySelector(".trending-songs").children;
for (let index = 0; index < trendingSongs.length; index++) {
    trendingSongs[index].addEventListener("mouseover", () => {
        trendingSongs[index].querySelector(".play-button").style.opacity = "1";
        trendingSongs[index].querySelector(".play-button").style.top = "118px";
    })

    trendingSongs[index].addEventListener("mouseout", () => {
        trendingSongs[index].querySelector(".play-button").style.opacity = "0";
        trendingSongs[index].querySelector(".play-button").style.top = "128px";
    })

    playAudio(index);
}

let popularArtists = document.querySelector(".popular-artists-body").children;
let popularAlbums = document.querySelector(".popular-albums-body").children;
let popularRadio = document.querySelector(".popular-radio-body").children;
let featuredCharts = document.querySelector(".featured-charts-body").children;
for (let index = 0; index < 10; index++) {
    popularArtists[index].addEventListener("mouseover", () => {
        popularArtists[index].querySelector(".play-button").style.opacity = "1";
        popularArtists[index].querySelector(".play-button").style.top = "110px";
    })

    popularArtists[index].addEventListener("mouseout", () => {
        popularArtists[index].querySelector(".play-button").style.opacity = "0";
        popularArtists[index].querySelector(".play-button").style.top = "128px";
    })

    popularAlbums[index].addEventListener("mouseover", () => {
        popularAlbums[index].querySelector(".play-button").style.opacity = "1";
        popularAlbums[index].querySelector(".play-button").style.top = "110px";
    })

    popularAlbums[index].addEventListener("mouseout", () => {
        popularAlbums[index].querySelector(".play-button").style.opacity = "0";
        popularAlbums[index].querySelector(".play-button").style.top = "128px";
    })

    popularRadio[index].addEventListener("mouseover", () => {
        popularRadio[index].querySelector(".play-button").style.opacity = "1";
        popularRadio[index].querySelector(".play-button").style.top = "110px";
    })

    popularRadio[index].addEventListener("mouseout", () => {
        popularRadio[index].querySelector(".play-button").style.opacity = "0";
        popularRadio[index].querySelector(".play-button").style.top = "128px";
    })

    if (index < 6) {
        featuredCharts[index].addEventListener("mouseover", () => {
            featuredCharts[index].querySelector(".play-button").style.opacity = "1";
            featuredCharts[index].querySelector(".play-button").style.top = "110px";
        })

        featuredCharts[index].addEventListener("mouseout", () => {
            featuredCharts[index].querySelector(".play-button").style.opacity = "0";
            featuredCharts[index].querySelector(".play-button").style.top = "128px";
        })
    }
}


// Adding hamburger functionalities to the page
document.querySelector(".menu").addEventListener("click", (event) => {
    document.querySelector(".menu").style.opacity = "0";
    document.querySelector(".menu").style.zIndex = "-1";
    document.querySelector(".cancel").style.opacity = "1";
    document.querySelector(".cancel").style.zIndex = "1";
    document.querySelector(".left").style.left = "0";
    event.stopPropagation();
});

document.querySelector(".cancel").addEventListener("click", (event) => {
    document.querySelector(".cancel").style.opacity = "0";
    document.querySelector(".cancel").style.zIndex = "-1";
    document.querySelector(".menu").style.opacity = "1";
    document.querySelector(".menu").style.zIndex = "1";
    document.querySelector(".left").style.left = "-45%";
    event.stopPropagation();

});
