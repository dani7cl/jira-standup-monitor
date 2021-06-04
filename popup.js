let speaker, advanceButtonsContainer, startButton, nextButton, skipButton, clearButton, showResultsButton

function setSpeaker() {
  setTimeout(() => {
    chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
      if (randomRange[randomRange.length - 1].endTime) {
        speaker.style = 'visibility: hidden'
      } else {
        speaker.style = 'visibility: visible'
        speaker.innerHTML = `${randomRange[index - 1].name}'s turn (Speaker n&ordm${index})`
      }
    })
  }, 100)
}

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
  speaker.style = 'visibility: hidden'
}

document.addEventListener('DOMContentLoaded', () => {
  speaker = document.getElementById('speaker')
  advanceButtonsContainer = document.getElementById('advance-buttons-container')
  startButton = document.getElementById('start')
  nextButton = document.getElementById('next')
  skipButton = document.getElementById('skip')
  clearButton = document.getElementById('clear')
  showResultsButton = document.getElementById('show-results')

  chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
    if (randomRange && index === randomRange.length) {
      showResultsState()
    } else if (index > 0) {
      showAdvanceState()
    }
  })

  setSpeaker()

  startButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(selectNextSpeaker)

    showAdvanceState()
    setSpeaker()
  })

  nextButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(selectNextSpeaker)
    chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
      if (randomRange && index === randomRange.length) {
        showResultsState()
      }
      if (!randomRange || index === 0) {
        showAdvanceState()
      }
    })
    setSpeaker()
  })

  skipButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(skipCurrentSpeaker)
    setSpeaker()
  })

  clearButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(clearData)
    showEmptyInitialState()
  })

  showResultsButton.addEventListener('click', () => {
    runFunction(showHighlights)
  })
})
