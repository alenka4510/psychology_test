﻿var AMOUNT_TIME_ON_ANSWER_IN_SECONDS = 2;
var CAMOUNT_TIME_FOR_TEST_IN_SECONDS = 4;

class Test {
  constructor() {
    this.AMOUNT_TIME_FOR_TEST_IN_SECONDS = CAMOUNT_TIME_FOR_TEST_IN_SECONDS;
    this.KEYCODE_LEFT_BUTTON = 37;
    this.KEYCODE_RIGHT_BUTTON = 39;
    this.testCountdownElement = $('#test_countdown');
    this.leftButton = $('.leftBtn');
    this.rightButton = $('.rightBtn');
    this.testStartTime;
    this.leastTimeForTest = this.AMOUNT_TIME_FOR_TEST_IN_SECONDS;
    this.testIsEnded = false;
    this.timer;
    this.getDataTest();
    this.task = new Task();
    this.rightAnswers = 0;
    this.wrongAnswers = 0;
    this.amountTasks = 0;
    this.level = 0;
    this.nextTaskTimeout = undefined;
	this.answersTimes;
	this.taskStartTime = undefined;
    this.passedTasks = [];
    this.reactionTime = [];
    this.tasksInTest = [];
  };

  newLevel()
  {
    //this.nextTaskTimeout = undefined;
    this.answersTimes;
    //this.taskStartTime = undefined;
    this.leastTimeForTest = CAMOUNT_TIME_FOR_TEST_IN_SECONDS;
    this.testIsEnded = false;
    this.passedTasks = [];
    this.reactionTime = [];
    this.tasksInTest = [];
    this.rightAnswers = 0;
    this.wrongAnswers = 0;
    this.amountTasks = 0;
  }

  setLevel(newLevel) {
    this.level = newLevel;
    this.nextTask = this.level == 1 ? this.nextTaskLevel1 : this.nextTaskLevel2;
  };

  setIntervalForNextTask() {
   // this.nextTaskTimeout = setInterval(this.nextTask.bind(this), this.task.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS);
    clearTimeout(this.nextTaskTimeout);
    console.log({"clearTimeout:" : this.nextTaskTimeout });
    this.nextTaskTimeout = setTimeout(this.nextTask.bind(this), this.task.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS);
    console.log({"createdTimer Из тextTask": this.nextTaskTimeout});
  }

  nextTaskLevel1() {

	this.taskStartTime = performance.now();
    this.tasksInTest.push(this.task);

    this.amountTasks++;
    if (this.testIsEnded) {
      return;
    }

    if (this.task.audio) {
      this.task.audio.pause();
    }

	this.task = new Task();
    this.task.clearTaskImage();
    this.task.clearTask();
    let index = this.selfRandom(0, this.tasks.length - 1);

    const task = this.tasks[index];
    const taskFile = this.tasks[index].fileName;
    if (taskFile === null) {
      return;
    }

    const taskFileImage = taskFile;
    if (taskFile.split('.')[1] === 'mp3') {
      this.task.playAudio(taskFile);
      this.task.type = task.type;
      this.task.image = this.task.audioImage;
    } else {
      this.task.image = taskFileImage;
      this.task.type = task.type;
    }

    this.task.addTaskImage(this.task.image);

    this.setIntervalForNextTask();
  };

  nextTaskLevel2(myAudio, btnFlag) {
    this.taskStartTime = performance.now();
    this.tasksInTest.push(this.task);
    try {
      this.amountTasks++;
      if (this.testIsEnded) {
        return;
      }

      if (this.task.audio) {
        this.task.audio.pause();
      }

      this.task.clearTaskImage();
      this.task.clearTask();
      let indexImage = this.selfRandom(0, this.images.length - 1);
      let indexAudio = this.selfRandom(0, this.audios.length - 1);

      const taskImg = this.images[indexImage].fileName;
      const taskType = this.level == 2 ? this.images[indexImage].type : this.audios[indexAudio].type;
      const taskAudio = this.audios[indexAudio].fileName;

      if (taskImg == null) {
        return;
      }

      this.task.addTaskImage(taskImg);
      this.task.playAudio(taskAudio);
      this.task.type = taskType;
    } catch (err) {
      console.log({err});
    }
    this.setIntervalForNextTask();
  }

  checkAnswerProcess(answer) {
    const startTime = performance.now();
    const reactionTime = (startTime - this.taskStartTime).toFixed(0);
    this.taskStartTime = startTime;

    if (this.checkAnswer(answer)) {
      this.rightAnswers++;
      this.passedTasks.push({ answer: 'right', reactionTime });
    } else {
      this.wrongAnswers++;
      this.passedTasks.push({ answer: 'wrong', reactionTime });
    }

    if(this.testIsEnded)
    {
      if(this.task.audio)
      {
        this.task.audio.pause();
      }
      $('.leftBtn').delay().fadeOut(500);
      $('.rightBtn').delay().fadeOut(500);
      $('#task').delay().fadeOut(500);
      $('#test_countdown').delay().fadeOut(500);
      $('#b2').delay(1000).fadeIn(300);
      $('#reset').delay(1000).fadeIn(300);
      $('#backToTest').delay(1000).fadeIn(300);
      $('#nextLevel').delay(1000).fadeIn(300);

      $(".percent").empty();

      $(".percent").append(`Кол-во правильных ответов: ${this.rightAnswers}<br>`);
      $(".percent").append(`Кол-во ошибочных ответов: ${this.wrongAnswers}<br>`);
      $(".percent").append(`Кол-во пропущенных заданий: ${this.tasksInTest.length - this.passedTasks.length}<br>`);

      console.log({ passed: this.passedTasks, tasks: this.tasksInTest });

      return;
    }
    this.nextTask();
  }

  checkAnswer(btnName) {
    return btnName === this.task.type;
  }

  paseDataTest(data) {
    const d = data;
  }

  getDataTest() {
    var response = $.ajax({
        async: false,
        url: "dataTest.php",
        type: "POST",
        success: function (data){
          return data;
        }
      }).responseText;

    const serverResponse = JSON.parse(response).result;

    this.tasks = serverResponse.tasks;
    this.images = serverResponse.images;
    this.audios = serverResponse.audios;
  };

  selfRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  renderTestCountdown() {
    this.testCountdownElement.html(`Осталось ${this.leastTimeForTest} секунд`);
  };

  infoAboutLevel1() {
    $(".instruction").empty();
    $('#infoAboutLevel').delay(1000).fadeIn(300);
    $('#go').delay(1000).fadeIn(300);
    $(".instruction").append("Уровень 1. <br> " +
      "Перед вами будут представлены КАРТИНКИ с кошками и собаками. Вам необходимо идентифицировать животное. " +
      "Вы можете выбирать ответ с помощью клавиш клавиатуры  ← и →, а также кликом по соответсвующим кнопкам на экране.<br><br>" +
      `На выполнение задания отводится ${this.AMOUNT_TIME_FOR_TEST_IN_SECONDS} секунд`);
  }

  infoAboutLevel2() {
    $(".instruction").empty();
    $('#infoAboutLevel').delay(1000).fadeIn(300);
    $('#go').delay(1000).fadeIn(300);
    $(".instruction").append("Уровень 2. <br> " +
      "Перед вами будет и КАРТИНКА и ЗВУК одновременно. Выбирать необходимо то животное, которое ИЗОБРАЖЕНО НА КАРТИНКЕ.<br><br>" +
      `На выполнение задания отводится ${this.AMOUNT_TIME_FOR_TEST_IN_SECONDS} секунд`);
  }

  infoAboutLevel3() {
    $(".instruction").empty();
    $('#infoAboutLevel').delay(1000).fadeIn(300);
    $('#go').delay(1000).fadeIn(300);
    $(".instruction").append("Уровень 3. <br> " +
      "Перед вами будет и КАРТИНКА и ЗВУК одновременно. Выбирать необходимо то животное, которое вы СЛЫШИТЕ.<br><br>" +
      `На выполнение задания отводится ${this.AMOUNT_TIME_FOR_TEST_IN_SECONDS} секунд`);
  }

  maskResultBlock() {
    $('#b2').delay().fadeOut();
    $('#reset').delay().fadeOut();
    $('#backToTest').delay().fadeOut();
    $('#nextLevel').delay().fadeOut();
  }

  showResultBlock() {
    $('#b2').delay().fadeIn(300);
    $('#reset').delay().fadeIn(300);
    $('#backToTest').delay().fadeIn(300);
    $('#nextLevel').delay().fadeIn(300);
  }
}
class Task {
  constructor() {
    this.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS = AMOUNT_TIME_ON_ANSWER_IN_SECONDS * 1000;
    this.audio = new Audio();
    this.type = undefined;
    this.audioImage = './assets/image/audio.jpg';
    this.image = undefined;
  };

  clearTask() {
    this.type = null;
    this.image = null;
  };

  playAudio(fileName) {
    try {
      if(this.audio)
      {
        delete this.audio;
      }
      this.audio = new Audio(fileName);
      console.log({1: 'playaudio'});
	  //this.audio.setAttribute('src',fileName);
	  //this.audio.src = fileName;
      this.audio.load();
      this.audio.play();
    } catch (err) {
      console.log({err});
    }
  };

  clearTaskImage() {
    $('#task').empty();
  };

  addTaskImage(img) {
    $('#task').prepend('<img id="ImgTask" src="' + img + '" width="500" height="300" />');
  };
}

class Timer {
  constructor(test) {
    this.testStartTime = new moment();
    this.test = test;
    this.test.renderTestCountdown();
    this.testCountdown(test.leastTimeForTest);
  };

  testCountdown() {
    const countdownInterval = setInterval(() => {
      this.test.leastTimeForTest = this.test.leastTimeForTest - 1;
      this.test.renderTestCountdown();
      if (this.test.leastTimeForTest <= 0) {
        clearInterval(countdownInterval);
        //console.log({"clearCountDown": countdownInterval});
        this.onTestCountdownEnded();
      }
    }, 1000);
  };

  onTestCountdownEnded() {
    this.test.testIsEnded = true;
    if (this.test.nextTaskTimeout) {
      clearInterval(this.test.nextTaskTimeout);
      console.log({"clearTimeout из окончен тест" : this.test.nextTaskTimeout});
    }

    // this.test.task.audio.pause();
    // $('.leftBtn').delay().fadeOut(500);
    // $('.rightBtn').delay().fadeOut(500);
    // $('#task').delay().fadeOut(500);
    // $('#test_countdown').delay().fadeOut(500);
    // $('#b2').delay(1000).fadeIn(300);
    // $('#reset').delay(1000).fadeIn(300);
    // $('#backToTest').delay(1000).fadeIn(300);
    // $('#nextLevel').delay(1000).fadeIn(300);


    //$(".percent").append(`Кол-во заданий: ${this.test.amountTasks - 1}`);
  };
}

class Result {
  constructor(test) {
    this.skipped = {};
    this.passed = {};
    this.amountTasks = {};

    this.rightAnswersLevel1 = 0;
    this.wrongAnswersLevel1 = 0;
    this.rightAnswersLevel2_1 = 0;
    this.wrongAnswersLevel2_1 = 0;
    this.rightAnswersLevel2_2 = 0;
    this.wrongAnswersLevel2_2 = 0;
    this.amountTasksLevel1 = 0;
    this.amountTasksLevel2_1 = 0;
    this.amountTasksLevel2_2 = 0;
    this.test = test;
    this.passedTaskLev1 = [];
    this.passedTaskLev2_1 = [];
    this.passedTaskLev2_2 = [];
    this.allTasksInLevel1 = [];
    this.allTasksInLevel2_1 = [];
    this.allTasksInLevel2_2 = [];
  }

  setResultForLevel(level, rightAnswers, wrongAnswers, amountTasks, passedTasks, allTasksInLevel) {
    switch (level) {
      case 1: {
        // this.rightAnswersLevel1 = rightAnswers;
        // this.wrongAnswersLevel1 = wrongAnswers;
        // this.amountTasksLevel1 = amountTasks;
        // this.passedTaskLev1 = passedTasks;
        // this.allTasksInLevel1 = allTasksInLevel;
        this.amountTasks["level1"] = allTasksInLevel.length;
        this.skipped["level1"] = allTasksInLevel.length - passedTasks.length;
        this.passed["level1"] = passedTasks;
        break;
      }
      case 2: {
        // this.rightAnswersLevel2_1 = rightAnswers;
        // this.wrongAnswersLevel2_1 = wrongAnswers;
        // this.amountTasksLevel2_1 = amountTasks;
        // this.passedTaskLev2_1 = passedTasks;
        // this.allTasksInLevel2_1 = allTasksInLevel;
        this.amountTasks["level2"] = allTasksInLevel.length;
        this.skipped["level2"] = allTasksInLevel.length - passedTasks.length;
        this.passed["level2"] = passedTasks;
        break;
      }
      case 3: {
        // this.rightAnswersLevel2_2 = rightAnswers;
        // this.wrongAnswersLevel2_2 = wrongAnswers;
        // this.amountTasksLevel2_2 = amountTasks;
        // this.passedTaskLev2_2 = passedTasks;
        // this.allTasksInLevel2_2 = allTasksInLevel;
        this.amountTasks["level3"] = allTasksInLevel.length;
        this.skipped["level3"] = allTasksInLevel.length - passedTasks.length;
        this.passed["level3"] = passedTasks;
        break;
      }
    }
  }
}

$(document).ready(function () {
  const KEYCODE_LEFT_BUTTON = 37;
  const KEYCODE_RIGHT_BUTTON = 39;
  const leftButton = $('.leftBtn');
  const rightButton = $('.rightBtn');
  $('#start_counter').fadeOut();
  $('.return-tests').fadeOut();
  //getTestSettings();

  //начать тестирование
  $('#play').on('click', startTest);

  function startTest() {
    $(this).fadeOut(500);
    $('#start_counter').fadeOut();
    $('#b1').delay(1000).fadeIn(100);
    $('.next').delay(1000).fadeIn(100);
  }

  $('#next').on('click', function () {
    hideAndShowElements();

    var test = new Test();
    initEventListeners();
    var result = new Result(test);
    test.infoAboutLevel1();

    function initEventListeners() {
      document.addEventListener("keydown", onKeyDown);
      leftButton.on('click', checkButtonAnswer);
      rightButton.on('click', checkButtonAnswer);
    }

    function checkButtonAnswer() {
      test.checkAnswerProcess(this.name);
    }
    function onKeyDown(e) {
      switch (e.keyCode) {
        case KEYCODE_LEFT_BUTTON: {
          leftButton.click();
          break;
        }

        case KEYCODE_RIGHT_BUTTON: {
          rightButton.click();
          break;
        }

        default: {
          break;
        }
      }
    }

    $('#go').on('click', startLevel);

    $('#nextLevel').on('click', initNewLevel);

    function firstTimer() {
      let seconds = 3;
      hideInstruction();
      $('#start_counter').fadeIn();
      const firstTimerCountdown = setInterval(() => {
        if (seconds <= 0) {
          clearInterval(firstTimerCountdown);
          test.nextTask();
          test.timer = new Timer(test);
          //test.setIntervalForNextTask();
          test.reaction = performance.now();
          console.log(test.reaction);
        }
        console.log(seconds);
        $('#start_counter').html(seconds);
        seconds = seconds - 1;
      }, 1000);
    }

    function initNewLevel() {
      if (test.level == 3) {
        result.setResultForLevel(test.level, test.rightAnswers, test.wrongAnswers, test.amountTasks, test.passedTasks, test.tasksInTest);
        $(".percent").empty()
        $(".percent").append("Тест закончен");
        $('#nextLevel').remove();
        $(".return-tests").fadeIn();
        SendResult(result);
		const res = CalcPercentRightAnswers(result);
		addResultsToCommonTable(res);
        return;
      }
      test.maskResultBlock();

      result.setResultForLevel(test.level, test.rightAnswers, test.wrongAnswers, test.amountTasks, test.passedTasks, test.tasksInTest);
      let newLevel = test.level + 1;

      test.newLevel();
      test.setLevel(newLevel);

      switch (test.level) {
        case 1:
          test.infoAboutLevel1();
          break;
        case 2:
          test.infoAboutLevel2();
          break;
        case 3:
          test.infoAboutLevel3();
          break;
        default:
          break;
      }
    }

	function CalcPercentRightAnswers(result)
	{
		//   amountRightAnswersLevel1 = result.rightAnswersLevel1;
        //   amountRightAnswersLevel2 = result.rightAnswersLevel2_1;
        //   amountRightAnswersLevel3 = result.rightAnswersLevel2_2;
        //   amountWrongAnswersLevel1 = result.wrongAnswersLevel1;
        //   amountWrongAnswersLevel2 = result.wrongAnswersLevel2_1;
        //   amountWrongAnswersLevel3 = result.wrongAnswersLevel2_2;
        //
		// const amountTasks1 = result.amountTasksLevel1 + result.amountTasksLevel2_1 + result.amountTasksLevel2_2;
		//
		// const amountTasks = result.amountTasks.level1 + result.amountTasksLevel2_1 + result.amountTasksLevel2_2;
		//
		// const allRight =amountRightAnswersLevel1 + amountRightAnswersLevel2 + amountRightAnswersLevel3;
		// const allWrong =amountWrongAnswersLevel1+amountWrongAnswersLevel2+amountWrongAnswersLevel3;

		const percentRightAnswers1 = String(Math.ceil(result.passed.level1.filter((x) => x.answer == "right").length * 100 / result.amountTasks.level1).toPrecision(2))
		const percentRightAnswers2 = String(Math.ceil(result.passed.level2.filter((x) => x.answer == "right").length * 100 / result.amountTasks.level2).toPrecision(2))
		const percentRightAnswers3 = String(Math.ceil(result.passed.level3.filter((x) => x.answer == "right").length * 100 / result.amountTasks.level3).toPrecision(2))

		return [percentRightAnswers1, percentRightAnswers2, percentRightAnswers3];
	}
    function SendResult(result)
    {
      const rightAnswers1 = result.passed.level1.filter((x) => x.answer == "right");
      const wrongAnswers1 = result.passed.level1.filter((x) => x.answer == "wrong");

      const reactionsRight1 = getAverage(rightAnswers1, rightAnswers1.length);
      const reactionsWrong1 = getAverage(wrongAnswers1, wrongAnswers1.length);

      const rightAnswers2 = result.passed.level2.filter((x) => x.answer == "right");
      const wrongAnswers2 = result.passed.level2.filter((x) => x.answer == "wrong");

      const reactionsRight2 = getAverage(rightAnswers2, rightAnswers2.length);
      const reactionsWrong2 = getAverage(wrongAnswers2, wrongAnswers2.length);

      const rightAnswers3 = result.passed.level3.filter((x) => x.answer == "right");
      const wrongAnswers3 = result.passed.level3.filter((x) => x.answer == "wrong");

      const reactionsRight3 = getAverage(rightAnswers3, rightAnswers3.length);
      const reactionsWrong3 = getAverage(wrongAnswers3, wrongAnswers3.length);


      const reactionsWrong = result.passed.level1.filter((x) => x.answer == "wrong").reactionTime;
      $.ajax({
        async: false,
        url: "result.php",
        type: "POST",
        data: {
          amountRightAnswersLevel1: result.passed.level1.filter((x) => x.answer == "right").length,
          amountRightAnswersLevel2: result.passed.level2.filter((x) => x.answer == "right").length,
          amountRightAnswersLevel3: result.passed.level3.filter((x) => x.answer == "right").length,
          amountWrongAnswersLevel1: result.passed.level1.filter((x) => x.answer == "wrong").length,
          amountWrongAnswersLevel2: result.passed.level2.filter((x) => x.answer == "wrong").length,
          amountWrongAnswersLevel3: result.passed.level3.filter((x) => x.answer == "wrong").length,
          timeForTest: result.test.AMOUNT_TIME_FOR_TEST_IN_SECONDS,
          timeForTask: result.test.task.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS / 1000,
          passed: result.passed,
          amountTasks: result.amountTasks,
          skipped: result.skipped,
          reactionsRight1: reactionsRight1 / 1000,
          reactionsRight2: reactionsRight2 / 1000,
          reactionsRight3: reactionsRight3 / 1000,
          reactionsWrong1: reactionsWrong1 / 1000,
          reactionsWrong2: reactionsWrong2 / 1000,
          reactionsWrong3: reactionsWrong3 / 1000,
        }
      })
    }
    function getAverage(obj, count)
    {
      if(obj.lenght === 0)
      {
        return 0;
      }
      const times = obj.map(function (x) {
        return x.reactionTime;
      });

      return times.reduce((a,b) => Number(a)+Number(b)) / count;
    }

    //показать рабочую область - задания, кнопки выбора, таймер
    function ShowWorkPlace() {
      $('.leftBtn').delay(4000).fadeIn();
      $('.rightBtn').delay(4000).fadeIn();
      $('#task').delay(4000).fadeIn();
      $('#test_countdown').delay(4000).fadeIn();
    }

    function startLevel() {
      if (test.level == 0) {
        let newLevel = test.level + 1;
        test.setLevel(newLevel);
      }

      hideInstruction();

      firstTimer();
      hideAndClearStartTimer();
      ShowWorkPlace();
    };

    function hideInstruction()
    {
      $('#infoAboutLevel').delay().fadeOut();
      $('#go').delay().fadeOut();
    }

    function hideAndClearStartTimer()
    {
      $('#start_counter').delay(4000).fadeOut();
      $('#start_counter').empty();
    }
  });

  function selfRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function hideAndShowElements() {
    $('#b1').fadeOut();
    $('#start_counter').fadeOut();

    $('.info').delay(4500).fadeOut();
  }
});
function parserSettings(data)
{
	var times = JSON.parse(data);
	CAMOUNT_TIME_FOR_TEST_IN_SECONDS = times.TimeForTest;
	AMOUNT_TIME_ON_ANSWER_IN_SECONDS = times.TimeForTask;
}

function getTestSettings()
{
	$.ajax(
				{
					url: "SendSettingsFromSite.php", 
					type: "POST", 
					success: function(data) 
					{
						parserSettings(data);
					}

				});
}

function addResultsToCommonTable(result){

	$.ajax(
	{
		url: "AddCommonResult.php",
		type: "POST", 
		data: 
		 { 
			right1:result[0],
			right2:result[1],
			right3:result[2],
			result:result,
			version: "site version"
		 }
	});
}