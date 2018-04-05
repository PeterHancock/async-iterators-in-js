const demos = document.getElementsByClassName('jsbin')

for (const demo of demos) {
  demo.innerHTML = `<a target='_blank' href='https://jsbin.com/${demo.innerHTML}/edit?js,console'>&#9654;</a>`
}
