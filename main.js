window.DEBUG = true;

window.debug = function (message) {
  if (window.console !== undefined && window.console.log !== undefined && window.DEBUG) {
    window.console.log.apply(window.console, arguments);
  }
};

window.error = function (message) {
  if (window.console !== undefined && window.console.error !== undefined) {
    window.console.error.apply(window.console, arguments);
  }
};

(function (window, undefined) {
  var ticks_per_second = 5;

  var Clock = function (callback) {
    this.callback = callback;
  };

  Clock.prototype.next_tick = function () {
    var self = this;
    this.timeout = window.setTimeout(function () { self.next_tick() }, 1000.0 / ticks_per_second);
    this.count();
  }

  Clock.prototype.set_time = function () {
    var current_time = new Date();
    this.seconds = current_time.getSeconds();
    this.minutes = current_time.getMinutes();
    this.hours   = current_time.getHours();
  }

  Clock.prototype.count = function () {
    var now = Date.now();

    // are we further along than we were before?
    if (this.previous_now && now > this.previous_now) {
      this.set_time();
      this.callback(this);
    }

    this.previous_now = now;
  }

  Clock.prototype.start = function () {
    this.set_time();

    debug(
      "[clock.js] starting clock at " +
      this.hours + ":" +
      this.minutes + ":" +
      this.seconds
    );

    this.next_tick();
  }

  window.Clock = Clock;
}(window));


////////////////////////------------------///////////////-----------------////////////////////////


var defer = function (callback) {
  if (window.addEventListener) {
    window.addEventListener("load", callback, false);
  } else if (window.attachEvent) {
    window.attachEvent("onload", callback);
  } else {
    window.onload = callback;
  }
}


////////////////////////------------------///////////////-----------------////////////////////////


// APP!

/*
 * LOOKUP TABLE
 */
var BASE64_CONVERSION = {
   0: 'A',
   1: 'B',
   2: 'C',
   3: 'D',
   4: 'E',
   5: 'F',
   6: 'G',
   7: 'H',
   8: 'I',
   9: 'J',
  10: 'K',
  11: 'L',
  12: 'M',
  13: 'N',
  14: 'O',
  15: 'P',
  16: 'Q',
  17: 'R',
  18: 'S',
  19: 'T',
  20: 'U',
  21: 'V',
  22: 'W',
  23: 'X',
  24: 'Y',
  25: 'Z',
  26: 'a',
  27: 'b',
  28: 'c',
  29: 'd',
  30: 'e',
  31: 'f',
  32: 'g',
  33: 'h',
  34: 'i',
  35: 'j',
  36: 'k',
  37: 'l',
  38: 'm',
  39: 'n',
  40: 'o',
  41: 'p',
  42: 'q',
  43: 'r',
  44: 's',
  45: 't',
  46: 'u',
  47: 'v',
  48: 'w',
  49: 'x',
  50: 'y',
  51: 'z',
  52: '0',
  53: '1',
  54: '2',
  55: '3',
  56: '4',
  57: '5',
  58: '6',
  59: '7',
}

var render_conversion_table = function () {
  /// Render conversion table
  var table_as_rows = [], row_count = 0, rows_per_column = 20, columns = 3, keys = [];
  for (var k in BASE64_CONVERSION) {
    if (BASE64_CONVERSION.hasOwnProperty(k)) keys.push(k);
  }

  for (var n=0; n < rows_per_column; n++) {
    var row = [], idx = n;
    // `columns` are key,val pairs
    for (var c=0; c < columns; c++) {
      if (keys.length > idx) {
        row.push(BASE64_CONVERSION[keys[idx]]);
        row.push(keys[idx]);
      } else {
        row.push('');
        row.push('');
      }
      idx += rows_per_column;
    }
    table_as_rows.push(row);
  }

  // add rows to table
  var table = document.querySelector("#conversion-chart tbody");
  for (var r=0; r < table_as_rows.length; r++) {
    var row = document.createElement('tr');
    for (var c=0; c < table_as_rows[r].length; c++) {
      var cell = document.createElement('td');

      if (c % 2 == 0) {
        cell.setAttribute('id', 'code-' + String(table_as_rows[r][c]));
      } else {
        cell.setAttribute('id', 'value-' + String(table_as_rows[r][c]));
      }

      cell.innerHTML = String(table_as_rows[r][c]);

      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

// on page load

defer(function () {
  render_conversion_table();

  var display = document.getElementById('clock'),
      sub = document.getElementById('sub-caption');

  var p = function (n) {
    return n < 10 ? ' ' + String(n) : String(n);
  }

  var showTime = function (c) {
    var now = new Date();
    var time_array = [now.getHours(), now.getMinutes(), now.getSeconds()];

    // if you actually want to do the whole legit Base64 string thing:
    // display.innerText = btoa(time_array);

    // clear highlights!
    var tbl = document.querySelectorAll('tbody td');
    for (var i=0; i < tbl.length; i++) {
      tbl[i].classList.remove('highlight-0', 'highlight-1', 'highlight-2')
    }

    // but that doesn't make things any shorter, so just use the index table
    var time_string = '', time_string_array = [];
    for (var n=0; n < time_array.length; n++) {
      var value = time_array[n],
          code = BASE64_CONVERSION[value];

      time_string += "<span class='code-" + String(n) + "'>" + code + "</span>";
      // time_string += code;
      time_string_array.push(p(value));

      document.querySelector("#code-" + code).classList.add("highlight-" + String(n))
      document.querySelector("#value-" + value).classList.add("highlight-" + String(n))
    }

    display.innerHTML = time_string;
    // sub.innerHTML = time_string_array.join(' ');
  }

  // immediately render time
  showTime();

  // start clock
  var clock = new Clock(function (clock) { showTime(clock); });

  // count down from 10000 hours
  clock.start();
})
