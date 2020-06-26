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
  if (
    document.getElementById("btn-start").classList.contains("not-displayed")
  ) {
    bgClassList.add("bg-pause");
  }
}

function screenSwitchOn(){
  document.getElementById("game-window").classList.add("screen-on");
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

function toggleGameOverMsg() {
  document.getElementById("loose-message").classList.toggle("not-displayed");
}

function toggleGameWonMsg() {
  document.getElementById("win-message").classList.toggle("not-displayed");
}

export function displayGame() {
  screenSwitchOn();
  toggleGameInfoPanel();
  toggleLobbyBackground();
  toggleGameMenu();
  toggleStartBtn();
}

export function displayGameOver() {
  toggleGameOverMsg();
  toggleGameMenu();
  togglePlayAgainBtn();
  toggleLobbyBackground();
}

export function displayGameWon() {
  toggleGameWonMsg();
  toggleGameMenu();
  togglePlayAgainBtn();
  toggleLobbyBackground();
}

export function togglePause(evt) {
  document.getElementById("pause-message").classList.toggle("not-displayed");
  toggleGameMenu();
  toggleResumeBtn();
  toggleLobbyBackground();
}

export function displayRestartedGame() {
  if(document.getElementById("win-message").classList.contains("not-displayed") === false){
    toggleGameWonMsg();
  } else {
    toggleGameOverMsg();
  }
  togglePlayAgainBtn();
  toggleGameMenu();
  toggleLobbyBackground();
}

instruToggle.onclick = toggleInstructionPanel;
instruToggle.onmouseover = moveInInstructionPanel;
instruToggle.onmouseleave = moveOutInstructionPanel;
