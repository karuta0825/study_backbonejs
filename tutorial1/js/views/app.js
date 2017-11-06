var app = app || {};


// ハンドラーなのか、プライベートメソッドなのかを関数名に入れると
// わかりやすいね。
app.AppView = Backbone.View.extend({

  el : '#todoapp',

  statsTemplate : _.template( $('#stats-template').html() ),

  events : {
    'keypress #new-todo' : 'createOnEnter',
    'click #clear-completed' : 'clearCompleted',
    'click #toggle-all' : 'toggleAllComplete'
  },

  initialize : function() {

    this.allCheckbox = this.$('#toggle-all')[0];　//これか！
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    // いつ発生すのかresetは？
    // localStorageからリストデータが読み込まれたとき
    this.listenTo( app.Todos, 'reset', this.addAll );
    this.listenTo( app.Todos, 'add', this.addOne );

    this.listenTo( app.Todos, 'change:completed', this.filterOne );
    this.listenTo( app.Todos, 'filter', this.filterAll );

    // _.debounceで回数を1回に絞ることが出来る
    // this.listenTo( app.Todos, 'all', this.render );
    this.listenTo(app.Todos, 'all', _.debounce(this.render, 0));

    app.Todos.fetch();

  },

  render : function () {
    var completed = app.Todos.completed().length;
    var remaining = app.Todos.remaining().length;

    if ( app.Todos.length ) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html( this.statsTemplate({
        completed : completed,
        remaining : remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + (app.TodoFilter || '') + '"]')
        .addClass('selected');
    }
    else {
      this.$main.hide();
      this.$footer.hide();
    }

    // これいらないよね？
    // this.allCheckbox.checked = !remaining;

  },

  addOne : function (todo) {
    var view = new app.TodoView({ model : todo });
    $('#todo-list').append(view.render().el);
  },

  addAll : function () {
    this.$('#todo-list').html('');
    app.Todos.each(this.addOne, this);
  },

  /**
   * 完了状態が変更されたときのハンドラー
   * @todo 違和感があるのは、全体が個々に干渉していることか！
   * @param  {Todo} todo
   */
  filterOne : function (todo) {
    // コントローラがモデルのトリガーを直接利用している
    // model.save()によって間接的にイベントを呼び出してるわけではない
    todo.trigger('visible');
  },

  filterAll : function () {
    app.Todos.each( this.filterOne, this);
  },

  newAttributes: function () {
    return {
      title : this.$input.val().trim(),
      order : app.Todos.nextOrder(),
      completed : false
    };
  },

  createOnEnter: function (event) {
    if( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
      return;
    }

    app.Todos.create( this.newAttributes() );
    this.$input.val('');
  },

  clearCompleted : function () {
    // what's _.invoke and destory?
    _.invoke( app.Todos.completed(), 'destroy' );
    return false;
  },

  toggleAllComplete : function () {

    var completed = this.allCheckbox.checked;
    app.Todos.each( function (todo) {
      todo.save({
        'completed' : completed
      })
    });

  }

});