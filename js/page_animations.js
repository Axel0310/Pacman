const instruPanel = document.querySelector(".instruction-panel");
const instruToggle = document.getElementById("instruction-toggle");


function toggleInstructionPanel() {
  if (instruPanel.classList.contains("instru-pan-hover")) {
    instruPanel.classList.toggle("instru-pan-hover");
  } else {
    instruPanel.classList.toggle("instru-pan-is-hidden");
  }
}

function moveInInstructionPanel() {
  if (instruPanel.classList.contains("instru-pan-is-hidden")) {
    instruPanel.classList.toggle("instru-pan-hover");
    instruPanel.classList.toggle("instru-pan-is-hidden");
  }
}

function moveOutInstructionPanel() {
  if (instruPanel.classList.contains("instru-pan-hover")) {
    instruPanel.classList.toggle("instru-pan-hover");
    instruPanel.classList.toggle("instru-pan-is-hidden");
  }
}

function toggleGameInfoPanel() {
  document
    .querySelector(".game-info-panel")
    .classList.toggle("game-info-pan-is-hidden");
}

function toggleLobbyBackground() {
  const bgClassList = document.getElementById("lobby-background").classList;
  bgClassList.toggle("not-displayed");
  if(document.getElementById("btn-start").classList.contains("not-displayed")){
    bgClassList.add("bg-pause");
  }

}

function toggleGameMenu() {
  document.getElementById("game-menu").classList.toggle("not-displayed");
}

function toggleStartBtn() {
  document.getElementById("btn-start").classList.toggle("not-displayed");
}

function toggleResumeBtn() {
  document.getElementById("btn-resume").classList.toggle("not-displayed");
}

function togglePlayAgainBtn() {
  document.getElementById("btn-play-again").classList.toggle("not-displayed");
}

function displayGame() {
  toggleGameInfoPanel();
  toggleLobbyBackground();
  toggleGameMenu();
  toggleStartBtn();
}

function togglePause(evt){
  if(evt.repeat === false && evt.key === " "){
    toggleGameMenu();
    toggleResumeBtn();
    toggleLobbyBackground();
  }
}


instruToggle.onclick = toggleInstructionPanel;
instruToggle.onmouseover = moveInInstructionPanel;
instruToggle.onmouseleave = moveOutInstructionPanel;
document.getElementById("btn-start").onclick = displayGame;
document.querySelector("body").onkeydown = togglePause;
