<?php
class cleanWord{

  private $lang = 'en';
  private $langMessage = array(
    'en' => array(
      'empty' => 'Some data are empty, please check column with * symbol!',
      'zero' => "Error occured, can't be zero / empty",
      'unexpected' => 'Unexpected error, please screenshot this &amp; report the chronology to IT!'
    ),
    'id' => array(
      'empty' => 'Ada data yang kosong, silahkan cek kembali data dengan simbol (*) wajib',
      'zero' => 'Data tidak dapat bernilai 0 atau KOSONG, silahkan periksa kembali!',
      'unexpected' => 'Masalah tidak terduga, silahkan screenshot pesan ini &amp; laporkan kronologinya ke IT!'
    )
  );

  public function setupLang($lang){
    $this->lang = $lang;
  }

  public function textCk($text, $cek = true, $typeText = "normal", $emptyReturn = "", $allowHtml = true){
    if ((!isset($text) || rtrim($text) == "" || $text == null) && $cek) {
      echo json_encode(
        array(
          'response'=>'error',
          'alert'=> !empty($this->langMessage[$this->lang]['empty']) ? $this->langMessage[$this->lang]['empty'] : $this->langMessage['en']['empty']
        )
      );
      die();
    } elseif ((!isset($text) || rtrim($text) == "" || $text == null) && !$cek && $emptyReturn !== "") {
      return $emptyReturn;
    } else {
      if ($allowHtml) $text = htmlspecialchars($text);
      if ($typeText == 'camel') {
        $text = pg_escape_literal( ucwords(strtolower(trim($text))) );
      } elseif ($typeText == 'upper') {
        $text = pg_escape_literal( strtoupper(trim($text)) );
      } elseif ($typeText == 'upperClean') {
        $text = strtoupper(trim($text));
      } elseif ($typeText == 'lower') {
        $text = pg_escape_literal( strtolower(trim($text)) );
      } elseif ($typeText == 'json') {
        $text = pg_escape_string(trim($text));
      } elseif ($typeText == 'escape') {
        $text = pg_escape_string($text);
      } elseif ($typeText == 'plain') {
        $text = $text;
      } elseif ($typeText == 'trim') {
        $text = trim($text);
      } else {
        $text = pg_escape_literal(trim($text));
      }
      return $text;
    }
  }

  public function numberCk(
    $text,
    $cek = true,
    $typeText = 'integer',
    $allow0 = false,
    $returnText = 'number',
    $decimal = null,
    $point = null,
    $separator = null,
    $sign = null,
    $convert = true,
    $convert_tho_point = ',',
    $convert_dec_point = '.'
  ){
    if (!isset($text) && $cek == false) {
      if ($returnText == 'text') {
        return '';
      } elseif ($returnText == 'value') {
        return null;
      } else {
        return 'null';
      }

    } elseif (!isset($text) && $cek) {
      echo json_encode(
        array(
          'response'=> 'error',
          'alert'=> !empty($this->langMessage[$this->lang]['empty']) ? $this->langMessage[$this->lang]['empty'] : $this->langMessage['en']['empty']
        )
      );
      die();

    } elseif (empty($text) && $allow0 == false) {
      echo json_encode(
        array(
          'response'=> 'error',
          'alert'=> !empty($this->langMessage[$this->lang]['zero']) ? $this->langMessage[$this->lang]['zero'] : $this->langMessage['en']['zero']
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

  public function dateCk($text, $cek = true, $returnText = 'escape'){
    if (empty($text) && $cek) {
      echo json_encode(
        array(
          'response'=>'error',
          'alert'=> !empty($this->langMessage[$this->lang]['empty']) ? $this->langMessage[$this->lang]['empty'] : $this->langMessage['en']['empty']
        )
      );
      die();
    } else {
      if (!empty($text) && date_parse($text)) {
        return $returnText == 'escape' ? pg_escape_literal(trim($text)) : trim($text);
      } else {
        return 'null';
      }
    }
  }

  public function arrayCk($array, $cek = true){
    if (empty($array) && $cek) {
      echo json_encode(
        array(
          'response'=>'error',
          'alert'=> !empty($this->langMessage[$this->lang]['empty']) ? $this->langMessage[$this->lang]['empty'] : $this->langMessage['en']['empty']
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
            'alert'=> !empty($this->langMessage[$this->lang]['unexpected']) ? $this->langMessage[$this->lang]['unexpected'] : $this->langMessage['en']['unexpected']
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
        if ($valueChild !== null) {
          if (count($exceptKey) > 0) {
            if (!in_array($keyChild, $exceptKey)) {
              $thisArray[$key][$keyChild] = htmlspecialchars_decode($valueChild) ;
            }
          } else {
            $thisArray[$key][$keyChild] = htmlspecialchars_decode($valueChild);
          }
        }
      }
    }
    return $thisArray;
  }

}
$cleanWord = new cleanWord();
$cleanWord->setupLang('id');
?>