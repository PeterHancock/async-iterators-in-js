for (const demo of document.getElementsByClassName('jsbin')) {
  if (!window.techio) {
    demo.innerHTML = `<a target='_blank' href='https://jsbin.com/${demo.innerHTML}/edit?js,console'>&#9654;</a>`
  } else {
    demo.innerHTML = ''
  }
}
