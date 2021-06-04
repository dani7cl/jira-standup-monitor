document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start')
  const nextButton = document.getElementById('next')
  const clearButton = document.getElementById('clear')
  const showResultsButton = document.getElementById('show-results')

  chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
    if (randomRange && index === randomRange.length) {
      showResultsButton.style = 'display: initial'
      nextButton.style = 'display: none'
    }

    if (index > 0) {
      nextButton.style = 'display: initial'
      startButton.style = 'display: none'
      clearButton.style = 'display: initial'
    }
  })

  startButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(selectNextSpeaker)
    startButton.style = 'display: none'
    nextButton.style = 'display: initial'
    clearButton.style = 'display: initial'
  })

  nextButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(selectNextSpeaker)
    chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
      if (randomRange && index === randomRange.length) {
        showResultsButton.style = 'display: initial'
        nextButton.style = 'display: none'
      }
      if (!randomRange || index === 0) {
        startButton.style = 'display: none'
      }
    })
  })

  clearButton.addEventListener('click', () => {
    runFunction(clearData)
    startButton.style = 'display: initial'
    nextButton.style = 'display: none'
    showResultsButton.style = 'display: none'
  })

  showResultsButton.addEventListener('click', () => {
    runFunction(showHighlights)
  })
})
