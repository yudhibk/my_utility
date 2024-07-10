<?php
class cleanWordPDO{

  private $lang = 'id';
  private function langMessage($lang, $type, $source = null) {
    $langMessage = array(
      'en' => array(
        'empty' => 'Server is not getting mandatory data (*); Please check again or consult IT.',
        'zero' => "Error occured, please check data is 0 or null!",
        'unexpected' => 'Unexpected error, please screenshot this error message &amp; report the chronology to IT.'
      ),
      'id' => array(
        'empty' => 'Server tidak mendapatkan data wajib (*); Silahkan periksa kembali atau konsultasi ke IT.',
        'zero' => 'Data tidak dapat bernilai 0 atau KOSONG, silahkan periksa kembali.',
        'unexpected' => 'Kesalahan tak terduga, silahkan screenshot pesan ini &amp; laporkan kronologinya ke IT.'
      )
    );
    $sourceMsg = !empty($source) ? " {#$source}" : "";
    return $langMessage[$lang][$type] . $sourceMsg;
  }

  public function setupLang($lang){
    $this->lang = $lang;
  }

  public function textCk($text, $cek = true, $typeText = 'normal', $trimText = 'both', $source = '', $allowHtml = true, $emptyReturn = ""){
    if ((!isset($text) || rtrim($text) === "" || $text === null) && $cek) {
      if ($cek) {
        echo json_encode(
          array(
            'response'=>'error',
            'alert'=> !empty($this->langMessage($this->lang, 'empty', $source))
              ? $this->langMessage($this->lang, 'empty', $source)
              : $this->langMessage('en', 'empty', $source)
          )
        );
        die();
      } elseif (!$cek && $emptyReturn !== "") {
        return $emptyReturn;
      }

    } else {
      if ($text !== null && rtrim($text) !== "") {
        if ($allowHtml) $text = htmlspecialchars($text);
        if ($trimText === 'both') {
          $text = trim($text);
        } elseif ($trimText === 'left') {
          $text = ltrim($text);
        } elseif ($trimText === 'right') {
          $text = rtrim($text);
        }
        if ($typeText == 'camel') {
          $text = ucwords(strtolower($text));
        } elseif ($typeText == 'upper') {
          $text = strtoupper($text);
        } elseif ($typeText == 'lower') {
          $text = strtolower($text);
        }
        return $text;
      }
    }
  }

  public function numberCk(
    $text,
    $cek = true,
    $typeText = 'integer',
    $allow0 = false,
    $source = '',
    $convert = true,
    $convert_tho_point = ',',
    $convert_dec_point = '.',
    $returnText = 'number',
    $decimal = 2,
    $point = '.',
    $separator = ',',
    $sign = ''
  ){
    if (!isset($text)) {
      if ($cek) {
        echo json_encode(
          array(
            'response'=> 'error',
            'alert'=> !empty($this->langMessage($this->lang, 'empty', $source))
              ? $this->langMessage($this->lang, 'empty', $source)
              : $this->langMessage('en', 'empty', $source)
          )
        );
        die();
      } else {
        if ($returnText == 'text') {
          return '';
        } elseif ($returnText == 'value') {
          return null;
        } else {
          return 'null';
        }
      }

    } elseif (empty($text) && !$allow0) {
      echo json_encode(
        array(
          'response'=> 'error',
          'alert'=> !empty($this->langMessage($this->lang, 'zero', $source))
            ? $this->langMessage($this->lang, 'zero', $source)
            : $this->langMessage('en', 'zero', $source)
        )
      );
      die();

    } else {

      if ($convert) {
        $text = trim(str_replace($convert_tho_point, '', $text));
        $text = $convert_dec_point !== '.' ? str_replace($convert_dec_point, '.', $text) : $text;
      }

      if ($typeText == 'float') {
        $value = floatval($text);
      } elseif ($typeText == 'double') {
        $value = doubleval($text);
      } elseif ($typeText == 'text') {
        $value = strval($text);
      } else {
        $value = intval($text);
      }

      if ($returnText == 'text') {
        return $sign . " " . number_format($value, $decimal, $point, $separator);
      } else {
        return $value;
      }
      
    }
  }

  public function dateCk($text, $cek = true, $source = ''){
    if (empty($text) && $cek) {
      echo json_encode(
        array(
          'response'=>'error',
          'alert'=> !empty($this->langMessage($this->lang, 'empty', $source))
            ? $this->langMessage($this->lang, 'empty', $source)
            : $this->langMessage('en', 'empty', $source)
        )
      );
      die();
    } else {
      if (!empty($text) && date_parse($text)) {
        return trim($text);
      } else {
        return 'null';
      }
    }
  }

  public function arrayCk($array, $cek = true, $source = ''){
    if (empty($array) && $cek) {
      echo json_encode(
        array(
          'response'=>'error',
          'alert'=> !empty($this->langMessage($this->lang, 'empty', $source))
            ? $this->langMessage($this->lang, 'empty', $source)
            : $this->langMessage('en', 'empty', $source)
        )
      );
      die();
    } else {
      if (is_array($array)) {
        return $array;
      } else {
        echo json_encode(
          array(
            'response'=>'error',
            'alert'=> !empty($this->langMessage($this->lang, 'unexpected', $source))
              ? $this->langMessage($this->lang, 'unexpected', $source)
              : $this->langMessage('en', 'unexpected', $source)
          )
        );
        die();
      }
    }
  }

  public function cleaningArrayHtml($array, $exceptKey = array()){
    $thisArray = $array;
    foreach ($thisArray as $key => $value) {
      foreach ($value as $keyChild => $valueChild) {
        if (count($exceptKey) > 0) {
          if (!in_array($keyChild, $exceptKey)) {
            $thisArray[$key][$keyChild] = htmlspecialchars_decode($valueChild);
          }
        } else {
          $thisArray[$key][$keyChild] = htmlspecialchars_decode($valueChild);
        }
      }
    }
    return $thisArray;
  }

}
$cleanWordPDO = new cleanWordPDO();
?>