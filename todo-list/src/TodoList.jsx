import { TodoItem } from "./TodoItem"
export function TodoList({todos, toggleTodo, deleteTodo}){
    return(
        <ul className="list">
        {todos.length === 0 && "Nothing on the Todo List"}
        {todos.map(todo=>{
          return(
            <TodoItem
            {...todo}
            // is the same as
            //id={todo.id}
            //completed={todo.completed}
            //title={todo.title}
            key ={todo.id}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
          )
        })}
      </ul>


    )
}