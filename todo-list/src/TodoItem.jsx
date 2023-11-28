export function TodoItem({completed, id, title, toggleTodo, deleteTodo}){
return(
    <li>
    <label>
    <input type="checkbox"
    checked={completed}
    onChange={e => toggleTodo(id, e.target.checked)}
     />
    {title}
    </label>
  {/* Have to pass in () => to pass in the function, otherwise it will just return the result and everything will be deleted*/}
  <button onClick ={() => deleteTodo(id)} className="btn btn-danger">Delete</button>

  </li>

)
    
}