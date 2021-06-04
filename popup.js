document.addEventListener('DOMContentLoaded', () => {
  const advanceButtonsContainer = document.getElementById('advance-buttons-container')
  const startButton = document.getElementById('start')
  const nextButton = document.getElementById('next')
  const skipButton = document.getElementById('skip')
  const clearButton = document.getElementById('clear')
  const showResultsButton = document.getElementById('show-results')

  chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
    if (randomRange && index === randomRange.length) {
      showResultsButton.style = 'display: initial'
      startButton.style = 'display: none'
      clearButton.style = 'display: initial'
    } else if (index > 0) {
      advanceButtonsContainer.style = 'display: initial'
      startButton.style = 'display: none'
      clearButton.style = 'display: initial'
    }
  })

  startButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(selectNextSpeaker)
    startButton.style = 'display: none'
    advanceButtonsContainer.style = 'display: initial'
    clearButton.style = 'display: initial'
  })

  nextButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(selectNextSpeaker)
    chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
      if (randomRange && index === randomRange.length) {
        showResultsButton.style = 'display: initial'
        advanceButtonsContainer.style = 'display: none'
      }
      if (!randomRange || index === 0) {
        startButton.style = 'display: none'
      }
    })
  })

  skipButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(skipCurrentSpeaker)
  })

  clearButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(clearData)
    startButton.style = 'display: initial'
    advanceButtonsContainer.style = 'display: none'
    showResultsButton.style = 'display: none'
    clearButton.style = 'display: none'
  })

  showResultsButton.addEventListener('click', () => {
    runFunction(showHighlights)
  })
})
