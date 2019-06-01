<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("catsanddogs");

?><link href="style.css" rel="stylesheet">
<div class="content">
	<div class="info">
		<b id="notice"></b>
	</div>
	
	<p class="result"></p>

    <div id='workPlace'>
        <div class="play" id="play">
    		Начать тест
    	</div>

    	<div class="block2" id="b1">
    				 <h1>Тренировка внимания</h1>

    				<div class="rules" id="rules">
    					<img src="Vopros.jpg" width="40">
    					<p>Задание предназначено для тренировки распределнного внимания. Вам необходимо определить какой канал задействован при возникновении источника информации: зрительный или слуховой.
    					</p><p> Вам предстоит пройти несколько уровней, различающихся по сложности. Более подробная информация будет представлена непосредственно перед началом уровня.</p>
                        <br><input class="butt next" id="next" type = "submit" value = "Далее">
    				</div>
    	</div>

        <div id = "task"></div>

        <div>
            <input class="leftBtn"  type = "button" value = "Кошка" name = "cat" >
            <input class="rightBtn"  type = "button" value = "Собака" name = "dog">
        </div>

        <div>
            <span id='test_countdown'></span>
        </div>

        <div>
            <span id='result'></span>
        </div>

        <div class="block2" id="infoAboutLevel">
            <p class="finish">Инструкция</p>
            <div class="rules">
                <p class="percent instruction"></p>
			</div>
            <input class="butt go" type = "submit" id="go" value = "Все понятно">
        </div>

        <div id='start_counter'></div>

        <div class="block2" id="b2">
            <p class="finish">Тест окончен</p>
            <div class="rules">
                <img src="./assets/image/like.png" width="80">
                <p class="percent"></p>
            </div>
            <input class="butt go" type = "submit" id="nextLevel" value = "Следующий уровень">
            <a href="/tests/" class="butt return-tests" id="list">Назад к тестам</a>
        </div>
    </div>
</div>

<script src="jquery-3.3.1.min.js"></script>
<script src="./lib/moment.js"></script>
<script src="script.js?rndstr=<%= getRandomStr() %>"></script>
<? include 'result.php'; ?>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>