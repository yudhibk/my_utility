const CapsFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const IsEmpty = (value, allow0 = false, notMinus = true) => {
  if (value === undefined || value === null) {
    return true;
  } else if (typeof value == "number" || typeof value == "BigInt") {
    if (!allow0 && notMinus) {
      return value <= 0;
    }
  } else if (typeof value == "string") {
    const isnum = /^\d+$/.test(value);
    if (!allow0 && isnum && notMinus) {
      return parseInt(value) <= 0;
    } else {
      return value.length === 0;
    }
  } else if (typeof value == "boolean" || typeof value == "object" || Object.prototype.toString.call(value) == "[object Array]") {
    return value.length === 0;
  } else if (Object.prototype.toString.call(value) == "[object Object]" || Object.prototype.toString.call(value) == "[object Date]") {
    return value && Object.keys(value).length === 0 && Object.getPrototypeOf(value) === Object.prototype;
  } else {
    return false;
  }
}

const FetchSendDataPHP5 = async (SendData, UrlLink, returnText = 'json') => {
  try {
    const requestDetail = await fetch('rfq_new2023_get.php', {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "application/json, text/javascript, */*; q=0.01",
      },
      body: sendData.toString()
    });
    const getData = returnText === 'text' ? await requestDetail.text() : await requestDetail.json();
    return getData;
  } catch (error) {
    console.error(error);
    return {
      status: 'error'
    }
  }
}

const AjaxSendData = (
  SendData, UrlLink, DataType = 'json',
  FunSuccess = (data, status) => {console.log(data, status)},
  FunError = () => {console.log('Error Sending Data!')}
) => {
  $.ajax({
    url: UrlLink,
    type: "POST",
    data: SendData,
    dataType: DataType,
    async: false,
    processData: false,
    contentType: false,
    success: function (data, status) {
      FunSuccess(data, status);
    },
    error: function(e){
      FunError();
    }
  });
}

const NumberFormat = (number, decimals, dec_point, thousands_sep) => {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

const ConvertStrToNum = (inputStr, thousandSeparator, decimalSeparator) => {
  if (thousandSeparator === decimalSeparator || IsEmpty(inputStr)) {
    return 0;
  }
  const stringWithoutThousands = !IsEmpty(thousandSeparator) && inputStr.includes(thousandSeparator) ? inputStr.replace(new RegExp(`\\`+thousandSeparator, 'g'), '') : inputStr;
  const stringWithDotAsDecimal = !IsEmpty(decimalSeparator) && inputStr.includes(decimalSeparator) ? stringWithoutThousands.replace(new RegExp(`\\`+decimalSeparator, 'g'), '.') : stringWithoutThousands;
  const parsedNumber = parseFloat(stringWithDotAsDecimal);
  if (!isNaN(parsedNumber)) {
    return parsedNumber;
  } else {
    return null;
  }
}

function NumberToSupscrOrdinal(number) {
  const lastDigit = number % 10;
  if (lastDigit === 1 && number !== 11) {
    return number + '<sup>st</sup>';
  } else if (lastDigit === 2 && number !== 12) {
    return number + '<sup>nd</sup>';
  } else if (lastDigit === 3 && number !== 13) {
    return number + '<sup>rd</sup>';
  } else {
    return number + '<sup>th</sup>';
  }
}

const DateJson = (date) => {
  const fullDate = !IsEmpty(date) ? new Date(date) : new Date();
  return {
    fullDate: fullDate,
    get dd () {
      return String(fullDate.getDate()).padStart(2, '0');
    },
    get mm () {
      return String(fullDate.getMonth() + 1).padStart(2, '0');
    },
    get yyyy () {
      return fullDate.getFullYear();
    },
    get today () {
      return this.yyyy + '-' + this.mm + '-' + this.dd;
    },
    get DayOrdinal () {
      return NumberToSupscrOrdinal(String(fullDate.getDate()).padStart(2, '0'));
    },
    get MonthLong (CountryCode = 'en-US') {
      const options = { month: 'long' };
      return fullDate.toLocaleDateString(CountryCode, options); 
    }
  }
}

const SetupWebSocket = (IpServer, PortServer, FunMessage = (e) => {}) => {
  const ws = new WebSocket(`ws://${IpServer}:${PortServer}`);

  ws.addEventListener("open", (e) => {
    console.log('Connected to Web Socket Succesfully!');
  });

  ws.addEventListener("message", (e) => {
    FunMessage(e);
  });

  ws.addEventListener("close", (e) => {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
    setTimeout(function() {
      SetupWebSocket();
    }, 1000);
  });

  ws.addEventListener("error", (e) => {
    console.error('Socket encountered error: ', e.message, 'Closing socket');
  });

  return ws;
}

const SendMessageSocket = async (ws, message, timeout = 5000) => {
  const isOpened = ws.readyState === WebSocket.OPEN;
  const isNotConnecting = ws.readyState !== WebSocket.CONNECTING;
  if (isNotConnecting && isOpened && !IsEmpty(ws)) {
    ws.send(message);
  } else {
    setTimeout(() => {SendMessageSocket(ws, message, timeout)}, timeout);
  }
}

const LaunchNotif = (MsgTitle, MsgBody,
  FunOnClick = (e) => {console.log(e.data)},
  FunOnError = (e) => {console.error(e)},
  FunOnClose = (e) => {}
) => {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    createNotif(MsgTitle, MsgBody, msgFun, FunOnClick, FunOnError, FunOnClose);
  } else {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        createNotif(MsgTitle, MsgBody, msgFun);
      }
    });
  }
}

const createNotif = (MsgTitle, MsgBody, FunOnClick, FunOnError, FunOnClose) => {
  const notification = new Notification(MsgTitle, {
    body: MsgBody,
    icon: 'images/icon.png'
  });

  notification.addEventListener('click', function (e) {
    FunOnClick(e);
  });

  notification.addEventListener('close', function (e) {
    FunOnClose(e);
  });

  notification.addEventListener('error', function (e) {
    FunOnError(e);
  });

  // setTimeout(function(){
  //   notification.close();
  // }, 900000);
}

export {
  CapsFirstLetter,
  IsEmpty,
  NumberFormat,
  ConvertStrToNum,
  NumberToSupscrOrdinal,
  DateJson,
  SetupWebSocket,
  SendMessageSocket,
  LaunchNotif,
  FetchSendDataPHP5
  AjaxSendData
};