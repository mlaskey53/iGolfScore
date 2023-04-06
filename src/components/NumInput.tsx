import { useState } from 'react';
import { IonButton, IonGrid, IonRow, IonCol, IonInput } from '@ionic/react';

interface NumInputProps {
  name: string;
}

const NumInput: React.FC<NumInputProps> = ({ name }) => {
	
  const  [ numVal, setNumVal ] = useState(0);
  
  return (
      <IonGrid>
        <IonRow>
          <IonCol><IonButton onClick={() => { setNumVal( numVal - 1 ) }}>-</IonButton></IonCol>
          <IonCol size="6">
            <IonInput>{numVal}</IonInput>
          </IonCol>
          <IonCol><IonButton onClick={() => { setNumVal( numVal + 1 ) }}>+</IonButton></IonCol>
        </IonRow>
      </IonGrid>
  );
};

export default NumInput;
