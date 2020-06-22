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

function startGame() {
  toggleGameInfoPanel();
  this.parentNode.style.display = "none";
}

instruToggle.onclick = toggleInstructionPanel;
instruToggle.onmouseover = moveInInstructionPanel;
instruToggle.onmouseleave = moveOutInstructionPanel;
document.getElementById("btn-start").onclick = startGame;
