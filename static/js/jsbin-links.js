const demos = document.getElementsByClassName('jsbin')
for (const demo of demos) {
  demo.innerHTML = `<a class= 'demo corner' target='_blank' href='https://jsbin.com/${demo.innerHTML}/edit?js,console'>Demo</a>`
}
