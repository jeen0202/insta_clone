# React-native, FireStore, redux를 사용한 Instagram Clone App

## Library Setting

npm install @react-navagation/native
expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install @react-natvigation/stack @react-navigation/bottom-tabs 

## Firebase config
1. 새 프로젝트 생성
2. Authentication 설정
    sign-in-method에서 이메일/비밀번호 사용설정
3. Web app 등록
    Setting-구성(Config)로 SDK snippet 사용
4. Expo에서 Firebase 사용 설정
    https://docs.expo.io/guides/using-firebase/ 참고
    expo install firebase

## Redux config
1. Redux 사용을 위해 package 설치
    npm install redux react-redux redux-thunk
    redux thunk : Action 대신 function을 dispatch할 수 있게 해주는 middleware

## Firestore config
UserData를 저장하기 위해 Cloud Firestore 사용
1. Firebase console에서 Firestore 생성
2. users Collection 생성및 임시 데이터 추가

## Navigation tab customize
react-native-vector-icons : icon 사용
@react-navigation/material-bottom-tabs : bottom tab customize
react-native-paper : bottom tab customize

## Using Camera
expo install expo-camera : 카메라 사용을 위한 Package
expo install expo-image-picker : 앨범접근을 위한 Package

## UI 관련 Package
npm install native-base --save : Open Source UI Package
expo install expo-font : native-base 사용을 위해 추가
에러 발생시 --legacy-peer-deps option 추가