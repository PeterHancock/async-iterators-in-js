const fs = require("fs");

const page = slidesMd => `<html>
  <head>
    <style type="text/css">
    .scrollbar {
  border: 1px solid #eee;
  height: 670px;
  overflow: auto;
  margin: 5px 0 0;
  padding: 5px 10px 10px 10px;
}
    </style>
  </head>
  <body>
    <textarea id="source">
${slidesMd}
    </textarea>
  <script src="//remarkjs.com/downloads/remark-latest.min.js">
  </script>
  <script>remark.create()</script>
  <script src="//static.jsbin.com/js/embed.min.js?4.1.3"></script>
  </body>
</html>
`;

const md = fs.readFileSync(process.argv[2]);

fs.writeFileSync("index.html", page(md));
