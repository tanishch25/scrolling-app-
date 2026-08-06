import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { supabase } from '../lib/supabase';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let Notifications: any = null;

if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (e) {
    console.warn('Could not load expo-notifications', e);
  }
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [notification, setNotification] = useState<any>();
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  const requestPermissions = async () => {
    if (isExpoGo || !Notifications) {
      console.log('Push notifications are not supported in Expo Go. Please use a development build.');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#F97316',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }
      
      try {
        const projectId = 'comic-micro-fiction'; 
        const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Push token:', token);
        setExpoPushToken(token);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await supabase.from('profiles').update({ push_token: token }).eq('id', session.user.id);
        }
        
      } catch (e) {
        console.log('Error getting push token:', e);
      }
      return true;
    } else {
      console.log('Must use physical device for Push Notifications');
      return false;
    }
  };

  useEffect(() => {
    if (isExpoGo || !Notifications) return;
    
    notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
    };
  }, []);

  return { expoPushToken, notification, requestPermissions };
}
