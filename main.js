function runFunction(fn, externalFunctions = [], timeout = undefined, callback = () => {}, arg = undefined, argName = undefined) {
  let code = ''
  if (arg) {
    code += 'var ' + argName + ' = "' + arg + '";'
  }
  externalFunctions.forEach((f) => {
    code += !!f ? f.toString() + ';' : ''
  })
  code += `${fn.toString()}; ${fn.name}(${argName});`

  if (timeout !== undefined) {
    setTimeout(() => {
      chrome.tabs.executeScript({ code }, callback)
    }, timeout)
  } else {
    chrome.tabs.executeScript({ code }, callback)
  }
}

function clearData() {
  chrome.storage.sync.set({ randomRange: [], index: 0 })
  const panels = document.getElementsByClassName('jira-standup-panel')
  if (panels) {
    for (let panel of panels) {
      setTimeout(() => document.body.removeChild(panel))
    }
  }
  const confettis = document.getElementsByClassName('jira-standup-confetti')
  if (confettis) {
    for (let confetti of confettis) {
      setTimeout(() => document.body.removeChild(confetti))
    }
  }
  const player = document.getElementById('jira-standup-player')
  if (player) {
    setTimeout(() => document.body.removeChild(player))
  }
}

function unselectPreviousSpeakers() {
  const filters = document.querySelectorAll('.js-quickfilter-button.ghx-active[title^="assignee = "]')

  filters.forEach((element) => element.click())
}

function getSpeakerLabels() {
  function removeRepeated(filterCollection) {
    const filterArray = [].slice.call(filterCollection)
    return filterArray.filter((speaker, i) => filterArray.findIndex((s) => s.title === speaker.title) === i)
  }

  return removeRepeated(document.querySelectorAll('.js-quickfilter-button[title^="assignee = "]'))
}

function setFinalPlayerState() {
  const mainButton = document.getElementById('jira-standup-main')
  mainButton.disabled = false
  mainButton.classList.remove('jira-standup-play')
  mainButton.classList.add('jira-standup-show-highlights')

  document.getElementById('jira-standup-next').disabled = true
  document.getElementById('jira-standup-skip').disabled = true
  document.getElementById('jira-standup-previous').disabled = true
  document.getElementById('jira-standup-postpone').disabled = true
}

function selectNextSpeaker() {
  function getRandomNumber(max) {
    return Math.floor(Math.random() * max)
  }

  chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
    const filters = getSpeakerLabels()
    if (!index) {
      randomRange = []
      while (randomRange.length < filters.length) {
        const position = getRandomNumber(filters.length)
        if (!randomRange.some((range) => range.position === position)) {
          randomRange.push({
            position,
            name: filters[position].textContent,
            id: filters[position].title.replace('assignee = ', ''),
            duration: 0
          })
        }
      }
      document.getElementById('jira-standup-previous').disabled = true
      document.getElementById('jira-standup-main').disabled = true
      document.getElementById('jira-standup-postpone').disabled = false
      document.getElementById('jira-standup-next').disabled = false
      document.getElementById('jira-standup-skip').disabled = false
      index = 0
      randomRange[index].startTime = Date.now()
      filters[randomRange[index].position].click()
      ++index
    } else if (index < randomRange.length) {
      randomRange[index - 1].duration += Date.now() - randomRange[index - 1].startTime
      randomRange[index].startTime = Date.now()
      filters[randomRange[index].position].click()
      ++index
      document.getElementById('jira-standup-previous').disabled = false
      document.getElementById('jira-standup-postpone').disabled = index >= randomRange.length
    } else {
      randomRange[randomRange.length - 1].duration += Date.now() - randomRange[index - 1].startTime
      chrome.storage.sync.set({ randomRange })

      setFinalPlayerState()
      return
    }

    setTimeout(() => {
      const selectedSpeaker = document.querySelectorAll(`.js-quickfilter-button[title^="assignee = ${randomRange[index - 1].id}"]`)
      if (selectedSpeaker && selectedSpeaker[0]) {
        chrome.storage.sync.set({ randomRange, index })
      }
    }, 300)
  })
}

function selectPreviousSpeaker() {
  chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
    const filters = getSpeakerLabels()
    if (index > 0) {
      --index

      if (index - 1 >= 0) {
        randomRange[index - 1].startTime = Date.now()
        filters[randomRange[index - 1].position].click()
      }

      document.getElementById('jira-standup-previous').disabled = index - 1 <= 0
      document.getElementById('jira-standup-postpone').disabled = false

      setTimeout(() => {
        const selectedSpeaker = document.querySelectorAll(`.js-quickfilter-button[title^="assignee = ${randomRange[index + 1].id}"]`)
        if (selectedSpeaker && selectedSpeaker[0]) {
          chrome.storage.sync.set({ index })
        }
      }, 300)
    }
  })
}

function postponeCurrentSpeaker() {
  chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
    const filters = getSpeakerLabels()
    const postponedUser = randomRange[index - 1]
    postponedUser.startTime = null
    postponedUser.duration = 0
    randomRange.splice(index - 1, 1)
    randomRange.push(postponedUser)

    randomRange[index - 1].startTime = Date.now()
    filters[randomRange[index - 1].position].click()

    chrome.storage.sync.set({ index, randomRange })
  })
}

function skipCurrentSpeaker() {
  chrome.storage.sync.get(['index', 'randomRange'], ({ index, randomRange }) => {
    const filters = getSpeakerLabels()
    if (randomRange[index]) {
      filters[randomRange[index].position].click()
      randomRange[index].startTime = Date.now()
    } else {
      setFinalPlayerState()
    }
    document.getElementById('jira-standup-postpone').disabled = index + 1 >= randomRange.length

    randomRange.splice(index - 1, 1)

    chrome.storage.sync.set({ index, randomRange })
  })
}

function showHighlights() {
  document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" type="text/css" href="' + chrome.runtime.getURL('confetti.css') + '">')
  document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" type="text/css" href="' + chrome.runtime.getURL('highlights.css') + '">')

  function getTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }

  function createPanel(totalTime) {
    const panel = document.createElement('div')
    panel.className = 'jira-standup-panel'
    const panelContent = document.createElement('div')
    panelContent.className = 'jira-standup-panel-content'
    panel.appendChild(panelContent)

    const title = document.createElement('h1')
    title.textContent = `Total time is ${totalTime}`
    title.className = 'jira-standup-title'
    panelContent.appendChild(title)

    const innerPanel = document.createElement('div')
    innerPanel.className = 'jira-standup-inner-panel'
    panelContent.appendChild(innerPanel)
    document.body.appendChild(panel)
    return panelContent
  }

  chrome.storage.sync.get(['randomRange'], ({ randomRange }) => {
    if (!randomRange || !randomRange.length) {
      clearData()
    }
    const durationSeconds = Math.floor(
      (randomRange[randomRange.length - 1].startTime + randomRange[randomRange.length - 1].duration - randomRange[0].startTime) / 1000
    )
    const totalTime = getTime(durationSeconds)
    const panel = createPanel(totalTime)

    function createUserRow({ name, duration }) {
      const speakerRow = document.createElement('div')
      speakerRow.className = 'jira-standup-speaker-row'
      speakerRow.innerHTML = `<b>${name}</b><span style="text-align: right; flex: 1">${getTime(Math.floor(duration / 1000))}</span>`
      panel.childNodes[1].appendChild(speakerRow)
    }

    function createConfetti() {
      const confetti = document.createElement('div')
      confetti.className = 'jira-standup-confetti'

      for (let i = 0; i < 10; ++i) {
        const piece = document.createElement('div')
        piece.className = 'jira-standup-piece'
        confetti.appendChild(piece)
      }
      document.body.appendChild(confetti)
    }

    randomRange.sort((s1, s2) => s2.duration - s1.duration)
    randomRange.forEach((speaker) => {
      createUserRow(speaker)
    })

    createConfetti()
  })
}

function showPlayer() {
  document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" type="text/css" href="' + chrome.runtime.getURL('player.css') + '">')

  const PLAYER_ID = 'jira-standup-player'
  let player = document.getElementById(PLAYER_ID)
  if (player) {
    document.body.removeChild(player)
  }
  chrome.storage.sync.get(['randomRange', 'index'], ({ randomRange, index }) => {
    player = document.createElement('div')
    player.id = PLAYER_ID

    function addButton(id, clickCallback, disabled, title) {
      const button = document.createElement('button')
      button.classList.add('jira-standup-button')
      button.id = id
      button.title = title
      button.addEventListener('click', clickCallback)
      button.disabled = disabled
      return player.appendChild(button)
    }

    addButton(
      'jira-standup-postpone',
      () => {
        unselectPreviousSpeakers()
        postponeCurrentSpeaker()
      },
      !index || index + 1 >= randomRange.length,
      'Postpone'
    )

    addButton(
      'jira-standup-previous',
      () => {
        unselectPreviousSpeakers()
        selectPreviousSpeaker()
      },
      !index || randomRange.length <= index,
      'Previous'
    )

    const mainButton = addButton(
      'jira-standup-main',
      () => {
        chrome.storage.sync.get(['randomRange'], ({ randomRange }) => {
          if (randomRange.length && randomRange[randomRange.length - 1].duration) {
            showHighlights()
          } else {
            unselectPreviousSpeakers()
            selectNextSpeaker()
          }
        })
      },
      !(!index || (randomRange.length && randomRange[randomRange.length - 1].duration)),
      'Play / Results'
    )
    mainButton.classList.add('jira-standup-main-button')
    mainButton.classList.add(randomRange.length && randomRange[randomRange.length - 1].duration ? 'jira-standup-show-highlights' : 'jira-standup-play')

    addButton(
      'jira-standup-next',
      () => {
        unselectPreviousSpeakers()
        selectNextSpeaker()
      },
      !index || randomRange.length <= index,
      'Next'
    )

    addButton(
      'jira-standup-skip',
      () => {
        unselectPreviousSpeakers()
        skipCurrentSpeaker()
      },
      !index || randomRange.length <= index,
      'Skip'
    )

    document.body.appendChild(player)
  })
}

//** Extractor */

function getNumber(string) {
  return parseInt(string.replace(/^\D+/g, ''))
}

function getTasks(key, sprintName) {
  const sprint = Array.prototype.slice
    .call(document.getElementsByClassName('js-sprint-container'))
    .find((e) => e.querySelector(`span[data-fieldvalue="${sprintName}"]`))
  return Array.prototype.slice.call(sprint.querySelectorAll(`span[title="${key}"]`))
}

function formatTask(taskTypelement) {
  const id = taskTypelement.parentElement.querySelector('a[class*="js-key-link"]').title
  const title = taskTypelement.parentElement.querySelector('div[class*="ghx-summary"]').title

  return `- [[**${id}**]](https://dev-jira.dynatrace.org/browse/APM-346388) ${title}\n\n`
}

function copyTitle(sprintName) {
  const bugKey = 'Bug'
  const researchKey = 'Research'
  const rfaKey = 'Request for Assistance'
  const storyKey = 'Story'
  const taskKey = 'Task'

  const bugEmoji = ''
  const storyEmoji = ''
  const taskEmoji = ''
  const researchEmoji = ''
  const rfaEmoji = ''

  const bugs = getTasks(bugKey, sprintName)

  const stories = getTasks(storyKey, sprintName)

  const researches = getTasks(researchKey, sprintName)

  const tasks = getTasks(taskKey, sprintName)

  const rfas = getTasks(rfaKey, sprintName)

  let title = '## '

  if (bugs?.length) {
    title += bugEmoji + ' Bugs: ' + bugs.length
  }

  function addTasksToTitle(tasks, emoji, title) {
    if (tasks?.length) {
      return ' - ' + emoji + ' ' + title + ': ' + tasks.length
    }
    return ''
  }

  title += addTasksToTitle(rfas, rfaEmoji, 'RFA')
  title += addTasksToTitle(stories, storyEmoji, 'Stories')
  title += addTasksToTitle(researches, researchEmoji, 'Researches')
  title += addTasksToTitle(tasks, taskEmoji, 'Technical Tasks')

  return title
}

function copyPost(sprintName) {
  const bugKey = 'Bug'
  const researchKey = 'Research'
  const rfaKey = 'Request for Assistance'
  const storyKey = 'Story'
  const taskKey = 'Task'

  const sprintNumber = getNumber(sprintName)
  const bugsArray = getTasks(bugKey, sprintName)
  const stories = getTasks(storyKey, sprintName).length
  const researches = getTasks(researchKey, sprintName).length
  const tasks = getTasks(taskKey, sprintName).length
  const rfas = getTasks(rfaKey, sprintName).length
  const backports = bugsArray.filter((bug) => {
    const versionsElement = bug.parentElement.querySelector('span[class*="aui-label"]')
    if (versionsElement) {
      const sprints = versionsElement.title?.split(', ').map(getNumber)
      return sprints.filter((sprint) => sprint !== NaN).some((sprint) => sprintNumber - 2 >= sprint)
    }

    return false
  }).length

  let httpPostCmd = `curl --location --request POST 'https://demo.dev.dynatracelabs.com/api/v2/metrics/ingest?api-token='$DEMO_DEV_TOKEN \
--header 'Content-Type: text/plain' \
--data-raw 'sprint.review,issues="stories",sprint="$sprint" $stories
sprint.review,issues="bugs",sprint="$sprint" $bugs
sprint.review,issues="rfa",sprint="$sprint" $rfas
sprint.review,issues="backport",sprint="$sprint" $backports
sprint.review,issues="research",sprint="$sprint" $researches
sprint.review,issues="tech tasks",sprint="$sprint" $tasks'`

  httpPostCmd = httpPostCmd.replace(/\$sprint/g, sprintNumber)
  httpPostCmd = httpPostCmd.replace('$stories', stories)
  httpPostCmd = httpPostCmd.replace('$researches', researches)
  httpPostCmd = httpPostCmd.replace('$tasks', tasks)
  httpPostCmd = httpPostCmd.replace('$rfas', rfas)
  httpPostCmd = httpPostCmd.replace('$bugs', bugsArray.length)
  httpPostCmd = httpPostCmd.replace('$backports', backports)

  return httpPostCmd
}

function copyFeatures(sprintName) {
  const storyKey = 'Story'

  const storyEmoji = ''

  const stories = getTasks(storyKey, sprintName)

  let storiesText = '## ' + storyEmoji + storyEmoji + storyEmoji + ' Features:\n\n'

  stories.forEach((story) => {
    storiesText += formatTask(story)
  })

  return storiesText
}

function copyBackports(sprintName) {
  const bugKey = 'Bug'

  const sprintNumber = getNumber(sprintName)
  const bugs = getTasks(bugKey, sprintName)

  let backportsText = '## Backports\n\n'

  bugs.forEach((bug) => {
    const versionsElement = bug.parentElement.querySelector('span[class*="aui-label"]')
    if (versionsElement) {
      const sprints = versionsElement.title?.split(', ').map(getNumber)
      if (sprints.filter((sprint) => sprint !== NaN).some((sprint) => sprintNumber - 2 >= sprint)) {
        // it's a PROD backport
        backportsText += formatTask(bug)
      }
    }
  })
  return backportsText
}

function copyResearches(sprintName) {
  const researchKey = 'Research'
  const researchEmoji = ''
  const researches = getTasks(researchKey, sprintName)

  let researchesText = '## ' + researchEmoji + ' Research & investigation \n \n'

  researches.forEach((research) => {
    researchesText += formatTask(research)
  })
  return researchesText
}

function copyAllDashboardData(sprintName) {
  const title = copyTitle(sprintName)
  const features = copyFeatures(sprintName)
  const backports = copyBackports(sprintName)
  const researches = copyResearches(sprintName)
  chrome.storage.sync.set({ title, features, backports, researches })
}

function pasteAllDashboardData() {
  function addToMarkdown(text) {
    const doubleClick = new MouseEvent('dblclick', {
      view: window,
      bubbles: true,
      cancelable: true
    })

    document.querySelector('a[uitestid="gwt-debug-editButton"]')?.click()

    setTimeout(() => {
      document.querySelector('div[data-name="Markdown"]')?.dispatchEvent(doubleClick)
      const interval = setInterval(() => {
        const textarea = document.querySelector('textarea[uitestid="gwt-debug-markdown-tile-setup-markdown-editor"]')
        textarea.value = text
        textarea.click()
        textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
        textarea.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'e',
            keyCode: 69, // example values.
            code: 'KeyE', // put everything you need in this object.
            which: 69,
            shiftKey: false, // you don't need to include values
            ctrlKey: false, // if you aren't going to use them.
            metaKey: false // these are here for example's sake.
          })
        )
      }, 300)
      setTimeout(() => {
        clearInterval(interval)
        document.querySelector('a[uitestid="gwt-debug-sidepanelTileConfigCloseButton"]')?.click()
      }, 2000)
    }, 500)
  }

  chrome.storage.sync.get(['title', 'features', 'backports', 'researches'], ({ title, features, backports, researches }) => {
    addToMarkdown(title)
    setTimeout(() => addToMarkdown(features), 3000)
    setTimeout(() => addToMarkdown(backports), 6000)
    setTimeout(() => addToMarkdown(researches), 9000)
  })
}
