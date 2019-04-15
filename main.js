var data = {};

function doGet() {
  var html = HtmlService.createTemplateFromFile('template').getRawContent();
  var rows = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('okr')
    .getDataRange()
    .getValues();

  rows.shift();

  // 最上位の要素を取得
  var topElement = rows.filter(function (row) {
    return row[2] === '';
  })[0];

  data = arrayToObj(topElement);
  findChildren(data, rows);

  var json = JSON.stringify(data);
  var html = html.replace('[[json]]', json);
  return HtmlService.createHtmlOutput(html);
}

function findChildren(data, rows) {
  var children = rows.filter(function (row) {
    return row[2] === data.id;
  }).map(arrayToObj);

  if (children.length > 0) {
    data.children = children;
    data.children.forEach(function (child) {
      findChildren(child, rows);
    });
  }
}

function arrayToObj(array) {
  return {
    id: array[0],
    name: array[1],
    title: '<strong>O:</strong> ' + array[3].replace(/\n/g, '<br>') + '<br><strong>KR:</strong><br>' + array[4].replace(/\n/g, '<br>'),
  }
}
