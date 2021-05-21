document.addEventListener('DOMContentLoaded', () => {
  const nextButton = document.getElementById('next')
  const clearButton = document.getElementById('clear')
  const showResultsButton = document.getElementById('show-results')

  chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
    if (randomRange && index === randomRange.length) {
      showResultsButton.style = 'display: initial'
      nextButton.style = 'display: none'
    }
  })
  nextButton.addEventListener('click', () => {
    runFunction(nextSpeaker)
    chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
      if (randomRange && index === randomRange.length) {
        showResultsButton.style = 'display: initial'
        nextButton.style = 'display: none'
      }
    })
  })

  clearButton.addEventListener('click', () => {
    runFunction(clearData)
    nextButton.style = 'display: initial'
    showResultsButton.style = 'display: none'
  })

  showResultsButton.addEventListener('click', () => {
    runFunction(showHighlights)
  })
})
