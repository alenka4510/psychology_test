<link href="style.css" rel="stylesheet">	
<link href="timerCss.css" rel="stylesheet">
<div class="content">
	<div class="play" id="play">
		Начать тест
	</div>
	
	<div class="block2" id="b1">
				 <h1>Тренировка внимания</h1>
				
				<div class="rules" id="rules"> 
					<img src="Vopros.jpg" width="40">
					<p>Задание предназначено для тренировки рассеянного внимания. Вам необходимо определить какой канал задействован при возникновении источника информации: зрительный или слуховой.
					</p><p> Чтобы начать упражнение, 
					выберите уровень сложности. Первый уровень  - самый легкий необходимо нажимать кнопку, соответсвующую изображению.
					Второй уровень предполагает наличие конкурирующих каналов. Необходимо выбирать то, что изображено на рисунке.</p>
				</div>
				<div class="rules2" >
					<img src="35.jpg" width="40">
					<h2>Выберите уровень сложности</h2>
					<form method = "POST" class="lev">
						<select name = "level" id="levels">
							<option value="first">Первый</option>
							<option value="second">Второй</option>
						</select>
						<br><input class="butt next" id="next" type = "submit" value = "Далее" onclick="getAjax(); return false;"> 
					</form>
				</div>
	</div>
	
	
	<div class="info"> 
		<b id="three">3</b>
		<b id="two" >2</b>
		<b id="one" >1</b>
	</div>
	
	<p class="result"></p>

    <div id='workPlace'>
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
    </div>


	<div class="img check"></div>
	<div class="img close"></div>
	<input class="next-test"  type = "button" value = "Далее">
	<!--div class="wrap">
			
			<div class="bar">
				<div class="progress">
					<span style="width: 100%;"></span>
				</div>

				<div class="circle">
					<span id="circle"></span>
				</div>	
			</div>	
			<div class="attempt">
				Попыток:<b></b>
			</div>
		</div>	
	 <div class="block2" id="b2">
		<p class="finish">Тест окончен</p>
		<div class="rules"> 
		
			<img src="like.png" width="80">
			<p class="percent"></p>
		</div>
		<input class="butt restart" type = "submit" id="res" value = "Заново"> 
		<a href="/tests/" class="butt return-tests" id="list">Назад к тестам</a> 
		
	</div-->
</div>

<script src="jquery-3.3.1.min.js"></script>
<script src="./lib/moment.js"></script>
<script src="script.js?rndstr=<%= getRandomStr() %>"></script>
<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
