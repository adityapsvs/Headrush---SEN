// meteor add session accounts-ui accounts-password reactive-var

ThisQuiz = new Mongo.Collection("quizzes");
ThisResponse = new Mongo.Collection("responses");


if (Meteor.isClient) {
  var nik = 0;
 var responseID = "4boSZuvFYmWCEpKon";

  var quizQuestions = [];

  changeAnswer = function(question){
     Meteor.call("getResponse", question, function(error, result){
      if (error)
        console.log(error.reason);
      else {
        if (result)
          $('input[name=questionAnswer][value=' + result + ']').prop('checked',true);
        else
          $('input[name=questionAnswer]').prop('checked',false);
      }
    });
  }

  /* **************************************************************************************************** */
  
  /*Template.scorecard.onRendered(function(){
    Meteor.call("checkAnswer")
  })*/
  
  
  
  /* ******************************************************************************************************  */

  Template.questionSelect.onCreated( function() {
    this.time_left = new ReactiveVar(1200);
  });

  Template.questionSelect.onRendered( function() {

    var self = this;

    Meteor.call("getQuiz", function(error, result){
      if (error)
        console.log(error.reason);
      else {
        quizQuestions = result;
        Session.set('selectedQuestion', '1');
        changeAnswer('1');
      }
    });

    Meteor.call("getTimer", function(error, result){
      if (error)
        console.log(error.reason);
      else {
        self.time_left.set(result);
      }
    });

    Meteor.setInterval( function() {self.time_left.set(self.time_left.get() - 1);} , 1000 );
  //  Meteor.setInterval( function() {Meteor.call('setTimer', self.time_left.get())} , 5000 );
  });

  Template.questionSelect.events({
    'click input': function( event,template ) {
      Session.set('selectedQuestion', event.target.value);
      changeAnswer(event.target.value);
      console.log("Hi hcjh");
    }
  });

  Template.questionSelect.helpers({
    time_left: function() {
      var time = Template.instance().time_left.get();
      var minutes = ((Math.floor(time/60) < 10) ? '0' : '') + Math.floor(time/60);
      var seconds = ((time%60 < 10) ? '0' : '') + (time%60);
      return minutes+":"+seconds;
    }
  }); 

  /* **************************************************************************************************** */
  
  Template.questionShow.events({
    'click input': function( event,template ) {
      Meteor.call('setResponse', parseInt(Session.get('selectedQuestion')) , event.target.value );
      console.log("Found");
    },

    'click #onsubmitbutton' :function(){
    
      nik=1;
      console.log("nik kjncksj "+nik);
  responseID = Meteor.user().profile.current_response_id;
  console.log(responseID);
  var response = ThisResponse.findOne(responseID);
  var userId = Meteor.userId();
  var answer = eval('response.answers.' + userId);
  // console.log(response);
  // console.log(userId);
  // console.log(answer);3
  // console.log(answer[1]);
  
  var currentQuiz=response.quizID;
 // console.log(currentQuiz);
  var correctOption=(ThisQuiz.findOne(currentQuiz));
  var cor_array=[];
  for(var i=0;i<2;i++){
    var correct=correctOption.quiz[i];
    var cor=correct.answer;
    //console.log(correct);
    var cor='option'+cor;
    cor_array[i]=correct.cor;
    //console.log(cor);
    console.log("nik "+nik);
  }
  //var correct=correctOption.quiz[0].answer;
  
  for(var i=0;i<2;i++)
  {
    if(answer[i+1]===cor_array[i])
    {
      response.score+=10;
    
    }
  }
  console.log(response.score);

  /*var userAnswer= getResponse(question);
  if(userAnswer===correctOption)
  {
    response.score+=10;
    console.log(response.score);
  }*/
  }
  }); 

  Template.questionShow.helpers({
    questionData: function() {
      return quizQuestions[parseInt(Session.get('selectedQuestion')) - 1];
    },
  

  });   

// Template.scoreCard.events({
//   function(){
//     console.log(responseID);
//      var response = ThisResponse.findOne(responseID);
//   var userId = Meteor.userId();
//   var answer = eval('response.answers.' + userId);
//   console.log(response);
//   console.log(userId);
//   console.log(answer);
//   console.log(answer[1]);
  
//   var currentQuiz=ThisQuiz.findOne();
//  // console.log(currentQuiz);
//   var correctOption=(ThisQuiz.findOne(currentQuiz));
//   }
    
// });

Template.scoreCard.events({
  'click #onsubmitbutton' :function(){
    console.log("going Here");
      Meteor.call("getQuestionSet", function(error, result){
      if (error){
        //console.log("Chu");
        console.log(error.reason);
        
      }
      else {
        //console.log('Cha');
       // console.log(result);
        //quizQuestions = result;
        Session.set('selectedScore', result);
        // console.log('sahi hai '+Session.get('selectedScore'));
        // console.log(result[0].question);
        // console.log("heeeeeelllllll"+ Session.get('selectedScore')[0].question);
      }
    });

      Meteor.call("getResponseSet", function(error, result){
      if (error){
        //console.log("Chu");
        console.log(error.reason);
        
      }
      else {
        //console.log('Cha');
        //console.log(result);
        //quizQuestions = result;
        console.log('result is '+result[1]);
        Session.set('selectedScore1', result);
        //console.log('sahi hai '+Session.get('selectedScore1'));
        //console.log(result[0].question);
        console.log("ssssssssssss"+ Session.get('selectedScore1')[1]);
      }
    });

      Meteor.call("getActualScore", function(error, result){
      if (error){
        //console.log("Chu");
        console.log(error.reason);
        
      }
      else {
        //console.log('Cha');
        //console.log(result);
        //quizQuestions = result;
        //console.log('result is '+result[1]);
        Session.set('selectedScore2', result);
        //console.log('sahi hai '+Session.get('selectedScore1'));
        //console.log(result[0].question);
        console.log("aaasssssss"+ Session.get('selectedScore2'));
      }
    });

  }
});

  Template.scoreCard.helpers({
  questionData: function(){
    // return {k1 : Session.get('selectedScore')[0], k2 : Session.get('selectedScore1')[1]};
     var arr1=[];
    var arr2=[];
    var arr3=[];
    var arr4=[];
    var arr5=[];
     var arr6=[];
     var arr7 = [];
     var arr8=[];
     var arrayFinal = [];
    for(var i=0;i<2;i++)
    {
      arr1[i]=Session.get('selectedScore')[i].question;
    //  console.log('arr1 '+arr1[i]);
      arr2[i]=Session.get('selectedScore')[i].option1;
      arr3[i]=Session.get('selectedScore')[i].option2;
      arr4[i]=Session.get('selectedScore')[i].option3;
      arr5[i]=Session.get('selectedScore')[i].option4;
      arr6[i]=Session.get('selectedScore')[i].answer;
   //   console.log('arr2 '+arr2[i]);
       arr7[i]=Session.get('selectedScore1')[i+1];

       arr8[i]=Session.get('selectedScore2')[i];
       console.log('arr8 '+arr8[i]);
       var obj  = {arr1: arr1[i] , arr2: arr2[i], arr3: arr3[i], arr4: arr4[i], arr5: arr5[i], arr6: arr6[i], arr7: arr7[i], arr8: arr8[i]};
       arrayFinal.push(obj);


     }

     console.log("here....................",arrayFinal);
     //return {k1 : Session.get('selectedScore')[0], k2 : Session.get('selectedScore1')[1]};
     console.log('final............. '+arrayFinal[0].arr1);
     return arrayFinal;
    //return {question : 'Hi', option1: 'Hellow'};
  },

  'getTotalScore': function() {
    return Session.get('selectedScore2')[2];
  }

  }); 


   


  /* **************************************************************************************************** */

  Template.quizSelect.events({  
    "submit .quizParameters": function (event) {
      event.preventDefault();
      var selectedType =  event.target.quizType.value;
      var selectedCategory =  event.target.quizCategory.value;
      Meteor.call("createResponse", selectedType, selectedCategory);
    }
  });

  /* **************************************************************************************************** */
}

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

// Router.route('/scoreCard', {
//  name: 'scoreCard',
//   template: 'scoreCard'
// });



Router.route('/', function () {
  if (! Meteor.userId()) { 
    this.render('login', {to:"template1"});
    this.render('emptyTemplate', {to:"template2"}); 
  }
  else if (Meteor.user().profile.current_response_id == '') {
    this.render('quizSelect', {to:"template1"});
    this.render('emptyTemplate', {to:"template2"});

    //console.log("hello"+nik);
  }


  else  {
    this.render('questionSelect', {to:"template1"});
    this.render('questionShow', {to:"template2"});
  }

console.log("route "+ nik);
  if (! Meteor.userId()) { 
    this.render('login', {to:"template1"});
    this.render('emptyTemplate', {to:"template2"}); 
  }

  else{
    if(nik ==0 ){
      this.render('scoreCard', {to:"template1"});
    this.render('emptyTemplate', {to:"template2"});
    }

    else{
      this.render('questionSelect', {to:"template1"});
    this.render('questionShow', {to:"template2"});
    }
  }
});

  /* **************************************************************************************************** */

if(Meteor.isServer){

  Accounts.onCreateUser(function(options, user) {
    user.profile = {};
    user.profile.current_response_id = "";
    user.stats = [];
    if (options.profile)
      user.profile = options.profile;
    return user;
  });

Meteor.methods({

  getResponseSet: function (){
    // var responseID = '4boSZuvFYmWCEpKon';
    // //var responseID = Meteor.user().profile.current_response_id;
    // //console.log(responseID);
    // var quizID = ThisResponse.findOne(responseID).quizID;
    // //console.log(quizID);
    // var randomQuiz = ThisQuiz.findOne(quizID);
    // //console.log(randomQuiz);
    // var quizQuestions = randomQuiz.quiz;
    // console.log('Here I am '+quizQuestions);
    // return quizQuestions;

  //var responseID = Meteor.user().profile.current_response_id;
  //console.log(responseID);
  var responseID = '4boSZuvFYmWCEpKon';
  var response = ThisResponse.findOne(responseID);
 
  //var userId = Meteor.userId();
  var userId = 'TifZjF936CPjmBxB7';
  console.log('User '+userId);
  
  var answer = eval('response.answers.' + userId);
  return answer;


  },

  getQuestionSet: function(){
    var responseID = '4boSZuvFYmWCEpKon';
  // var responseID = Meteor.user().profile.current_response_id;

  //console.log(responseID);
  var response = ThisResponse.findOne(responseID);
  var userId = Meteor.userId();
  
  //var answer = eval('response.answers.' + userId);

   var currentQuiz=response.quizID;
 // console.log(currentQuiz);
  var correctOption=(ThisQuiz.findOne(currentQuiz));
  var quizQuestions = correctOption.quiz;
  return quizQuestions;
  
},

  getActualScore: function(){
    //responseID = Meteor.user().profile.current_response_id;
    var eachScore = [];
    var responseID = '4boSZuvFYmWCEpKon';
  //console.log(responseID);
  var response = ThisResponse.findOne(responseID);
  //var userId = Meteor.userId();
  var userId = 'TifZjF936CPjmBxB7';

  
  var answer = eval('response.answers.' + userId);

   var currentQuiz=response.quizID;
 // console.log(currentQuiz);
  var correctOption=(ThisQuiz.findOne(currentQuiz));
  var quizQuestions = correctOption.quiz;
  //return quizQuestions;
  var cor_array=[];
  var score=0;
  for(var i=0;i<2;i++){
    var correct=correctOption.quiz[i];
    var cor=correct.answer;
    var p='option'+cor;
    //console.log(correct);
    var cor='option'+cor;
    cor_array[i]=eval('correct.'+p);
    console.log(cor_array[i]);
    //console.log("nik "+nik);
  }
  //var correct=correctOption.quiz[0].answer;
  
  for(var i=0;i<2;i++)
  {
    if(answer[i+1]===cor_array[i])
    {
      eachScore[i] = 10;
      score+=10;
    
    }

    else{
      eachScore[i] = 0;
    }
  }

  response.score.userId = score;
  eachScore[2] = score;
  console.log('b..............'+eachScore[2]);
  //Session.set('score', score);
  console.log(response.score.userId);


  return eachScore;
},

  getQuiz: function (){
    var responseID = Meteor.user().profile.current_response_id;
    var quizID = ThisResponse.findOne(responseID).quizID;
    var randomQuiz = ThisQuiz.findOne(quizID);
    var quizQuestions = randomQuiz.quiz;
    for (var i=0 ; i<quizQuestions.length ; i++){
      delete quizQuestions[i]["answer"];
    }
    return quizQuestions;
  },

  getRandomQuizID: function(category){
    var randomQuiz = ThisQuiz.find({category:category}).fetch();
    randomQuiz = randomQuiz[Math.floor(Math.random() * randomQuiz.length)];
    return randomQuiz._id;
  },

  createResponse: function(type, category){
    if (! Meteor.userId()) { throw new Meteor.Error('not-authorized'); }

    var quizID = Meteor.call('getRandomQuizID', category);

    var responseID = ThisResponse.insert({
      userID: [Meteor.userId()],
      quizID: quizID,
      type: type,
      answers: {[Meteor.userId()]: {}},
      time_left: 1200,
      score: {},
      conductedAt: new Date()
    });

    Meteor.users.update(Meteor.user(), {$set: {"profile.current_response_id": responseID }});
  },

  setResponse: function (question, answer){
    var responseID = Meteor.user().profile.current_response_id;
    var user = Meteor.userId();
    ThisResponse.update(responseID, {$set: {['answers.' + user + '.' + question]: answer}});
  },

  getResponse: function(question){
    var responseID = Meteor.user().profile.current_response_id;
    var user = Meteor.userId();
    var response = ThisResponse.findOne(responseID).answers;
    var answer = eval('response.' + user + '[' + question + ']');
  console.log(answer);
    return answer;
  },

  setTimer: function(new_time){
    var responseID = Meteor.user().profile.current_response_id;
    var response = ThisResponse.findOne(responseID);
    if (response.time_left > new_time)
      ThisResponse.update(response._id, {$set: {time_left: new_time}});
  },

  getTimer: function(){
    var responseID = Meteor.user().profile.current_response_id;
    return ThisResponse.findOne(responseID).time_left;
  }
  
  /*checkAnswer: function(question){
  var responseID = Meteor.user().profile.current_response_id;
  var response = ThisResponse.findOne(responseID);
  var answer = eval('response.' + user)
  
  var currentQuiz=response.quizID;
  var correctOption=(quizzes.find(currentQuiz)).quiz[0].answer;

  var userAnswer= getResponse(question);
  if(userAnswer===correctOption)
  {
    response.score+=10;
    return true;
  }
  }*/

});
}
