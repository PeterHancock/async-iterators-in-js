for (const demo of document.getElementsByClassName('techio')) {
  if (window.techio) {
    demo.innerHTML = `<a target='_blank' href='https://tech.io/snippet-widget/${demo.innerHTML}'>&#9654;</a>`
  } else {
    demo.innerHTML = ''
  }
}
