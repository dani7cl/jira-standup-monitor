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
  sprintNameSelect

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
  sprintNameSelect = document.getElementById('sprint-name')

  runFunction(getSprintNames, [], 0, (result) => {
    result[0].forEach((name) => {
      console.log(name)
      const opt = document.createElement('option')
      opt.value = name
      opt.innerHTML = name
      sprintNameSelect.appendChild(opt)
    })
  })

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
      sprintNameSelect.value,
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
      sprintNameSelect.value,
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
      sprintNameSelect.value,
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
      sprintNameSelect.value,
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
      sprintNameSelect.value,
      'sprintName'
    )
  })

  copyAllButton.addEventListener('click', () => {
    runFunction(
      copyAllDashboardData,
      [copyTitle, copyFeatures, copyBackports, copyResearches, getNumber, getTasks, formatTask],
      0,
      () => {},
      sprintNameSelect.value,
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
      sprintNameSelect.value,
      'sprintName'
    )
  })

  pasteAllButton.addEventListener('click', () => {
    runFunction(pasteAllDashboardData, [], 0)
  })
})
