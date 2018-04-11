const fs = require("fs")

const page = slidesMd => `
<!DOCTYPE html>
<html>
  <head>
    <title>Async Iteration</title>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="static/css/remark-custom-theme.css">
    <link rel="stylesheet" type="text/css" href="static/css/remark-custom-extra.css">
    <link rel="stylesheet" type="text/css" href="static/css/svg-custom.css">
  </head>
  <body>
    <textarea id="source">
${slidesMd}
    </textarea>
    <script src="static/js/remark-latest.min.js">
    </script>
    <script>
      remark.create({
        highlightStyle: 'github',
        highlightLanguage: 'javascript',
        highlightLines: true,
        navigation: {
          scroll: false
        }
      })
    </script>
    <script src="static/js/jsbin-embed-4.1.3.min.js"></script>
    <script>
      window.techio = window.location.search.indexOf('techio') !== -1
    </script>
    <script src="static/js/jsbin-links.js"></script>
    <script src="static/js/techio-links.js"></script>
    <script src="static/js/sequence.js"></script>
  </body>
</html>
`;

const md = fs.readFileSync(process.argv[2])

fs.writeFileSync("docs/index.html", page(md))
