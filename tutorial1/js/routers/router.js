var WorkSpace = Backbone.Router.extend({

  routes : {
    '*filter' : 'setFilter'
  },

  setFilter : function (param) {
    app.TodoFilter = param || '';

    // コレクションのイベントを発生させて、AppViewが検知する
    app.Todos.trigger('filter');
  }

});

app.TodoRouter = new WorkSpace();
Backbone.history.start();