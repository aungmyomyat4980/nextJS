'use client'
import React from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

const MyComponent = () => {
    const queryClient = useQueryClient();
    const getAllTodos = async () => {
        const res = await fetch('http://localhost:3000/todos');
        return res.json();
    };

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['get', 'todos'],
        queryFn: getAllTodos,
    });

    const createNewTodo = async () => {
        const url = 'http://localhost:3000/todos';
        const data = {
            taskName: 'To Run',
            isFinished: true,
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    };

    const { mutate } = useMutation({
        mutationKey: ['createTodo'],
        mutationFn: createNewTodo,
        onError: (error) => {
            console.error('Error creating todo:', error);
        },
    });

    const onCreateNewTodo = () => {
        mutate({},{
            onSuccess: async () => {
               await queryClient.invalidateQueries({
                   queryKey : ['get', 'todos']
               })
        }
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching data</div>;
    }

    return (
        <div>
            {isSuccess && (
                <ul>
                    {data.map((todo) => {
                        return <li key={todo.id}>{todo.id} -- {todo.taskName}</li>;
                    })}
                </ul>
            )}
            <button className='bg-blue-950 px-4 py-1 rounded text-white' onClick={onCreateNewTodo}>
                Add Todo
            </button>
        </div>
    );
};

export default MyComponent;
