const BUTTON_DEBOUNCE_MS = 300;
let advanceButtonsContainer, startButton, nextButton, posponeButton, clearButton, showResultsButton, skipButton, timer

function showAdvanceState() {
  startButton.style = 'display: none'
  advanceButtonsContainer.style = 'display: initial'
  clearButton.style = 'display: initial'
}

function showResultsState() {
  showResultsButton.style = 'display: initial'
  startButton.style = 'display: none'
  clearButton.style = 'display: initial'
  advanceButtonsContainer.style = 'display: none'
}

function showEmptyInitialState() {
  startButton.style = 'display: initial'
  advanceButtonsContainer.style = 'display: none'
  showResultsButton.style = 'display: none'
  clearButton.style = 'display: none'
}

function showResultsIfNoSpeakersLeft() {
  chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
    if (randomRange && index >= randomRange.length) {
      showResultsState()
    }
  })
}

function nextButtonClicked() {
  runFunction(unselectPreviousSpeakers)
  runFunction(selectNextSpeaker, getSpeakerLabels, 100)
  showResultsIfNoSpeakersLeft();
}

function skipButtonClicked() {
  runFunction(unselectPreviousSpeakers)
  runFunction(skipCurrentSpeaker, getSpeakerLabels, 100)
  showResultsIfNoSpeakersLeft();
}

function posponeButtonClicked() {
  runFunction(unselectPreviousSpeakers)
  runFunction(posponeCurrentSpeaker, getSpeakerLabels, 100)
}

function startButtonClicked() {
  runFunction(unselectPreviousSpeakers)
  runFunction(selectNextSpeaker, getSpeakerLabels, 100)

  showAdvanceState()
}

function buttonClicked(callback) {
  if(timer) {
    clearTimeout(timer)
  }

  timer = setTimeout(callback, BUTTON_DEBOUNCE_MS)
}

document.addEventListener('DOMContentLoaded', () => {
  advanceButtonsContainer = document.getElementById('advance-buttons-container')
  startButton = document.getElementById('start')
  nextButton = document.getElementById('next')
  posponeButton = document.getElementById('pospone')
  skipButton = document.getElementById('skip')
  clearButton = document.getElementById('clear')
  showResultsButton = document.getElementById('show-results')

  chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
    if (randomRange && index >= randomRange.length) {
      showResultsState()
    } else if (index > 0) {
      showAdvanceState()
    }
  })

  startButton.addEventListener('click', () => {
    buttonClicked(startButtonClicked)
  })

  nextButton.addEventListener('click', () => {
    buttonClicked(nextButtonClicked)
  })

  posponeButton.addEventListener('click', () => {
    buttonClicked(posponeButtonClicked)
  })

  skipButton.addEventListener('click', () => {
    buttonClicked(skipButtonClicked)
  })

  clearButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(clearData, 100)
    showEmptyInitialState()
  })

  showResultsButton.addEventListener('click', () => {
    runFunction(showHighlights)
  })
})
