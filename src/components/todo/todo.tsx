import { useState } from 'react'

const Todo = () => {

    const [todos, setTodos] = useState<string[]>([])
    const [inputValue, setInputValue] = useState<string>('')

    function handleAdd() {
        if (inputValue.trim() !== '') {
            setTodos([...todos, inputValue])
            setInputValue('')
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <div>
                <input
                    style={{ marginRight: '10px', height: '30px', width: '200px' }}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button onClick={handleAdd}>Add</button>
            </div>

            <div>
                <ul>
                    {todos.map((todo, index) => (
                        <li key={index}>{todo}</li>
                    ))}
                </ul>

            </div>
        </div>
    )
}

export default Todo