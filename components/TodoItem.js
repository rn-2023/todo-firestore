import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { doc, updateDoc } from 'firebase/firestore';
import { db, TODOS_REF } from '../firebase/Config';
import styles from '../style/style';

export const TodoItem = ({todoItem: {todoItem: title, done}, id}) => {

  const [doneState, setDone] = useState(done);

  const onCheck = async () => {
    try {
      setDone(!doneState);
      await updateDoc(doc(db, TODOS_REF, id), {
        done: !doneState
      })
    }
    catch (error) {
      console.log(error.message);
    }
  }

  return (
    <View style={styles.todoItem}>
      <Pressable onPress={onCheck}>
        {doneState 
          ? <MaterialIcons name={'check-box'} size={32} />
          : <MaterialIcons name={'check-box-outline-blank'} size={32} />}
      </Pressable>
      <Text onPress={onCheck} 
        style={
          [styles.todoText,
          {backgroundColor: "lightblue"}]}>{title}</Text>
    </View>
  );
}