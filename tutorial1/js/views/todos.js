var app = app || {};

// 個々のviewは解読できた
app.TodoView = Backbone.View.extend({

  tagName : 'li',

  // viewControllerは内部にテンプレートをキャッシュしている
  // これも僕の考えと同じ
  template : _.template( $('#item-template').html() ),

  // これも僕の考えと同じ
  events : {
    'click .toggle' : 'togglecompleted',
    'dblclick label' : 'edit',
    'click .destroy' : 'clear',
    'keypress .edit' : 'updateOnEnter',
    'blur .edit' : 'close'
  },

  // ここでpub/subパターンの登録を行う
  // modelが発したイベントを検知するのはViewControllerの役割
  initialize : function () {
    // this.modelとは何か？
    // new TodoView({model:todo})のtodoがthis.modelの内容
    this.listenTo(this.model, 'change', this.render );

    // this.removeは、Backbone.Viewがもつメソッドか？
    this.listenTo(this.model, 'destroy', this.remove );

    // AppViewのfilterOneと対関係
    this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  render : function () {
    this.$el.html( this.template( this.model.toJSON() ) );

    this.$el.toggleClass('completed', this.model.get('completed'));
    this.toggleVisible();

    this.$input = this.$('.edit');
    return this;
  },

  /**
   * フィルター条件とmodelの完了状態が不一致のときDOM非表示
   */
  toggleVisible : function () {
    // 第二引数の結果がtrueのとき追加、falseのとき削除を意味する
    this.$el.toggleClass('hidden', this.isHidden() );
  },

  /**
   * フィルター条件とmodelの完了状態が不一致のときfalseを返す
   * @return {Boolean}
   */
  isHidden: function () {
    var isCompleted = this.model.get('completed');
    return (
      // 未完で完了済のみ表示するとき
      (!isCompleted && app.TodoFilter === 'completed' )
      ||
      // 完了済で、フィルターが未完のとき
      ( isCompleted && app.TodoFilter === 'active' )
    );
  },

  togglecompleted : function () {
    // modelで作成したtoggleメソッドを利用
    this.model.toggle();
  },

  edit : function () {
    this.$el.addClass('editing');
    this.$input.focus();
  },

  close : function () {
    var value = this.$input.val().trim();

    if (value) {
      this.model.save({ title : value });
    }
    else {
      this.clear();
    }

    this.$el.removeClass('editing');
  },

  updateOnEnter : function (e) {
    if ( e.which === ENTER_KEY ) {
      this.close();
    }
  },

  clear : function () {
    this.model.destroy();
  }

});