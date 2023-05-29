import { useState } from 'react';
import { IonButton, IonGrid, IonRow, IonCol, IonInput } from '@ionic/react';

/**
Provides input mechanism for entering simple number values.  Encapsulates IonInput surrounded by two IonButtons as a single IonGrid:
  [-] <number> [+]
*/
 
interface NumInputProps {
  name: string;   // Name for IonInput
  slot: string;   // Slot for grid.
  init: number;  min: number;  max: number;
  setValue: (arg0: number) => void;  // Sets value to external state.
}

const NumInput: React.FC<NumInputProps> = ({ name, slot, init, min, max, setValue }) => {
  // Local state for IonInput value.
  const  [ numVal, setNumVal ] = useState(init);
  
  const changeValue = (val: number) => {
	if ( val >= min && val <= max) {
	  setValue( val );   // Update external state
	  setNumVal( val );  // Update local state
	}
  };
  
  return (
      <IonGrid slot={slot}>
        <IonRow>
          <IonCol><IonButton onClick={() => changeValue( numVal - 1 )}>-</IonButton></IonCol>
          <IonCol size="6">
            <IonInput name={name}>{numVal}</IonInput>
          </IonCol>
          <IonCol><IonButton onClick={() => changeValue( numVal + 1 )}>+</IonButton></IonCol>
        </IonRow>
      </IonGrid>
  );
};

export default NumInput;
