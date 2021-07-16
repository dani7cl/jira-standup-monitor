let showPlayerButton, clearButton, timer

function showPlayerButtonClicked() {
  runFunction(showPlayer)
}

document.addEventListener('DOMContentLoaded', () => {
  showPlayerButton = document.getElementById('show-player')
  clearButton = document.getElementById('clear')

  showPlayerButton.addEventListener('click', () => {
    runFunction(showPlayer, [
      unselectPreviousSpeakers,
      skipCurrentSpeaker,
      selectNextSpeaker,
      selectPreviousSpeaker,
      postponeCurrentSpeaker,
      getSpeakerLabels,
      showHighlights,
      setFinalPlayerState
    ])
    window.close()
  })

  clearButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(clearData)
  })
})
