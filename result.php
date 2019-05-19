<?php require($_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/main/include/prolog_before.php'); ?>
<?php
CModule::IncludeModule("iblock");
$IBLOCK_ID=28;
global $USER;
$id = $arFields["ID"];
$nameu=$USER->GetLogin();
$el = new CIBlockElement;
$today = date($DB->DateFormatToPHP(CSite::GetDateFormat("FULL")), time());
$PROP = array(
"date" => $today,
"id" => $id,
"login" =>$nameu
);
$arLoadProductArray = Array(
"MODIFIED_BY" => $nameu, 
"IBLOCK_SECTION_ID" => false, 
"IBLOCK_ID" => $IBLOCK_ID, 
"PROPERTY_VALUES"=> $PROP,
"NAME" => "Тест #",
"ACTIVE" => "Y", // активен
"PREVIEW_TEXT" => "текст для списка элементов",
"DETAIL_TEXT" => "текст для детального просмотра"
);
var_dump($arLoadProductArray);
$PRODUCT_ID = $el->Add($arLoadProductArray)
?>
<?php require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/epilog_after.php");?>
