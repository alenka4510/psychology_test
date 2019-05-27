<?php
    CModule::IncludeModule("iblock");
    $IBLOCK_ID=50;
    global $USER;
    $id = $arFields["ID"];
    $nameu=$USER->GetLogin();
    $amountRightAnswersLevel1= $_POST["amountRightAnswersLevel1"];
    $amountRightAnswersLevel2= $_POST["amountRightAnswersLevel2_1"];
    $amountRightAnswersLevel3= $_POST["amountRightAnswersLevel2_2"];
    $amountWrongAnswersLevel1= $_POST["amountWrongAnswersLevel1"];
    $amountWrongAnswersLevel2= $_POST["amountWrongAnswersLevel2"];
    $amountWrongAnswersLevel3= $_POST["amountWrongAnswersLevel3"];
    $timeForTest= $_POST["timeForTest"];
    $timeForTask= $_POST["timeForTask"];

    $el = new CIBlockElement;
    $today = date($DB->DateFormatToPHP(CSite::GetDateFormat("FULL")), time());
    $PROP = array(
        "TimeForTest" => $timeForTest,
        "id" => $id,
        "TimeForTask" =>$timeForTask,
        "AmountRightAnswersLevel1" =>$amountRightAnswersLevel1,
        "AmountWrongAnswersLevel1" =>$amountWrongAnswersLevel1,
        "User" =>$nameu,
        "TestDate" =>$today,
        "AmountRightAnswersLevel2" =>$amountRightAnswersLevel2,
        "AmountWrongAnswersLevel2" =>$amountWrongAnswersLevel2,
        "AmountRightAnswersLevel3" =>$amountRightAnswersLevel3,
        "AmountWrongAnswersLevel3" =>$amountWrongAnswersLevel3
    );

    $arLoadProductArray = Array(
    "MODIFIED_BY" => $nameu,
    "IBLOCK_SECTION_ID" => false,
    "IBLOCK_ID" => $IBLOCK_ID,
    "PROPERTY_VALUES"=> $PROP,
    "NAME" => "Тест с животными",
    "ACTIVE" => "Y", // активен
    "PREVIEW_TEXT" => "текст для списка элементов",
    "DETAIL_TEXT" => "текст для детального просмотра"
    );
    var_dump($arLoadProductArray);
    $PRODUCT_ID = $el->Add($arLoadProductArray)
?>