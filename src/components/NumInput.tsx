import { useState } from 'react';
import { IonButton, IonGrid, IonRow, IonCol, IonInput } from '@ionic/react';

interface NumInputProps {
  name: string;
  slot: string;
}

const NumInput: React.FC<NumInputProps> = ({ name, slot }) => {
	
  const  [ numVal, setNumVal ] = useState(0);
  
  return (
      <IonGrid slot={slot}>
        <IonRow>
          <IonCol><IonButton onClick={() => { setNumVal( numVal - 1 ) }}>-</IonButton></IonCol>
          <IonCol size="6">
            <IonInput name={name}>{numVal}</IonInput>
          </IonCol>
          <IonCol><IonButton onClick={() => { setNumVal( numVal + 1 ) }}>+</IonButton></IonCol>
        </IonRow>
      </IonGrid>
  );
};

export default NumInput;
