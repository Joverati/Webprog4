var minChecked = false;
var text = "";
var title = "";
var accuracy = 0.5;
var from = 0;
var offset = 20;
var dataObj = [];
var recommendedArray = [];
var recommendedSpecArray = [];
var originalBase = [];
var originalSpecArray = [];
var min = document.getElementById('min');
var range = document.getElementById('range');
var buttonStart = document.getElementById('start');
var buttonPrevious = document.getElementById('prev');
var buttonNext = document.getElementById('next');
var buttonEnd = document.getElementById('end');
var select = document.getElementById('title');
var sidebar = document.getElementById('sidebar');

getText('data.txt');
accuracy = range.value;
document.getElementById('range-value').textContent = range.value;

min.addEventListener('change', function() {
  minChecked = !minChecked;
  content();
});

range.addEventListener('input', function(e) {
  accuracy = e.target.value;
  document.getElementById('range-value').textContent = e.target.value;
  content();
});

function sliceText() {
  dataObj.map((data, i) => {
    if(i >= from && i < (from + offset)) {
      var option = document.createElement('option');
      option.innerText = data.title;
      option.value = data.title;
      select.appendChild(option);
    }
  })
}

function getText(url) {
  dataObj = [];
  fetch(url)
    .then((response) => response.text())
    .then((text) => text.split('\n'))
    .then((text) => text.map((item) => item.split('$$$')))
    .then((text) => {
      var obj = {};
      var indx = 0;
      text.forEach((item) => {
        obj.recommended = item[0];
        obj.recommendedSpec = item[1];
        obj.original = item[2];
        obj.title = item[3];
        obj.text = item[4];
        obj.id = indx++;
        dataObj.push(obj);
        obj = {};
      });
      select.innerHTML = "";
      sliceText();
    });
};

buttonStart.addEventListener('click', function() {
  from = 0;
  getText('data.txt');
})

buttonPrevious.addEventListener('click', function() {
  from = from - 20;
  if(from < 0) {
    from = dataObj.length - 20;
  }
  getText('data.txt');
})

buttonNext.addEventListener('click', function() {
  from = from + 20;
  if(from + offset >= dataObj.length) {
    from = 0;
  }
  getText('data.txt');
})

buttonEnd.addEventListener('click', function() {
  from = dataObj.length - 20;
  getText('data.txt');
})

select.addEventListener('change', function(e) {
  var option = dataObj.find(d => d.title == e.target.value);
  console.log()
  textDataProcess(option);
});

function clearData() {
  recommendedArray = [];
  recommendedSpecArray = [];
  originalBase = [];
  originalSpecArray = [];
}

var textDataProcess = function(data) {
  clearData();
  var temp = {};
  var recommended = data.recommended.split(' '); 
  var recommendedSpec = data.recommendedSpec.split(' '); 
  var original = data.original.split(' ');
  text = data.text;
  title = data.title;
  
  recommended.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      temp.label = item.replace("__label__", "").replace(/@{2}/g, " ");
    }else if(item != "") {
      temp.accuracy = item.trim();
      recommendedArray.push(temp);
      temp = {};
    }
  });

  recommendedSpec.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      temp.label = item.replace("__label__", "").replace(/@{2}/g, " ");
    }else if(item != "") {
      temp.accuracy = item.trim();
      recommendedSpecArray.push(temp);
      temp = {};
    }
  });
  original.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      temp.label = item.replace("__label__", "").replace(/@{2}/g, " ");
      originalBase.push(temp);
      temp = {};
    }else if(item != "") {
      temp.label = item.replace(/@{2}/g, " ");
      originalSpecArray.push(temp);
      temp = {};
    }
  });

  var elem = document.getElementById("text");
  elem.innerHTML = text;
  
  content();
}

function Label(nodeId, data) {
  var node = document.getElementById(nodeId);
  node.innerHTML = "";
  if(minChecked) {
    for(var i = 0; i < data.length && i < 3; i++) {
      var list = document.createElement('li');
        if (data[i].accuracy !== undefined) {
          list.textContent = `${data[i].label} ${data[i].accuracy}`;
        }else {
          list.textContent = data[i].label;
        }
        node.appendChild(list);
    }

    for(var i = 3; i < data.length; i++) {
      if(data[i].accuracy !== undefined) {
        if(data[i].accuracy >= accuracy) {
          var list = document.createElement('li');
          if (data[i].accuracy !== undefined) {
            list.textContent = `${data[i].label} ${data[i].accuracy}`;
          }else {
            list.textContent = data[i].label;
          }
          node.appendChild(list);
        }
      } else {
        var list = document.createElement('li');
        if (data[i].accuracy !== undefined) {
          list.textContent = `${data[i].label} ${data[i].accuracy}`;
        }else {
          list.textContent = data[i].label;
        }
        node.appendChild(list);
      }
    }
  } else {
    for(var i = 0; i < data.length; i++) {
      if(data[i].accuracy !== undefined) {
        if(data[i].accuracy >= accuracy) {
          var list = document.createElement('li');
          if (data[i].accuracy !== undefined) {
            list.textContent = `${data[i].label} ${data[i].accuracy}`;
          }else {
            list.textContent = data[i].label;
          }
          node.appendChild(list);
        }
      } else {
        var list = document.createElement('li');
        if (data[i].accuracy !== undefined) {
          list.textContent = `${data[i].label} ${data[i].accuracy}`;
        }else {
          list.textContent = data[i].label;
        }
        node.appendChild(list);
      }
    }
  }
};

function content() {
  Label("original-labels", originalBase);
  Label("recommended-labels", recommendedArray);
  Label("recommended-spec-labels", recommendedSpecArray);
  Label("original-spec-labels", originalSpecArray);
}