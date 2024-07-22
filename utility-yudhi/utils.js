const CheckIsObjectEmpty = (value) => {
  return Object.keys(value).length === 0 && value.constructor === Object;
}

const IsEmpty = (value, allow0 = false, notMinus = true) => {
  if (value === undefined || value === null) {
    return true;
  } else if (typeof value == "number" || typeof value == "BigInt") {
    if (!allow0) {
      if (notMinus) {
        return value <= 0;
      } else {
        return value === 0;
      }
    }
    if (notMinus) {
      return value < 0;
    }
  } else if (typeof value == "string") {
    // const isnum = /^\d+$/.test(value);
    const isnum = /^\d+(\.\d+)?$|^\.\d+$/.test(value);
    if (isnum) {
      if (!allow0) {
        if (notMinus) {
          return parseFloat(value) <= 0;
        } else {
          return parseFloat(value) === 0;
        }
      }
      if (notMinus) {
        return parseFloat(value) < 0;
      }
    } else {
      return value.length === 0;
    }
  } else if (typeof value == "boolean" || typeof value == "object" || Object.prototype.toString.call(value) == "[object Array]") {
    return value.length === 0;
  } else if (Object.prototype.toString.call(value) == "[object Object]" || Object.prototype.toString.call(value) == "[object Date]") {
    return value && Object.keys(value).length === 0 && Object.getPrototypeOf(value) === Object.prototype;
  }
  return false;
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const number_format = (number, decimals, dec_point, thousands_sep) => {
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

const number_format_big = (number, decimals, dec_point, thousands_sep) => {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  const sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
  const dec = (typeof dec_point === 'undefined') ? '.' : dec_point;
  let s = number.split('.');

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

const numberToSuperscriptOrdinal = (number) => {
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

const dateJson = {
  fullDate: new Date(),
  get dd () {
    return String(this.fullDate.getDate()).padStart(2, '0');
  },
  get mm () {
    return String(this.fullDate.getMonth() + 1).padStart(2, '0');
  },
  get yyyy () {
    return this.fullDate.getFullYear();
  },
  get today () {
    return this.yyyy + '-' + this.mm + '-' + this.dd;
  },
  get hours () {
    return this.fullDate.getHours();
  },
  get minutes () {
    return this.fullDate.getMinutes();
  },
  get seconds () {
    return this.fullDate.getSeconds();
  },
  get ddOrdinalEng () {
    return numberToSuperscriptOrdinal(String(this.fullDate.getDate()).padStart(2, '0'));
  },
  get mmLongEng () {
    const options = { month: 'long' };
    return this.fullDate.toLocaleDateString('en-US', options); 
  },
  get mmLongIna () {
    const options = { month: 'long' };
    return this.fullDate.toLocaleDateString('id-ID', options); 
  }
}

const dateJsonFun = (date) => {
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
    get hours () {
      return fullDate.getHours();
    },
    get minutes () {
      return fullDate.getMinutes();
    },
    get seconds () {
      return fullDate.getSeconds();
    },
    get ddOrdinalEng () {
      return numberToSuperscriptOrdinal(String(fullDate.getDate()).padStart(2, '0'));
    },
    get mmLongEng () {
      const options = { month: 'long' };
      return fullDate.toLocaleDateString('en-US', options); 
    },
    get mmLongIna () {
      const options = { month: 'long' };
      return fullDate.toLocaleDateString('id-ID', options); 
    },
    get timeStamp () {
      return `${this.today} ${this.hours}:${this.minutes}:${this.seconds}`;
    }
  }
}

const sendViaFetchNotForm = async (url, sendData) => {
  // const sendData = new URLSearchParams();
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "application/json, text/javascript, */*; q=0.01",
      },
      body: sendData.toString()
    });
    if (!response.ok) throw new Error('Trouble on network! Please coordinate with IT Infrastructure');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

const sendViaFetchForm = async (url, sendData) => {
  // const sendData = new FormData();
  try {
    const response = await fetch(url, {
      method: "POST",
      body: sendData
    });
    if (!response.ok) throw new Error('Trouble on network! Please coordinate with IT Infrastructure');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

const sendViaAjax = (sendData, url, successFunc, failedFunc) => {
  $.ajax({
    url: url,
    type: "POST",
    data: sendData,
    dataType: "json",
    async: false,
    processData: false,
    contentType: false,
    success: function (data) {
      successFunc(data);
    },
    error: function(){
      let data = { response:"error", alert:"Error Loading!" };
      failedFunc(data);
    }
  });
}

const isNumeric = (input) => {
  return /^\d+$/.test(input);
}

const inputOnlyInteger = (e) => {
  const arrayKey = [
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Enter', 'Home', 'End'
  ];
  const arrayWhich = [
    38, 40, 37, 39, 8, 46, 13, 35, 36
  ];
  if (isNumeric(e.key)) {
    return true;
  } else {
    if (arrayKey.includes(e.key) || arrayWhich.includes(e.which)) {
      return true;
    }
  }
  e.preventDefault();
}

const calculateDate = (dateString, year = null, month = null, day = null) => {
  let date = new Date(dateString);
  if (!IsEmpty(year) && !isNaN(year)) date.setFullYear(date.getFullYear() + parseInt(year));
  if (!IsEmpty(month) && !isNaN(month)) date.setMonth(date.getMonth() + parseInt(month));
  if (!IsEmpty(day) && !isNaN(day)) date.setDate(date.getDate() + parseInt(day));
  let newDateString = date.toISOString().split('T')[0];
  return newDateString;
}

const resetInputExceptChoice = (formElem) => {
  const allInput = formElem.querySelectorAll(`input:not(.choices__input, input[type="checkbox"], input[type="radio"]), textarea`);
  allInput.forEach(element => {
    element.value = null;
  });
}

class AlertElemBS5 {
  // Need BS5
  constructor(id) {
    this.alertElem = document.createElement('div');
    this.alertElem.setAttribute('class', 'modal fade');
    this.alertElem.setAttribute('id', id);
    this.alertElem.setAttribute('tabIndex', '-1');
    this.alertElem.setAttribute('aria-labelledby', id);
    this.alertElem.setAttribute('aria-hidden', 'true');
    this.alertElem.style.zIndex = 9999;
    this.alertBackdrop = document.createElement('div');
    this.alertBackdrop.setAttribute('class', 'modal-backdrop fade d-none');
    this.alertBackdrop.style.zIndex = 9999;
    this.alertElem.addEventListener('show.bs.modal', async (e) => {
      this.alertBackdrop.classList.add('show');
      this.alertBackdrop.classList.remove('d-none');
    })
    this.alertElem.addEventListener('hide.bs.modal', async (e) => {
      this.alertBackdrop.classList.remove('show');
      this.alertBackdrop.classList.add('d-none');
    })
    this.alertElem.addEventListener('click', async (e) => {
      if (e.target === this.alertElem) {
        this.alertModal.hide();
      }
    })
    document.body.appendChild(this.alertBackdrop);
  }

  setupAlert(title, backgroundTitle, colorTitle, msg){
    this.alertElem.innerHTML = `<div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header py-2 ${backgroundTitle} ${colorTitle}">
          <h5 class="modal-title fw-bold w-100 text-center">${title}</h5>
        </div>
        <div class="modal-body">
          <p class="mb-0">${msg}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-selesai btn-sm"><span class="ps-2">Selesai</span></button>
        </div>
      </div>
    </div>`;
    this.alertModal = new bootstrap.Modal(this.alertElem, {
      backdrop: false
    })
    const btnSelesai = this.alertElem.querySelector('.modal-footer button');
    btnSelesai.addEventListener('click', () => {
      this.alertModal.hide();
    })
  }

  sendAnAlertOnTry(getResponse, closeAfterFun = null) {
    if (getResponse.response === 'success') {
      if (!IsEmpty(closeAfterFun)) this.alertElem.addEventListener('hidden.bs.modal', closeAfterFun);
      this.setupAlert('Sukses', 'bg-success', 'text-white', getResponse.alert);
    } else {
      this.setupAlert('Terjadi Kesalahan', 'bg-danger', 'text-white', getResponse.alert);
    }
    this.alertModal.show();
  }

  sendAnAlertOnCatch(error) {
    this.setupAlert('Terjadi Kesalahan', 'bg-danger', 'text-white', error);
    this.alertModal.show();
  }
}

class ConfirmElemBS5 {
  // Need BS5
  constructor(id) {
    this.confirmElem = document.createElement('div');
    this.confirmElem.setAttribute('class', 'modal fade');
    this.confirmElem.setAttribute('id', id);
    this.confirmElem.setAttribute('tabIndex', '-1');
    this.confirmElem.setAttribute('aria-labelledby', id);
    this.confirmElem.setAttribute('aria-hidden', 'true');
    this.confirmElem.style.zIndex = 9998;
    this.confirmBackdrop = document.createElement('div');
    this.confirmBackdrop.setAttribute('class', 'modal-backdrop fade d-none');
    this.confirmBackdrop.style.zIndex = 9998;
    this.confirmElem.addEventListener('show.bs.modal', async (e) => {
      this.confirmBackdrop.classList.add('show');
      this.confirmBackdrop.classList.remove('d-none');
    })
    this.confirmElem.addEventListener('hide.bs.modal', async (e) => {
      this.confirmBackdrop.classList.remove('show');
      this.confirmBackdrop.classList.add('d-none');
    })
    this.confirmElem.addEventListener('click', async (e) => {
      if (e.target === this.confirmElem) {
        this.confirmModal.hide();
      }
    })
    document.body.appendChild(this.confirmBackdrop);
  }

  setupconfirm(title, backgroundTitle, colorTitle, msg){
    this.confirmElem.innerHTML = `<div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header py-2 ${backgroundTitle} ${colorTitle}">
          <h5 class="modal-title fw-bold w-100 text-center">${title}</h5>
        </div>
        <div class="modal-body">
          <p class="mb-0">${msg}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-keluar btn-sm"><span class="ps-2">Batal</span></button>
          <button type="button" class="btn btn-selesai btn-sm"><span class="ps-2">Konfirmasi</span></button>
        </div>
      </div>
    </div>`;
    this.confirmModal = new bootstrap.Modal(this.confirmElem, {
      backdrop: false
    })
    this.btnCancel = this.confirmElem.querySelector('.modal-footer .btn-keluar');
    this.btnConfirm = this.confirmElem.querySelector('.modal-footer .btn-selesai');
  }
}

const createAlertElem = (id, background, textColor, btnColor) => {
  const alertElem = document.createElement('div');
  alertElem.setAttribute('class', 'modal fade');
  alertElem.setAttribute('id', id);
  alertElem.setAttribute('tabIndex', '-1');
  alertElem.setAttribute('aria-labelledby', id);
  alertElem.setAttribute('aria-hidden', 'true');
  alertElem.innerHTML = `<div class="modal-dialog modal-dialog-centered modal-md">
    <div class="modal-content">
      <div class="modal-header py-2 ${background} ${textColor}">
        <h5 class="modal-title fw-bold w-100 text-center" id="title${id}">-- Title --</h5>
      </div>
      <div class="modal-body">
        <p id="msg${id}" class="mb-0"></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-sm"><span class="ps-2">Selesai</span></button>
      </div>
    </div>
  </div>`;
  return alertElem;
}

const templateAlert = (getResponse, modal, titleComplete, msgComplete, modalComplete, titleDanger, msgDanger, modalDanger, funSukses = () => {}) => {
  if (getResponse.response === 'success') {
    modal.hide();
    titleComplete.innerHTML = 'Berhasil !';
    msgComplete.innerHTML = getResponse.alert;
    modalComplete.show();
    funSukses();
  } else {
    titleDanger.innerHTML = 'Peringatan !';
    msgDanger.innerHTML = getResponse.alert;
    modalDanger.show();
  }
}

const findSmallest = (arr) => {
  return arr.reduce((min, current) => min < current ? min : current);
}

const findBigest = (arr) => {
  return arr.reduce((accumulate, current) => accumulate > current ? accumulate : current);
}

const findSmallestObjectPerspective = (arr) => {
  return arr.reduce((min, current) => min.alias <= current.alias && min.index < current.index ? min : current);
}

const parseVersion = (versionStr) => {
  return versionStr.split('.').map(Number);
};

const compareVersions = (arr1, arr2) => {
  for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
    const num1 = arr1[i] || 0;
    const num2 = arr2[i] || 0;
    if (num1 !== num2) {
      return num1 > num2 ? 1 : -1;
    }
  }
  return 0;
};

const childVersion = (arr1, arr2) => {
  for (let i = 0; i < arr1.length; i++) {
    const num1 = arr1[i] || 0;
    const num2 = arr2[i] || 0;
    if (num1 !== num2) {
      return false
    }
  }
  return true
}

const monthAcro = [
  {
    acronim: 'jan',
    number: '1',
    full: 'Januari'
  },
  {
    acronim: 'feb',
    number: '2',
    full: 'Februari'
  },
  {
    acronim: 'mar',
    number: '3',
    full: 'Maret'
  },
  {
    acronim: 'apr',
    number: '4',
    full: 'April'
  },
  {
    acronim: 'mei',
    number: '5',
    full: 'Mei'
  },
  {
    acronim: 'jun',
    number: '6',
    full: 'Juni'
  },
  {
    acronim: 'jul',
    number: '7',
    full: 'Juli'
  },
  {
    acronim: 'agu',
    number: '8',
    full: 'Agustus'
  },
  {
    acronim: 'sep',
    number: '9',
    full: 'September'
  },
  {
    acronim: 'okt',
    number: '10',
    full: 'Oktober'
  },
  {
    acronim: 'nov',
    number: '11',
    full: 'November'
  },
  {
    acronim: 'des',
    number: '12',
    full: 'Desember'
  }
];

const checkBooleanFromServer = (data) => {
  const typeData = typeof data;
  if (typeData === 'boolean') {
    return data;
  } else {
    return data === 't';
  }
}

export {
  CheckIsObjectEmpty,
  IsEmpty,
  capitalizeFirstLetter,
  number_format,
  number_format_big,
  ConvertStrToNum,
  numberToSuperscriptOrdinal,
  dateJson,
  dateJsonFun,
  sendViaFetchNotForm,
  sendViaFetchForm,
  sendViaAjax,
  isNumeric,
  inputOnlyInteger,
  calculateDate,
  resetInputExceptChoice,
  AlertElemBS5,
  ConfirmElemBS5,
  templateAlert,
  findSmallest,
  findBigest,
  findSmallestObjectPerspective,
  parseVersion,
  compareVersions,
  childVersion,
  createAlertElem,
  monthAcro,
  checkBooleanFromServer
};