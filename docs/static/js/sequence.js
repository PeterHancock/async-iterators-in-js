const sequenceDiagrams = document.getElementsByClassName('sequence')

for (const seq of sequenceDiagrams) {
  const name = seq.innerHTML
  seq.innerHTML = `<a target='_blank' href='static/sequence/${name}.html'><image width="450px" src="static/sequence/${name}.svg" /></a>`
}
