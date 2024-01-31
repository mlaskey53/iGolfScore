import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader,
  IonMenu, IonMenuToggle, IonNote } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { peopleOutline, peopleSharp, settingsOutline, settingsSharp, golfOutline, golfSharp } from 'ionicons/icons';
import './Menu.css';
import Config from '../Config';

interface AppPage { url: string; iosIcon: string; mdIcon: string; title: string; }

const appPages: AppPage[] = [
  { title: 'Setup', url: '/page/Setup', iosIcon: peopleOutline, mdIcon: peopleSharp },
  { title: 'Round', url: '/page/Round', iosIcon: golfOutline, mdIcon: golfSharp },
  { title: 'Configure', url: '/page/Configure', iosIcon: settingsOutline, mdIcon: settingsSharp },
];


const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>{Config.appName}</IonListHeader>
          <IonNote>Version {Config.appVersion}</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

      </IonContent>
    </IonMenu>
  );
};

export default Menu;
