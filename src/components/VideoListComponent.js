import React, { useEffect } from 'react';
import '../styles/VideoList.css';

export function VideoListComponent() {

  useEffect(() => {

    async function getKey() {
      fetch("https://fpiyzrybc9.execute-api.us-east-2.amazonaws.com/hellofunction-staging")
        .then((response) => response.json())
        .then(data => {
          setUpPlayer(JSON.parse(data).YT_API_KEY);
        })
        .catch(error => {
          console.error(error);
          setUpPlayer("");
        });
    }

    function setUpPlayer(key) {
      //var key = api_key; // Restrictions
      //console.log("key: "+key);
      //var playlistId = "PLh-_qizMyR_UKUUUJsjKf_PSlW3APRagS"; // Chronological
      var playlistId = "UUb8xPiMtYUox6rk4ONjSCdg"; // Uploads
      var URL = "https://www.googleapis.com/youtube/v3/playlistItems?";

      var options = {
        part: "snippet",
        key: key,
        maxResults: 10,
        pageToken: "",
        playlistId: playlistId
      };

      var numResults = 0;

      loadVids(true);

      function loadVids(initMain) {
        fetch(URL + new URLSearchParams(options)).then(res => res.json()).then(data => {
          var main = data.items[0].snippet;
          var id = main.resourceId.videoId;
          var title = main.title;
          var desc = main.description;
          options["pageToken"] = data.nextPageToken;
          if (initMain) {
            mainVid(id, title, desc);
            document.getElementById("load").disabled = false;
          }
          resultsLoop(data);
          resultsCheck(data);
        }).catch(err => { console.log(err) });
      }

      function urlify(text) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function (url) {
          return '<a href="' + url + '" target="_blank" rel="noreferrer">' + url + '</a><br/>';
        })
      }

      function mainVid(id, title, desc) {
        console.log(desc)
        desc = urlify(desc);
        document.getElementById("player").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"; allowfullscreen="true"; webkitallowfullscreen="true"; mozallowfullscreen="true"; id="myVid"></iframe>`;
        document.getElementById("desc").innerHTML = `<h2>${title}</h2><p>${desc.replace(/\n/g, '<br/>')}</p>`;
      }

      function resultsLoop(data) {
        data.items.forEach(item => {
          var thumb = item.snippet.thumbnails.medium.url;
          var title = item.snippet.title;
          var desc = item.snippet.description;
          var vid = item.snippet.resourceId.videoId;

          var titlePieces = title.split("-");
          var displayDesc = desc//.substring(0, 50)

          if (titlePieces[1]) {
            displayDesc = titlePieces[1].trim();
            displayDesc = displayDesc[0].toUpperCase() + displayDesc.substring(1);
          }
          if (titlePieces[0].length > 40) {
            titlePieces[0] = titlePieces[0].substring(0, 40) + '...';
          }

          document.getElementById("vids").innerHTML += `
        <article class="item" data-key="${vid}" data-title="${title}" data-desc="${desc}">
          <img src="${thumb}" alt="" class="thumb">
          <div class="details">
            <h4>${titlePieces[0]}</h4>
            <p>${displayDesc}</p>
          </div>
        </article>
        `;

        });

        document.querySelectorAll("article").forEach(item => {
          var id = item.getAttribute("data-key");
          var title = item.getAttribute("data-title");
          var desc = item.getAttribute("data-desc");
          item.addEventListener('click', function () {
            mainVid(id, title, desc);
            document.getElementById('player').scrollIntoView(true);
            document.getElementById('desc').scrollTop = 0;
          });
        });

      }

      function resultsCheck(data) {
        numResults += options["maxResults"];
        var totalResults = data.pageInfo.totalResults;

        if (numResults >= totalResults) {
          var elem = document.getElementById("load");
          elem.parentNode.removeChild(elem);
        }
      }

      document.getElementById("load").addEventListener("click", function () {
        loadVids(false);
      });

      /*$(window).on("orientationchange", function (event) {
        if (Math.abs(window.orientation) == 90) {
          
          var elem = document.getElementById("myVid");
    
          if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if (elem.mozRequestFullScreen) {
            // Firefox 
            elem.mozRequestFullScreen();
          } else if (elem.webkitRequestFullscreen) {
            // Chrome, Safari and Opera 
            elem.webkitRequestFullscreen();
          } else if (elem.msRequestFullscreen) {
            // IE/Edge 
            elem.msRequestFullscreen();
          }
        }
      });*/
    }

    getKey();

  }, []);

  return (
    <div id="yt-container">
      <div id="video">
        <div id="player"></div>
        <div id="player-buffer"></div>
        <div id="desc"></div>
      </div>
      <div id="list">
        <div id="vids"></div>
        <button id="load" disabled>Load More</button>
      </div>
    </div>
  )
}