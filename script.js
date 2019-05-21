class Test{

  testStartTime;
  nextTaskTimeout;
  level;
  task;

  constructor(){
    this.AMOUNT_TIME_FOR_TEST_IN_SECONDS = 5;
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

      this.rightAnswersLevel1 = 0;
      this.wrongAnswersLevel1 = 0;
      this.rightAnswersLevel2_1 = 0;
      this.wrongAnswersLevel2_1 = 0;
      this.rightAnswersLevel2_2 = 0;
      this.wrongAnswersLevel2_2 = 0;
      this.amountTasksLevel1 = 0;
      this.amountTasksLevel2_1 = 0;
      this.amountTasksLevel2_2 = 0;
  };

  setLevel(newLevel)
  {
      this.level = newLevel;
      this.nextTask = this.level == 1 ? this.nextTaskLevel1 : this.nextTaskLevel2;
  };

  setIntervalForNextTask()
  {
      this.nextTaskTimeout = setInterval(this.nextTask.bind(this), this.task.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS);
  }

  nextTaskLevel1() {
    console.log("next task!!!");
    this.amountTasks++;
    if (this.testIsEnded) {
      return;
    }

    if (this.task.audio) {
      this.task.audio.pause();
    }

    this.task.clearTaskImage();
    this.task.clearTask();
    let index = this.selfRandom(0, this.tasks.length - 1);

    const task = this.tasks[index];
    const taskFile = this.tasks[index].fileName;
    if (taskFile === null) {
      return;
    }

    let taskFileImage = taskFile;
    if (taskFile.split('.')[1] === 'mp3') {
      this.task.playAudio(taskFile);
      this.task.type = task.type;
      this.task.image = this.task.audioImage;
    }
    else{
      this.task.image = taskFileImage;
      this.task.type = task.type;
    }

    this.task.addTaskImage(this.task.image);
  };

  nextTaskLevel2(myAudio, btnFlag) {
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

      var taskImg = this.images[indexImage].fileName;
      var taskType = this.level == 2 ? this.images[indexImage].type : this.audios[indexAudio].type;
      var taskAudio = this.audios[indexAudio].fileName;

      if (taskImg == null) {
          return;
      }

      this.task.addTaskImage(taskImg);

      this.task.playAudio(taskAudio);
      this.task.type = taskType;
  }

  checkAnswerProcess(answer) {
    if (this.checkAnswer(answer)) {
      this.rightAnswers++;
    }
    else
    {
        this.wrongAnswers ++;
    }

    clearTimeout(this.nextTaskTimeout);
      this.nextTaskTimeout = setInterval(this.nextTask.bind(this), this.task.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS);
      this.nextTask();
  }

  checkAnswer(btnName) {
    return btnName === this.task.type;
  }

  getDataTest() {
    this.tasks = new Array(
        {fileName: 'taskC1.jpg', type: "cat"},
        {fileName: 'taskC2.jpg', type: "cat"},
        {fileName: 'taskC3.jpg', type: "cat"},
        {fileName: 'taskC4.jpg', type: "cat"},
        {fileName: 'taskD5.jpg', type: "dog"},
        {fileName: 'taskD6.jpg', type: "dog"},
        {fileName: 'taskD7.jpg', type: "dog"},
        {fileName: 'taskD8.jpg', type: "dog"},
        {fileName: '01001.mp3', type: "dog"},
        {fileName: '04453.mp3', type: "cat"},
        {fileName: '01004.mp3', type: "dog"},
        {fileName: '00988.mp3', type: "cat"}
    );

    this.images = new Array(
        {fileName: 'taskC1.jpg', type: "cat"},
        {fileName: 'taskC2.jpg', type: "cat"},
        {fileName: 'taskC3.jpg', type: "cat"},
        {fileName: 'taskC4.jpg', type: "cat"},
        {fileName: 'taskD5.jpg', type: "dog"},
        {fileName: 'taskD6.jpg', type: "dog"},
        {fileName: 'taskD7.jpg', type: "dog"},
        {fileName: 'taskD8.jpg', type: "dog"},
    );

    this.audios = new Array(
        {fileName: '01001.mp3', type: "dog"},
        {fileName: '04453.mp3', type: "cat"},
        {fileName: '01004.mp3', type: "dog"},
        {fileName: '00988.mp3', type: "cat"}
    );
  };


  selfRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  renderTestCountdown() {
    this.testCountdownElement.html(`Осталось ${this.leastTimeForTest} секунд`);
  };

  infoAboutLevel1()
  {
      $(".instruction").empty();
      $('#infoAboutLevel').delay(1000).fadeIn(300);
      $('#go').delay(1000).fadeIn(300);
      $(".instruction").append("Это первый уровень тестирования. <br> " +
          "Перед вами будут представлены картинки с кошками и собаками. Вам необходимо идентифицировать животное. "+
          "Вы можете выбирать ответ с помощью клавиш клавиатуры <- и ->, а также кликом по соответсвующим кнопкам на экране.<br><br>"+
          `На выполнение задания отводится ${this.AMOUNT_TIME_FOR_TEST_IN_SECONDS} секунд`);
  }

  infoAboutLevel2()
  {
        $(".instruction").empty();
        $('#infoAboutLevel').delay(1000).fadeIn(300);
        $('#go').delay(1000).fadeIn(300);
        $(".instruction").append("Это второй уровень тестирования. <br> " +
            "Вам все также необходимо идентифицировать животное. "+
            "Но на этот раз перед вами будет и картинка и звук одновременно. Выбирать необходимо то животное, которое изображено на картинке. Правила выбора ответа остаются такими же<br><br>"+
            `На выполнение задания отводится ${this.AMOUNT_TIME_FOR_TEST_IN_SECONDS} секунд`);
  }

  infoAboutLevel3()
  {
        $(".instruction").empty();
        $('#infoAboutLevel').delay(1000).fadeIn(300);
        $('#go').delay(1000).fadeIn(300);
        $(".instruction").append("Это третий уровень тестирования. <br> " +
            "Вам все также необходимо идентифицировать животное. "+
            "Но на этот раз перед вами будет и картинка и звук одновременно. Выбирать необходимо то животное, которое вы слышите. Правила выбора ответа остаются такими же<br><br>"+
            `На выполнение задания отводится ${this.AMOUNT_TIME_FOR_TEST_IN_SECONDS} секунд`);
  }

  maskResultBlock()
  {
        $('#b2').delay().fadeOut();
        $('#reset').delay().fadeOut();
        $('#backToTest').delay().fadeOut();
        $('#nextLevel').delay().fadeOut();
  }

  showResultBlock()
  {
        $('#b2').delay().fadeIn(300);
        $('#reset').delay().fadeIn(300);
        $('#backToTest').delay().fadeIn(300);
        $('#nextLevel').delay().fadeIn(300);
  }

}

class Task{
  type;
  audioImage = './audio.jpg';
  image;
  constructor(){
    this.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS = 2 * 1000;
    this.audio = new Audio;
  };

  clearTask(){
    this.type = null;
    this.image = null;
  };

  playAudio(fileName) {
    this.audio.src = fileName;
    this.audio.play();
  };

  clearTaskImage() {
    $('#task').empty();
  };

  addTaskImage(img) {
    $('#task').prepend('<img id="ImgTask" src="' + img + '" width="500" height="300" />');
  };
}

class Timer{
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
      if (this.test.leastTimeForTest <= 0 ) {
        clearInterval(countdownInterval);
        this.onTestCountdownEnded();
      }
    }, 1000);
  };

  onTestCountdownEnded() {
    this.test.testIsEnded = true;
    if (this.test.nextTaskTimeout) {
      clearTimeout(this.test.nextTaskTimeout);
    }

    this.test.task.audio.pause();
      $('.leftBtn').delay(1000).fadeOut(500);
      $('.rightBtn').delay(1000).fadeOut(500);
      $('#task').delay(1000).fadeOut(500);
      $('#test_countdown').delay(1000).fadeOut(500);
      $('#b2').delay(1000).fadeIn(300);
      $('#reset').delay(1000).fadeIn(300);
      $('#backToTest').delay(1000).fadeIn(300);
      $('#nextLevel').delay(1000).fadeIn(300);

      $(".percent").empty();

      $(".percent").append(`Кол-во правильных ответов: ${this.test.rightAnswers}<br>`);
      $(".percent").append(`Кол-во ошибочных ответов: ${this.test.wrongAnswers}<br>`);
      $(".percent").append(`Кол-во заданий: ${this.test.amountTasks}`);

      switch (this.test.level) {
          case 1: {
              this.test.rightAnswersLevel1 = this.test.rightAnswers;
              this.test.wrongAnswersLevel1 = this.test.wrongAnswers;
              this.test.amountTasksLevel1 = this.test.amountTasks;
          }
          case 2: {
              this.test.rightAnswersLevel2_1 = this.test.rightAnswers;
              this.test.wrongAnswersLevel2_1 = this.test.wrongAnswers;
              this.test.amountTasksLevel2_1 = this.test.amountTasks;
          }
          case 3: {
              this.test.rightAnswersLevel2_2 = this.test.rightAnswers;
              this.test.wrongAnswersLevel2_2 = this.test.wrongAnswers;
              this.test.amountTasksLevel2_2 = this.test.amountTasks;
          }
      }

      this.test.rightAnswers = 0;
      this.test.wrongAnswers = 0;
      this.test.amountTasks = 0;
  };
}

class Result{
    constructor(test)
    {
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

    setResultForLevel(level, rightAnswers, wrongAnswers, amountTasks)
    {
        switch (level) {
            case 1: {
                this.rightAnswersLevel1 = rightAnswers;
                this.wrongAnswersLevel1 = wrongAnswers;
                this.amountTasksLevel1 = amountTasks;
            }
            case 2: {
                this.rightAnswersLevel2_1 = rightAnswers;
                this.wrongAnswersLevel2_1 = wrongAnswers;
                this.amountTasksLevel2_1 = amountTasks;
            }
            case 3: {
                this.rightAnswersLevel2_2 = rightAnswers;
                this.wrongAnswersLevel2_2 = wrongAnswers;
                this.amountTasksLevel2_2 = amountTasks;
            }
        }
    }
}

$(document).ready(function () {
  const KEYCODE_LEFT_BUTTON = 37;
  const KEYCODE_RIGHT_BUTTON = 39;
  const leftButton = $('.leftBtn');
  const rightButton = $('.rightBtn');
  //начать тестирование
  $('#play').on('click', startTest);

  function startTest() {
    $(this).fadeOut(500);
    $('#b1').delay(1000).fadeIn(100);
    $('.next').delay(1000).fadeIn(100);
  }

  $('#next').on('click', function () {
    hideAndShowElements();

      var test = new Test();

      let result = new Result(test);
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

      $('#go').on('click',startLevel);

      $('#nextLevel').on('click', initNewLevel);

      function initNewLevel()
      {
          if(test.level == 3)
          {
              $(".instruction").empty()
              $(".instruction").append("Тест закончен");
              $('#nextLevel').disabled();
              return;
          }
          test.maskResultBlock();
          result.setResultForLevel(test.level, test.rightAnswers, test.wrongAnswers, test.amountTasks);

          let newLevel = test.level + 1;
          test = new Test();
          test.setLevel(newLevel);

          switch (test.level) {
              case 1: test.infoAboutLevel1();
              case 2: test.infoAboutLevel2();
              case 3: test.infoAboutLevel3();
          }
      }

      function startLevel()
      {
          if(test.level == 0)
          {
              let newLevel = test.level + 1;
              test.setLevel(newLevel);
          }

          $('#infoAboutLevel').delay(1000).fadeOut();
          $('#go').delay(1000).fadeOut();
          $('.leftBtn').delay(1000).fadeIn();
          $('.rightBtn').delay(1000).fadeIn();
          $('#task').delay(1000).fadeIn();
          $('#test_countdown').delay(1000).fadeIn(500);


          initEventListeners();
          // TODO: refactor this function

          test.nextTask();
          test.timer = new Timer(test);
          test.setIntervalForNextTask();
      };
  });


  function selfRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //получить данные теста (задания)
  function getDataTest() {
    var tasks = new Array(
      {fileName: 'taskC1.jpg', fl: 0},
      {fileName: 'taskC2.jpg', fl: 0},
      {fileName: 'taskC3.jpg', fl: 0},
      {fileName: 'taskC4.jpg', fl: 0},
      {fileName: 'taskD5.jpg', fl: 1},
      {fileName: 'taskD6.jpg', fl: 1},
      {fileName: 'taskD7.jpg', fl: 1},
      {fileName: 'taskD8.jpg', fl: 1},
      {fileName: '01001.mp3', fl: 1},
      {fileName: '04453.mp3', fl: 0},
      {fileName: '01004.mp3', fl: 1},
      {fileName: '00988.mp3', fl: 0}
    );

    var images = new Array(
      {fileName: 'taskC1.jpg', fl: 0},
      {fileName: 'taskC4.jpg', fl: 0},
      {fileName: 'taskD5.jpg', fl: 1},
      {fileName: 'taskD8.jpg', fl: 1}
    );

    var audios = new Array(
      {fileName: '01001.mp3', fl: 1},
      {fileName: '04453.mp3', fl: 0},
      {fileName: '01004.mp3', fl: 1},
      {fileName: '00988.mp3', fl: 0}
    );

    return {
      tasks: tasks,
      images: images,
      audios: audios
    };
  }

  function hideAndShowElements() {
    $('#b1').fadeOut();

    $('.info').delay(4500).fadeOut();


  }


  /*setTimeout(function()
   {
   var data=$(".result").html();
   level1=data.indexOf("first") + 1;
   level2=data.indexOf("second") + 1;
   level3=data.indexOf("third") + 1;
   $('.wrap').fadeIn(500);
   $('.attempt b').text(atm);

   if(level1!=0)
   {
   end=7;
   $('#circle').text(0+'/'+(end-3));
   max=15;
   print_table(4);
   test();
   }
   if(level2!=0)
   {
   end=11;
   $('#circle').text(0+'/'+(end-3));
   max=24;
   print_table(5);
   test();
   }
   if(level3!=0)
   {
   end=14;
   $('#circle').text(0+'/'+(end-3));
   max=35;
   print_table(6);
   test();
   }
   },5500); */
});

function getAjax() {
  $.ajax(
    {
      url: "level1.php",
      type: "POST",
      data: {
        act: $('#levels').val()

      },
      success: function (data) {
        $(".result").append(data);
      }
    });
}
