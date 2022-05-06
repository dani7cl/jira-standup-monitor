let showPlayerButton,
  clearButton,
  extractorButton,
  timer,
  mainView,
  extractorView,
  goBackButton,
  copyBackportsButton,
  copyFeaturesButton,
  copyTitleButton,
  copyResearchesButton,
  copPostButton,
  copyAllButton,
  pasteAllButton,
  sprintName

function showPlayerButtonClicked() {
  runFunction(showPlayer)
}

document.addEventListener('DOMContentLoaded', () => {
  showPlayerButton = document.getElementById('show-player')
  clearButton = document.getElementById('clear')
  extractorButton = document.getElementById('show-extractor')
  mainView = document.getElementById('main-view')
  extractorView = document.getElementById('extractor-view')

  goBackButton = document.getElementById('go-back')
  copyBackportsButton = document.getElementById('copy-backports')
  copyTitleButton = document.getElementById('copy-title')
  copyFeaturesButton = document.getElementById('copy-features')
  copyResearchesButton = document.getElementById('copy-researches')
  copyMetricHttpPostButton = document.getElementById('copy-metric-http-post')
  copyDashboardHttpPostButton = document.getElementById('copy-dashboard-http-post')
  copyAllButton = document.getElementById('copy-all')
  pasteAllButton = document.getElementById('paste-all')
  sprintName = document.getElementById('sprint-name')

  // Main View
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

  extractorButton.addEventListener('click', () => {
    mainView.style.display = 'none'
    extractorView.style.display = 'initial'
  })

  clearButton.addEventListener('click', () => {
    runFunction(unselectPreviousSpeakers)
    runFunction(clearData)
  })

  // Extractor
  goBackButton.addEventListener('click', () => {
    extractorView.style.display = 'none'
    mainView.style.display = 'initial'
  })

  copyResearchesButton.addEventListener('click', () => {
    runFunction(
      copyResearches,
      [getTasks, formatTask],
      0,
      (text) => {
        navigator.clipboard.writeText(text)
      },
      sprintName.value,
      'sprintName'
    )
  })

  copyBackportsButton.addEventListener('click', () => {
    runFunction(
      copyBackports,
      [getTasks, formatTask, getNumber],
      0,
      (text) => {
        navigator.clipboard.writeText(text)
      },
      sprintName.value,
      'sprintName'
    )
  })

  copyTitleButton.addEventListener('click', () => {
    runFunction(
      copyTitle,
      [getTasks, formatTask],
      0,
      (text) => {
        navigator.clipboard.writeText(text)
      },
      sprintName.value,
      'sprintName'
    )
  })

  copyMetricHttpPostButton.addEventListener('click', () => {
    runFunction(
      copyMetricHttpPost,
      [getTasks, formatTask, getNumber],
      0,
      (text) => {
        console.log(text)
        navigator.clipboard.writeText(text)
      },
      sprintName.value,
      'sprintName'
    )
  })

  copyFeaturesButton.addEventListener('click', () => {
    runFunction(
      copyFeatures,
      [getTasks, formatTask],
      0,
      (text) => {
        navigator.clipboard.writeText(text)
      },
      sprintName.value,
      'sprintName'
    )
  })

  copyAllButton.addEventListener('click', () => {
    runFunction(
      copyAllDashboardData,
      [copyTitle, copyFeatures, copyBackports, copyResearches, getNumber, getTasks, formatTask],
      0,
      () => {},
      sprintName.value,
      'sprintName'
    )
  })

  copyDashboardHttpPostButton.addEventListener('click', () => {
    runFunction(
      copyDashboardHttpPost,
      [copyTitle, copyFeatures, copyBackports, copyResearches, getNumber, getTasks, formatTask],
      0,
      (text) => {
        console.log(text)
        navigator.clipboard.writeText(text)
      },
      sprintName.value,
      'sprintName'
    )
  })

  pasteAllButton.addEventListener('click', () => {
    runFunction(pasteAllDashboardData, [], 0)
  })
})
