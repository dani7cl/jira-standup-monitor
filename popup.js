document.addEventListener('DOMContentLoaded', () => {
  var dropdown = document.getElementById('activate');

  dropdown.addEventListener('click', () => {
    runFunction(createPanel)
  });
});
