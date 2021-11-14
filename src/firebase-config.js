import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from '@firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth();

//initialize global variables
let USER_ID = null;
let USER_REF = null;
let SELECTED_SHOP_ID = null;
let SELECTED_SHOP_REF = null;

//
export const GooglePopup = (setUser, setError) => {
  signInWithPopup(auth, new GoogleAuthProvider())
    .then((result) => {
      setUser(result.user);
    })
    .catch((err) => {
      setError(err.message);
    });
};

//AÑADIR REGISTRO E INICIO DE SESION ACORDE
export const checkUser = async (userID) => {
  console.log('intializing user... userId: ', userID);
  USER_ID = userID;
  USER_REF = doc(db, 'users', USER_ID);
};

export const initializeSelectedShop = (shopID) => {
  SELECTED_SHOP_ID = shopID;
  SELECTED_SHOP_REF = doc(USER_REF, 'shops', SELECTED_SHOP_ID);
};

//getters
export const getShopData = async (setShopNames, addShopSketch) => {
  console.log('getting shops names... ');
  console.log('is there userRef? ', USER_REF);
  const shopsSnap = await getDoc(USER_REF);
  const shopNames = shopsSnap.data()?.shopNames;
  const shopSketches = shopsSnap.data()?.shopSketches;

  setShopNames(shopNames || []);
  addShopSketch(shopSketches || {});
};

export const getDayData = async (dayID) => {
  console.log('getting day data...');
  const daysRef = doc(SELECTED_SHOP_REF, 'days', dayID);
  const daysSnap = await getDoc(daysRef);
  if (daysSnap.exists()) {
    return daysSnap.data().weekTableData;
  }
};

export const getMonthData = async (monthID) => {
  console.log('getting month data...');
  const monthRef = doc(SELECTED_SHOP_REF, 'months', monthID);
  const monthsSnap = await getDoc(monthRef);
  if (monthsSnap.exists()) {
    return monthsSnap.data().monthChartData;
  } else {
    console.log('there isnt month data');
  }
};

//uploads
export const uploadShopData = async (shopName, shopSketch) => {
  console.log('uploading shop name.. ', shopName);
  await updateDoc(USER_REF, {
    shopNames: arrayUnion(shopName),
  });

  console.log('adding shop sketch ...');
  setDoc(USER_REF, { shopSketches: shopSketch }, { merge: true });
};

export const uploadDayData = async (dayID, dayData) => {
  console.log('uploading day data...');
  const daysRef = doc(SELECTED_SHOP_REF, 'days', dayID);
  await setDoc(daysRef, dayData);
};

export const uploadMonthData = async (monthID, monthData) => {
  console.log('uploading month data...');
  const monthsRef = doc(SELECTED_SHOP_REF, 'months', monthID);
  await setDoc(monthsRef, monthData);
  //await setDoc(USER_REF, { monthID: monthData });
};

export const deleteShopName = async (shopName) => {
  console.log('deleting shop');
  await updateDoc(USER_REF, {
    shopNames: arrayRemove(shopName),
  });
};
