var AMOUNT_TIME_ON_ANSWER_IN_SECONDS = 2;
var CAMOUNT_TIME_FOR_TEST_IN_SECONDS = 5;

class Test {
  constructor(options) {
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
    this.result = new Result(),
      this.rightAnswersLevel1 = 0;
    this.wrongAnswersLevel1 = 0;
    this.rightAnswersLevel2_1 = 0;
    this.wrongAnswersLevel2_1 = 0;
    this.rightAnswersLevel2_2 = 0;
    this.wrongAnswersLevel2_2 = 0;
    this.amountTasksLevel1 = 0;
    this.amountTasksLevel2_1 = 0;
    this.amountTasksLevel2_2 = 0;
    this.answersTimes;
    this.taskStartTime = undefined;
    this.passedTasks = [];
    this.reactionTime = [];
    this.tasksInTest = [];

    this.firstTime = true;
  };

  setLevel(newLevel) {
    this.level = newLevel;
    this.nextTask = this.level == 1 ? this.nextTaskLevel1 : this.nextTaskLevel2;
  };

  setIntervalForNextTask() {
    this.nextTaskTimeout = setInterval(this.nextTask.bind(this), this.task.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS);
    console.log({createdTimer: this.nextTaskTimeout});
  }

  nextTaskLevel1() {
    this.taskStartTime = performance.now();
    // const startTime = performance.now();
    // this.tasksInTest.push(this.task);
    // if (!this.taskStartTime) {
    //   this.taskStartTime = startTime;
    // } else {
    //   this.reactionTime.push((startTime - this.taskStartTime).toFixed(0));
    //   this.taskStartTime = startTime;
    //   console.log({reactionTime: this.reactionTime, task: this.task});
    // }


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
    console.log({taskFile});

    this.task.addTaskImage(this.task.image);
  };

  nextTaskLevel2(myAudio, btnFlag) {
    try {
      this.amountTasks++;
      if (this.testIsEnded) {
        return;
      }

      // if (this.task.audio) {
      //   this.task.audio.src = '';
      // }

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
  }

  checkAnswerProcess(answer) {
    const startTime = performance.now();
    const reactionTime = (startTime - this.taskStartTime).toFixed(0);
    this.taskStartTime = startTime;

    if (this.checkAnswer(answer)) {
      this.rightAnswers++;
      this.passedTasks.push({ task: this.task, answer: 'right', reactionTime });
    } else {
      this.wrongAnswers++;
      this.passedTasks.push({ task: this.task, answer: 'wrong', reactionTime });
    }

    clearInterval(this.nextTaskTimeout);
    console.log({cleareInterval: this.nextTaskTimeout});
    this.nextTaskTimeout = setInterval(this.nextTask.bind(this), this.task.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS);
    console.log({checkAnswerProcess_createdTimer: this.nextTaskTimeout});
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
      success: function (data) {
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
      console.log({1: 'playaudio'});
      this.audio.pause();
      this.audio = new Audio();
      this.audio.src = fileName;
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
        console.log({clearCountDown: countdownInterval});
        this.onTestCountdownEnded();
      }
    }, 1000);
  };

  onTestCountdownEnded() {
    this.test.testIsEnded = true;
    if (this.test.nextTaskTimeout) {
      clearInterval(this.test.nextTaskTimeout);
      console.log({this: this, timer: this.test.nextTaskTimeout});
    }

    this.test.task.audio.pause();
    $('.leftBtn').delay().fadeOut(500);
    $('.rightBtn').delay().fadeOut(500);
    $('#task').delay().fadeOut(500);
    $('#test_countdown').delay().fadeOut(500);
    $('#b2').delay(1000).fadeIn(300);
    $('#reset').delay(1000).fadeIn(300);
    $('#backToTest').delay(1000).fadeIn(300);
    $('#nextLevel').delay(1000).fadeIn(300);

    $(".percent").empty();

    $(".percent").append(`Кол-во правильных ответов: ${this.test.rightAnswers}<br>`);
    $(".percent").append(`Кол-во ошибочных ответов: ${this.test.wrongAnswers}<br>`);
    //$(".percent").append(`Кол-во заданий: ${this.test.amountTasks - 1}`);

    console.log({ passed: this.test.passedTasks, tasks: this.test.tasksInTest });
  };
}

class Result {
  constructor(test) {
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
  }

  setResultForLevel(level, rightAnswers, wrongAnswers, amountTasks) {
    switch (level) {
      case 1: {
        this.rightAnswersLevel1 = rightAnswers;
        this.wrongAnswersLevel1 = wrongAnswers;
        this.amountTasksLevel1 = amountTasks;
        break;
      }
      case 2: {
        this.rightAnswersLevel2_1 = rightAnswers;
        this.wrongAnswersLevel2_1 = wrongAnswers;
        this.amountTasksLevel2_1 = amountTasks;
        break;
      }
      case 3: {
        this.rightAnswersLevel2_2 = rightAnswers;
        this.wrongAnswersLevel2_2 = wrongAnswers;
        this.amountTasksLevel2_2 = amountTasks;
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

    var test = new Test({leftbutton: '#leftbutton'});

    var result = new Result(test);
    test.infoAboutLevel1();

    function initEventListeners() {
      document.addEventListener("keydown", onKeyDown);
      leftButton.on('click', checkLeftButtonAnswer);
      rightButton.on('click', checkRightButtonAnswer);
    }

    function checkLeftButtonAnswer() {
      test.checkAnswerProcess(this.name);
    }

    function checkRightButtonAnswer() {
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
          test.setIntervalForNextTask();
        }
        console.log(seconds);
        $('#start_counter').html(seconds);
        seconds = seconds - 1;
      }, 1000);
    }

    function initNewLevel() {
      if (test.level == 3) {
        result.setResultForLevel(test.level, test.rightAnswers, test.wrongAnswers, test.amountTasks);
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

      result.setResultForLevel(test.level, test.rightAnswers, test.wrongAnswers, test.amountTasks);
      let newLevel = test.level + 1;
      test = new Test();
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

    function CalcPercentRightAnswers(result) {
      amountRightAnswersLevel1 = result.rightAnswersLevel1;
      amountRightAnswersLevel2 = result.rightAnswersLevel2_1;
      amountRightAnswersLevel3 = result.rightAnswersLevel2_2;
      amountWrongAnswersLevel1 = result.wrongAnswersLevel1;
      amountWrongAnswersLevel2 = result.wrongAnswersLevel2_1;
      amountWrongAnswersLevel3 = result.wrongAnswersLevel2_2;

      const amountTasks = result.amountTasksLevel1 + result.amountTasksLevel2_1 + result.amountTasksLevel2_2;
      const allRight = amountRightAnswersLevel1 + amountRightAnswersLevel2 + amountRightAnswersLevel3;
      const allWrong = amountWrongAnswersLevel1 + amountWrongAnswersLevel2 + amountWrongAnswersLevel3;

      return String(Math.ceil(allRight * 100 / amountTasks).toPrecision(2));
    }

    function SendResult(result) {
      $.ajax({
        async: false,
        url: "result.php",
        type: "POST",
        data: {
          amountRightAnswersLevel1: result.rightAnswersLevel1,
          amountRightAnswersLevel2: result.rightAnswersLevel2_1,
          amountRightAnswersLevel3: result.rightAnswersLevel2_2,
          amountWrongAnswersLevel1: result.wrongAnswersLevel1,
          amountWrongAnswersLevel2: result.wrongAnswersLevel2_1,
          amountWrongAnswersLevel3: result.wrongAnswersLevel2_2,
          timeForTest: result.test.AMOUNT_TIME_FOR_TEST_IN_SECONDS,
          timeForTask: result.test.task.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS / 1000
        }
      })
    }

    //оказать рабочую область - задания, кнопки выбора, таймер
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

      initEventListeners();

      // TODO: refactor this function

      firstTimer();
      $('#start_counter').delay(4000).fadeOut();
      $('#start_counter').empty();
      ShowWorkPlace();
    };

    function hideInstruction() {
      $('#infoAboutLevel').delay().fadeOut();
      $('#go').delay().fadeOut();
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
function parserSettings(data) {
  var times = JSON.parse(data);
  CAMOUNT_TIME_FOR_TEST_IN_SECONDS = times.TimeForTest;
  AMOUNT_TIME_ON_ANSWER_IN_SECONDS = times.TimeForTask;
}

function getTestSettings() {
  $.ajax(
    {
      url: "SendSettingsFromSite.php",
      type: "POST",
      success: function (data) {
        parserSettings(data);
      }

    });
}

function addResultsToCommonTable(result) {

  $.ajax(
    {
      url: "AddCommonResult.php",
      type: "POST",
      data: {
        result: result,
        version: "site version"
      }
    });
}