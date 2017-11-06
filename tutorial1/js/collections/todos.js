var app = app || {};

var TodoList = Backbone.Collection.extend({

  model : app.Todo,

  // なぜlocalStorageにするべきなのか、メモリ内で駄目な理由は何か？
  // メモリを節約するためというのはありだな
  // 更新タイミングはメモリ利用時と同じだが、ストックする場所をメモリから
  // ローカルストレージにすることでメモリオーバーを回避することができる
  localStorage : new Backbone.LocalStorage('todos-backbone'),

  completed : function () {
    // return this.filter((todo) => {
    //   return todo.get('completed');
    // })
    return this.where({completed: true});
  },

  remaining: function () {
    // return this.without.apply( this, this.completed() );
    return this.where({completed: false});
  },

  nextOrder: function () {
    // if( !this.length ) {
    //   return 1;
    // }
    // return this.last().get('order') + 1;
    return this.length ? this.last().get('order') + 1 : 1;
  },

  comparator : function (todo) {
    return todo.get('order');
  }

});

app.Todos = new TodoList();