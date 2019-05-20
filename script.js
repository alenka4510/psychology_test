class Test{

  testStartTime;
  nextTaskTimeout;
  level;
  task;

  constructor(){
    this.AMOUNT_TIME_FOR_TEST_IN_SECONDS = 2;
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
    this.nextTaskWithContext = this.nextTask.apply(this);
    this.nextTaskTimeout = setInterval(this.nextTask.bind(this), this.task.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS);
  };

  nextTask() {
    console.log("next task!!!");
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
    //this.nextTaskTimeout = setTimeout(this.nextTask.bind(this), this.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS);

   /* this.nextTaskTimeout = setTimeout(function() {
      this.nextTask();
    }.bind(this), this.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS);*/
    //this.nextTaskTimeout = setTimeout(this.nextTaskWithContext, this.task.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS);
  };

  checkAnswerProcess(answer) {
    if (this.checkAnswer(answer)) {
      this.rightAnswers++;
    }

    clearTimeout(this.nextTaskTimeout);
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
        {fileName: 'taskC4.jpg', type: "cat"},
        {fileName: 'taskD5.jpg', type: "dog"},
        {fileName: 'taskD8.jpg', type: "dog"}
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

}

class Task{
  type;
  audioImage = './audio.jpg';
  image;
  constructor(){
    this.AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS = 3 * 1000;
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

      $(".percent").html(`Количество правильных ответов: ${rightAnswers}`);

    //$('#result').html(`Количество правильных ответов: ${this.test.rightAnswers}`);
    console.log('test time ended');
  };
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
    $('#b1').delay(1000).fadeIn(300);
    $('.next').delay(1000).fadeIn(300);
  }

  $('#next').on('click', function () {
    hideAndShowElements();

    test = new Test();
    initEventListeners();
    // TODO: refactor this function

    index = 0;							//индекс задачи
    var col = 20;
    var level = $('#levels').val();		//уровень теста

    test.level = $('#levels').val();
    test.nextTask();
    test.timer = new Timer(test);

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

    function nextTaskLevel2(myAudio, btnFlag) {
      if (myAudio != null)
        myAudio.pause();

      index = selfRandom(0, images.length - 1);
      indexAudio = selfRandom(0, images.length - 1);

      clearTaskImage

      var taskImg = images[index].fileName;
      var taskAudio = audios[indexAudio].fileName;

      if (taskImg == null) {
        return;
      }

      addTaskImage(taskImg);

      playAudio(taskAudio);

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
    $('#b1').fadeOut(500);

    $('.info').delay(4500).fadeOut(500);

    $('.leftBtn').delay(1000).fadeIn(500);
    $('.rightBtn').delay(1000).fadeIn(500);
    $('#task').delay(1000).fadeIn(500);
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
