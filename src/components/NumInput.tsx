import { useState } from 'react';
import { IonButton, IonGrid, IonRow, IonCol } from '@ionic/react';

/**
Provides input mechanism for entering simple number values.  Encapsulates IonInput surrounded by two IonButtons as a single IonGrid:
  [-] <number> [+]
*/
 
interface NumInputProps {
  name: string;   // Name prefixed to buttons/value
  init: number;  min: number;  max: number;
  setValue: (arg0: number) => void;  // Sets value to external state.
}

const NumInput: React.FC<NumInputProps> = ({ name, init, min, max, setValue }) => {

  // Local state for value.
  const  [ numVal, setNumVal ] = useState( init );
  
  const changeValue = (val: number) => {
	if ( val >= min && val <= max) {
	  setValue( val );   // Update external state
	  setNumVal( val );  // Update local state
	}
  };
  
  return (
      <IonGrid>
        <IonRow>
          <IonCol size="4">{name}:</IonCol>
          <IonCol size="3"><IonButton onClick={() => changeValue( numVal - 1 )}>-</IonButton></IonCol>
          <IonCol size="2">{numVal}</IonCol>
          <IonCol size="3"><IonButton onClick={() => changeValue( numVal + 1 )}>+</IonButton></IonCol>
        </IonRow>
      </IonGrid>
  );
};

export default NumInput;
