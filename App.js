import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, ScrollView } from 'react-native';
import { 
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query
 } from 'firebase/firestore';
import { db, TODOS_REF } from './firebase/Config';
import { TodoItem } from './components/TodoItem';
import { TodoCheckedItem } from './components/TodoCheckedItem';
import styles from './style/style';

export default function App() {
  
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState({});

  useEffect(() => {
    const q = query(collection(db, TODOS_REF), orderBy('todoItem'))
    onSnapshot(q, (querySnapshot) => {
      setTodos(querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })))
    })
  }, []);

  const addNewTodo = async () => {
    try {
      if (newTodo.trim() !== "") {
        await addDoc(collection(db, TODOS_REF), {
          done: false,
          todoItem: newTodo
        })
        setNewTodo('');
      }
    }
    catch (error) {
      console.log(error.message);
    }
  }

  const removeTodo = async (id) => {
    try {
      await deleteDoc(doc (db, TODOS_REF, id));
    }
    catch (error) {
      console.log(error.message);
    }
  }

  const removeTodos = async() => {
    try {
      const querySnapshot = await getDocs(collection(db, TODOS_REF));
      querySnapshot.forEach((todo) => {
        removeTodo(todo.id);
      })
    }
    catch (error) {
      console.log(error.message);
    }
  }

  const filterTodos = (filterValue) => {
    let nbrOfFilteredTodos = 0;
    for (let i = 0; i < todos.length; i++ ) {
      if (todos[i].done === filterValue) {
        nbrOfFilteredTodos++;
      }
    }
    return nbrOfFilteredTodos;
  }
  
  const createTwoButtonAlert = () => Alert.alert(
    "Todolist", "Remove all items?", [{
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel"
    },
    { 
      text: "OK", onPress: () => removeTodos()
    }],
    { cancelable: false }
  );

  let todosKeys = Object.keys(todos);
  let nbrOfUncheckedTodos = filterTodos(false);
  let nbrOfCheckedTodos = filterTodos(true);
  
  return (
    <View style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}>
      <Text style={styles.header}>Todolist ({todosKeys.length})</Text>
      <View style={styles.newItem}>
        <TextInput
          placeholder='Add new todo'
          value={newTodo}
          style={styles.textInput}
          onChangeText={setNewTodo}
        />
      </View>
      <View style={styles.buttonStyle}>
        <Button 
          title="Add new Todo item"
          onPress={() => addNewTodo()}
        />
      </View>
      <Text style={styles.subheader}>Unchecked ({nbrOfUncheckedTodos})</Text>
      <View 
        contentContainerStyle={styles.contentContainerStyle}>
        <ScrollView>
          {todosKeys.length > 0 ? (
            todosKeys.map((key, i) => (
              !todos[i].done &&
                <TodoItem
                  key={key}
                  todoItem={todos[i]}
                  id={todos[key].id}
                />
            ))
          ) : (
            <Text style={styles.infoText}>There are no unchecked items</Text>
          )}
        </ScrollView>
      </View>
      <View 
        contentContainerStyle={styles.contentContainerStyle}>
        <Text style={styles.subheader}>Checked ({nbrOfCheckedTodos})</Text>
        <ScrollView>
          {todosKeys.length > 0 ? (
            todosKeys.map((key, i) => (
              todos[i].done &&
                <TodoCheckedItem
                  key={key}
                  todoItem={todos[i]}
                  id={todos[key].id}
                />
            ))
          ) : (
            <Text style={styles.infoText}>There are no checked items</Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.buttonStyle}>
        <Button 
          title="Remove all todos" 
          onPress={() => createTwoButtonAlert()} />
      </View>
    </View>
  );
}