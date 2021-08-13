import React, { useState } from "react";
import ReactDOM from "react-dom";

interface Todo {
  value: string;
  id: number;
  checked: boolean;
  removed: boolean;
}

type Filter = "all" | "checked" | "unchecked" | "removed";

const App: React.VFC = () => {
  const [text, setText] = useState(""); //入力文字を保存
  const [todos, setTodos] = useState<Todo[]>([]);
  //todoたちの配列　[{id:new Date,value:入力文},{id:new Date,value:入力文}]
  const [filter, setFilter] = useState<Filter>("all");

  const handleOnSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    e.preventDefault();

    if (!text) {
      return;
    }

    const newTodo: Todo = {
      //todoを作成　{value: 入力文字}
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };

    setTodos([newTodo, ...todos]); //配列のオブジェクトでTodosを更新！
    setText(""); //入力文字をクリア！
  };

  const handleOnEdit = (id: number, value: string) => {
    const newTodo = todos.map((todo) => {
      if (todo.id === id) {
        //もしtodoのidと入力したidが一緒なら
        todo.value = value; //引数のvalue(入力変更分)に書き換える
      }
      return todo;
    });
    setTodos(newTodo);
    //変更したtodoを含む新Todos(コピー)で、旧Todosを更新する
  };

  const handleOnCheck = (id: number, checked: boolean) => {
    const newTodo = todos.map((todo) => {
      if (todo.id === id) {
        todo.checked = !checked;
      }
      return todo;
    });
    setTodos(newTodo);
  };

  const handleOnremoved = (id: number, removed: boolean) => {
    const newTodo = todos.map((todo) => {
      if (todo.id === id) {
        todo.removed = !removed;
      }
      return todo;
    });
    setTodos(newTodo);
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "all":
        return !todo.removed; //条件：削除以外のtodoを返す
      case "checked":
        return todo.checked && !todo.removed; //条件：チェック済みで、削除以外のtodoを返す
      case "unchecked":
        return !todo.checked && !todo.removed; //条件：未チェックで、削除以外のtodoを返す
      case "removed":
        return todo.removed; //条件：削除済みのtodoを返す
      default:
        return todo;
    }
  });

  const handleOnEmpty = () => {
    const newTodo = todos.filter((todo) => {
      return !todo.removed;
    });

    setTodos(newTodo);
  };

  //描画エリア
  return (
    <div>
      <select
        defaultValue="all"
        onChange={(e) => setFilter(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">未完了のタスク</option>
        <option value="removed">削除済みのタスク</option>
      </select>

      {filter === "removed" ? (
        <button
          onClick={() => handleOnEmpty()}
          disabled={todos.filter((todo) => todo.removed).length === 0}
        >
          ゴミ箱を空にする
        </button>
      ) : (
        <form onSubmit={(e) => handleOnSubmit(e)}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="submit"
            value={"追加"}
            onSubmit={(e) => handleOnSubmit(e)}
          />
        </form>
      )}

      <ul>
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                disabled={todo.removed}
                type="checkbox"
                checked={todo.checked}
                onChange={() => handleOnCheck(todo.id, todo.checked)}
              />
              <input
                disabled={todo.checked || todo.removed}
                type="text"
                value={todo.value}
                onChange={(e) => handleOnEdit(todo.id, e.target.value)}
              />
              <button onClick={() => handleOnremoved(todo.id, todo.removed)}>
                {todo.removed ? "復元" : "削除"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
