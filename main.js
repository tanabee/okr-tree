var data = {};
var LINE_COLOR = PropertiesService.getScriptProperties().getProperty("LINE_COLOR") || '#B9E6FF';
var BOX_COLOR = PropertiesService.getScriptProperties().getProperty("BOX_COLOR") || '#009EF6';
var BOX_WIDTH = PropertiesService.getScriptProperties().getProperty("BOX_WIDTH") || '300px';
var BOX_HEIGHT = PropertiesService.getScriptProperties().getProperty("BOX_HEIGHT") || '150px';

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
  var html = html
    .replace(/__BOX_COLOR__/g, BOX_COLOR)
    .replace(/__LINE_COLOR__/g, LINE_COLOR)
    .replace(/__JSON__/g, json)
    .replace(/__BOX_WIDTH__/g, BOX_WIDTH)
    .replace(/__BOX_HEIGHT__/g, BOX_HEIGHT);
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
