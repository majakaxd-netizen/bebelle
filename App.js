import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, StatusBar, Image, Linking, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

var _B='https://api.airtable.com/v0/app5hrql36OKNfWvI/';
var _K='Bearer patrBX7nDs5CywQRA.7c6a8fb5a324951f46b2f9f74f39909770be888e3e04bb549f7a62c2562a2f26';
function _getAll(t,cb){fetch(_B+encodeURIComponent(t),{headers:{Authorization:_K}}).then(function(r){return r.json();}).then(function(d){if(d.error){console.error('Airtable error:',d.error);cb(new Error(d.error),null);return;}cb(null,(d.records||[]).map(function(r){var f=r.fields||{};f._id=r.id;f.id=f.id||r.id;if(f.date){f.date=f.date.substring(0,10);}return f;}));}).catch(function(e){console.error('Fetch error:',e.message);cb(e,null);});}
function _post(t,f){return fetch(_B+encodeURIComponent(t),{method:'POST',headers:{Authorization:_K,'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).then(function(r){return r.json();});}
function _patch(t,rid,f){return fetch(_B+encodeURIComponent(t)+'/'+rid,{method:'PATCH',headers:{Authorization:_K,'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).then(function(r){return r.json();});}
function _destroy(t,rid){return fetch(_B+encodeURIComponent(t)+'/'+rid,{method:'DELETE',headers:{Authorization:_K}}).then(function(r){return r.json();});}
function _find(t,ourId){return fetch(_B+encodeURIComponent(t)+'?filterByFormula='+encodeURIComponent('{id}="'+ourId+'"'),{headers:{Authorization:_K}}).then(function(r){return r.json();}).then(function(d){return(d.records||[])[0]||null;});}
function _findUpd(t,ourId,f){return _find(t,ourId).then(function(rec){if(!rec)return _post(t,Object.assign({id:ourId},f));return _patch(t,rec.id,f);});}
function _findDel(t,ourId){return _find(t,ourId).then(function(rec){if(!rec)return Promise.resolve();return _destroy(t,rec.id);});}

export default function App() {






  var TAB_BAR_HEIGHT = 49;
  var ADMIN_ID = 'fumiko';
  var ADMIN_PASS = 'fumiko1425';
  var PAYPAL_ME = 'https://paypal.me/martinovoamena/';
  var WEATHER_LAT = 24.3327711;
  var WEATHER_LON = 124.173763;
  var Tab = createBottomTabNavigator();
  var AppCtx = React.createContext();
  var SALON_PHOTO = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400';
  var MUSIC_URL = 'https://drive.google.com/uc?export=download&id=1T9iW_pvPwhaVdn1_BB9LkHKrgTiazsif';

  var T = {
    en: {
      selectLang:'Choose Language',english:'English',japanese:'日本語',
      login:'Login',register:'Create Account',username:'Username',password:'Password',
      confirmPass:'Confirm Password',name:'Full Name',phone:'Phone',
      loginBtn:'Login',registerBtn:'Register',
      noAccount:"Don't have an account? Register",hasAccount:'Already have an account? Login',
      reservations:'Reservations',services:'Menu',about:'About',admin:'Admin',
      selectDate:'Select Date',selectTime:'Select Time',
      selectService:'Select Services (multiple)',myAppointments:'My Appointments',
      noAppointments:'No appointments yet',total:'Total',
      bookBtn:'Confirm Booking',bookTitle:'Book Appointment',summary:'Summary',
      cash:'Cash',online:'Pay with PayPal',payment:'Payment Method',
      cancel:'Cancel Appointment',reschedule:'Reschedule',manage:'Manage Appointment',
      ourServices:'Our Menu',aboutUs:'About Us',history:'Our Story',
      hours:'Business Hours',contact:'Contact',followUs:'Follow Us',logout:'Logout',
      adminPanel:'Admin Panel',addService:'Add Service',editService:'Edit',
      deleteService:'Delete',allReservations:'All Reservations',
      serviceName:'Service Name',servicePrice:'Price (JPY)',serviceDuration:'Duration (min)',
      serviceDesc:'Description',save:'Save',min:'min',
      totalDuration:'Total Duration',selectedServices:'Selected',
      invalidLogin:'Invalid username or password',passNoMatch:'Passwords do not match',
      fillAll:'Please fill in all fields',bookSuccess:'Appointment booked!',
      cancelSuccess:'Appointment cancelled',cancelConfirm:'Cancel this appointment?',
      cancelWarning:'This appointment is in less than 24 hours. A 500 JPY fee will be charged at your next visit.',
      yes:'Yes',no:'No',client:'Client',noServices:'Please select at least one service',
      mon:'Mon',tue:'Tue',wed:'Wed',thu:'Thu',fri:'Fri',sat:'Sat',sun:'Sun',
      historyText:'Bebelle Hair Salon is your cozy escape for beautiful hair. Our expert stylists bring Japanese precision and warmth to every treatment.',
      addressText:'204-100 Maezato, Ishigaki, Okinawa 907-0002, Japan',
      phoneText:'Contact via Instagram or Facebook',
      mondayFriday:'Monday - Friday',saturday:'Saturday',sunday:'Sunday',
      userExists:'Username already taken',
      weatherLoading:'Loading weather...',
      paypalOpening:'Opening PayPal to complete your payment...',
      notifScheduled:'Reminder set for 30 min before your appointment!',
      cancelLate:'Late cancellation',cancelFee:'Note: A 500 JPY fee applies for cancellations within 24 hours.',
      adminNewBooking:'New booking:',adminCancelled:'Cancellation:',adminOnlinePayment:'Online payment:',closedDayAdded:'Day marked closed:',closedDayRemoved:'Day reopened:',
      lateCancelBadge:'⚠️ LATE CANCEL — Collect 500 JPY',lateCancelledStatus:'Late Cancelled'
    },
    ja: {
      selectLang:'言語を選択',english:'English',japanese:'日本語',
      login:'ログイン',register:'アカウント作成',username:'ユーザー名',password:'パスワード',
      confirmPass:'パスワード確認',name:'お名前',phone:'電話番号',
      loginBtn:'ログイン',registerBtn:'登録する',
      noAccount:'アカウントをお持ちでない方はこちら',hasAccount:'すでにアカウントをお持ちの方はこちら',
      reservations:'予約',services:'メニュー',about:'店舗情報',admin:'管理',
      selectDate:'日付を選択',selectTime:'時間を選択',
      selectService:'メニューを選択（複数可）',myAppointments:'予約一覧',
      noAppointments:'予約がありません',total:'合計',
      bookBtn:'予約を確定する',bookTitle:'予約する',summary:'予約内容',
      cash:'現金',online:'PayPalで支払う',payment:'支払い方法',
      cancel:'キャンセル',reschedule:'変更する',manage:'予約管理',
      ourServices:'メニュー一覧',aboutUs:'店舗情報',history:'私たちについて',
      hours:'営業時間',contact:'お問い合わせ',followUs:'フォローする',logout:'ログアウト',
      adminPanel:'管理パネル',addService:'メニュー追加',editService:'編集',
      deleteService:'削除',allReservations:'全予約',
      serviceName:'メニュー名',servicePrice:'料金（JPY）',serviceDuration:'所要時間（分）',
      serviceDesc:'説明',save:'保存',min:'分',
      totalDuration:'合計時間',selectedServices:'選択中',
      invalidLogin:'ユーザー名またはパスワードが違います',passNoMatch:'パスワードが一致しません',
      fillAll:'全ての項目を入力してください',bookSuccess:'予約が完了しました！',
      cancelSuccess:'予約をキャンセルしました',cancelConfirm:'この予約をキャンセルしますか？',
      cancelWarning:'この予約まで24時間未満です。次回来店時に500円のキャンセル料が発生します。',
      yes:'はい',no:'いいえ',client:'お客様',noServices:'メニューを選択してください',
      mon:'月',tue:'火',wed:'水',thu:'木',fri:'金',sat:'土',sun:'日',
      historyText:'Bebelle Hair Salonは、美しい髪を提供するサロンです。経験豊富なスタイリストが日本の技術と温かさで最高の体験をご提供します。',
      addressText:'〒907-0002 沖縄県石垣市前里204-100',
      phoneText:'InstagramまたはFacebookよりお問い合わせください',
      mondayFriday:'月曜〜金曜',saturday:'土曜',sunday:'日曜',
      userExists:'そのユーザー名はすでに使われています',
      weatherLoading:'天気を読み込み中...',
      paypalOpening:'PayPalを開いて支払いを完了してください...',
      notifScheduled:'予約30分前のリマインダーを設定しました！',
      cancelLate:'遅いキャンセル',cancelFee:'注意：24時間以内のキャンセルは500円の手数料が発生します。',
      adminNewBooking:'新しい予約:',adminCancelled:'キャンセル:',adminOnlinePayment:'オンライン支払い:',closedDayAdded:'休業日設定:',closedDayRemoved:'営業日に戻しました:',
      lateCancelBadge:'⚠️ 遅延キャンセル — 500円を受け取ること',lateCancelledStatus:'遅延キャンセル'
    }
  };

  var C = {primary:'#C9748F',bg:'#FDF5F7',card:'#FFFFFF',text:'#1F2937',sub:'#6B7280',border:'#E5E7EB',success:'#10B981',error:'#EF4444',warning:'#F59E0B',accent:'#FBCFE8'};
  var HORARIO = {1:{a:9,c:19},2:{a:9,c:19},3:{a:9,c:19},4:{a:9,c:19},5:{a:9,c:19},6:{a:9,c:18},0:{a:10,c:17}};

  function endTime(start,mins){var h=parseInt(start.split(':')[0]);var m=parseInt(start.split(':')[1]);var tot=h*60+m+mins;return String(Math.floor(tot/60)).padStart(2,'0')+':'+String(tot%60).padStart(2,'0');}
  function isWithin24h(dateStr,timeStr){var appt=new Date(dateStr+'T'+timeStr);var now=new Date();var diff=appt.getTime()-now.getTime();return diff>0&&diff<24*60*60*1000;}
  function isCancelledStatus(status){return status==='cancelled'||status==='cancelled_late';}
  function getHairTip(code,temp,lang){var ja=lang==='ja';if(temp>=30)return ja?'とても暑いです！UVカットスプレーでヘアケアをしましょう。':'Very hot! Use UV protection spray to shield your hair from sun damage.';if(temp>=26)return ja?'暑い日が続いています。保湿ヘアミストがオススメです。':'Hot and sunny! Keep hair hydrated with a leave-in moisture mist.';if(code>=200&&code<600)return ja?'雨の日は湿気で髪が広がります。洗い流さないトリートメントでまとめましょう。':'Rainy day! Humidity causes frizz — use a leave-in conditioner to tame your hair.';if(temp<18)return ja?'涼しい季節です。頭皮マッサージで血行を促進しましょう！':'Cool day! Great time for a head spa treatment.';return ja?'今日は良いコンディションです。サロンでのトリートメントにぴったり！':'Perfect salon weather today! Great day for a relaxing treatment.';}

  function AppProvider(props){
    useEffect(function(){
      Notifications.setNotificationHandler({handleNotification:async function(){return {shouldShowAlert:true,shouldPlaySound:true,shouldSetBadge:true};},});
      if(Device.isDevice){
        Notifications.requestPermissionsAsync().then(function(s){
          if(s.status!=='granted'){console.log('Notification permission denied');}
        });
      }
    },[]);
    var ls=useState(null);var lang=ls[0];var setLang=ls[1];
    var us=useState(null);var user=us[0];var setUser=us[1];
    var usrs=useState([]);var users=usrs[0];var setUsers=usrs[1];
    var an=useState([]);var adminNotifs=an[0];var setAdminNotifs=an[1];
    var t=lang?T[lang]:T.en;
    var isAdmin=user&&user.username===ADMIN_ID;
    function pushAdminNotif(msg){var now=Date.now();setAdminNotifs(function(prev){var filtered=prev.filter(function(n){return now-parseInt(n.id)<24*60*60*1000;});return [{id:now.toString(),msg:msg,time:new Date().toLocaleTimeString()}].concat(filtered).slice(0,50);});}
    function dismissAdminNotif(id){setAdminNotifs(function(prev){return prev.filter(function(n){return n.id!==id;});});}
    function clearAdminNotifs(){setAdminNotifs([]);}
    return React.createElement(AppCtx.Provider,{value:{lang:lang,setLang:setLang,t:t,user:user,setUser:setUser,isAdmin:isAdmin,users:users,setUsers:setUsers,adminNotifs:adminNotifs,pushAdminNotif:pushAdminNotif,dismissAdminNotif:dismissAdminNotif,clearAdminNotifs:clearAdminNotifs}},props.children);
  }
  function useApp(){return useContext(AppCtx);}
  async function sendLocalNotif(title,body){
    try{
      await Notifications.scheduleNotificationAsync({content:{title:title,body:body,sound:true},trigger:null});
    }catch(e){console.log('Notif error:',e.message);}
  }

  function WeatherWidget(){
    var app=useApp();
    var ws=useState(null);var weather=ws[0];var setWeather=ws[1];
    var wl=useState(true);var loading=wl[0];var setLoading=wl[1];
    useEffect(function(){
      fetch('https://api.open-meteo.com/v1/forecast?latitude='+WEATHER_LAT+'&longitude='+WEATHER_LON+'&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m&timezone=Asia%2FTokyo')
        .then(function(r){return r.json();}).then(function(d){if(d&&d.current){setWeather({temp:Math.round(d.current.temperature_2m),code:d.current.weathercode,wind:Math.round(d.current.windspeed_10m),humidity:d.current.relativehumidity_2m});}setLoading(false);}).catch(function(){setLoading(false);});
    },[]);
    function wicon(c){if(c===0)return'☀️';if(c<=2)return'⛅';if(c<=49)return'🌫️';if(c<=69)return'🌧️';if(c<=79)return'❄️';if(c<=99)return'⛈️';return'🌤️';}
    function wdesc(c,ja){if(c===0)return ja?'快晴':'Clear';if(c<=2)return ja?'一部曇り':'Partly cloudy';if(c<=49)return ja?'霧':'Foggy';if(c<=69)return ja?'雨':'Rainy';if(c<=79)return ja?'雪':'Snow';if(c<=99)return ja?'雷雨':'Thunderstorm';return ja?'曇り':'Cloudy';}
    if(loading)return React.createElement(View,{style:{backgroundColor:'#EBF5FB',borderRadius:14,padding:14,margin:16,marginBottom:0,flexDirection:'row',alignItems:'center'}},React.createElement(ActivityIndicator,{size:'small',color:C.primary}),React.createElement(Text,{style:{color:C.sub,fontSize:13,marginLeft:10}},app.t.weatherLoading));
    if(!weather)return null;
    return React.createElement(View,{style:{backgroundColor:'#EBF5FB',borderRadius:14,margin:16,marginBottom:0,overflow:'hidden'}},
      React.createElement(View,{style:{flexDirection:'row',alignItems:'center',padding:14,paddingBottom:10}},
        React.createElement(Text,{style:{fontSize:36,marginRight:12}},wicon(weather.code)),
        React.createElement(View,{style:{flex:1}},
          React.createElement(View,{style:{flexDirection:'row',alignItems:'baseline'}},
            React.createElement(Text,{style:{fontSize:28,fontWeight:'bold',color:C.text,marginRight:6}},weather.temp+'°C'),
            React.createElement(Text,{style:{fontSize:13,color:C.sub}},wdesc(weather.code,app.lang==='ja'))),
          React.createElement(Text,{style:{fontSize:11,color:C.sub,marginTop:2}},'💨 '+weather.wind+'km/h  💧 '+weather.humidity+'%  Ishigaki, Okinawa'))),
      React.createElement(View,{style:{backgroundColor:'#D6EAF8',padding:12}},React.createElement(Text,{style:{fontSize:12,color:'#1A5276',lineHeight:18}},getHairTip(weather.code,weather.temp,app.lang))));
  }

  function MusicPlayer(){
    var MUSIC_URL2='https://www.dropbox.com/scl/fi/w0tcgwgj1h4k9gcw7aaeo/RAINING-IN-Lofi-HipHop.mp3?rlkey=t71rk52la53oivr7iylg47r37&st=fgtzar8n&dl=1';
    var player=useAudioPlayer({uri:MUSIC_URL2,loop:true});
    var status=useAudioPlayerStatus(player);
    var playing=status?status.playing:false;
    function toggleMusic(){try{if(playing){player.pause();}else{player.seekTo(0);player.play();}}catch(e){console.log('Music:',e.message);}}
    return React.createElement(TouchableOpacity,{onPress:toggleMusic,style:{position:'absolute',bottom:120,left:20,zIndex:999,backgroundColor:'rgba(201,116,143,0.9)',borderRadius:30,paddingHorizontal:14,paddingVertical:8,flexDirection:'row',alignItems:'center',elevation:6}},
      React.createElement(MaterialIcons,{name:playing?'pause':'music-note',size:18,color:'#FFF'}),
      React.createElement(Text,{style:{color:'#FFF',fontSize:12,marginLeft:6,fontWeight:'600'}},playing?'Lofi ♪':'Music'));
  }

  function LangScreen(){
    var app=useApp();
    return React.createElement(View,{style:{flex:1,backgroundColor:'#1A1A2E',justifyContent:'center',alignItems:'center',padding:40}},
      React.createElement(Image,{source:{uri:SALON_PHOTO},style:{width:160,height:160,borderRadius:80,marginBottom:30,borderWidth:4,borderColor:C.primary},resizeMode:'cover'}),
      React.createElement(Text,{style:{fontSize:32,fontWeight:'bold',color:'#FFFFFF',marginBottom:6,textAlign:'center'}},'Bebelle'),
      React.createElement(Text,{style:{fontSize:16,color:'#C9748F',marginBottom:40,textAlign:'center'}},'HAIR SALON'),
      React.createElement(TouchableOpacity,{style:{width:'100%',backgroundColor:C.primary,padding:18,borderRadius:14,alignItems:'center',marginBottom:14},onPress:function(){app.setLang('en');}},React.createElement(Text,{style:{color:'#FFF',fontSize:18,fontWeight:'bold'}},'English')),
      React.createElement(TouchableOpacity,{style:{width:'100%',backgroundColor:'#2D2D44',padding:18,borderRadius:14,alignItems:'center',borderWidth:1,borderColor:C.primary},onPress:function(){app.setLang('ja');}},React.createElement(Text,{style:{color:'#FFF',fontSize:18,fontWeight:'bold'}},'日本語')));
  }

  function AuthScreen(){
    var app=useApp();var t=app.t;
    var il=useState(true);var isLogin=il[0];var setIsLogin=il[1];
    var un=useState('');var username=un[0];var setUsername=un[1];
    var pw=useState('');var password=pw[0];var setPassword=pw[1];
    var cf=useState('');var confirm=cf[0];var setConfirm=cf[1];
    var nm=useState('');var name=nm[0];var setName=nm[1];
    var ph=useState('');var phone=ph[0];var setPhone=ph[1];
    var rm=useState(false);var rememberMe=rm[0];var setRememberMe=rm[1];
    useEffect(function(){AsyncStorage.getItem('savedUser').then(function(val){if(val){try{var u=JSON.parse(val);app.setUser(u);}catch(e){}}}).catch(function(){});AsyncStorage.getItem('rememberMe').then(function(val){if(val==='true')setRememberMe(true);}).catch(function(){});},[]);
    var inp={borderWidth:1,borderColor:C.border,borderRadius:10,padding:14,marginBottom:12,fontSize:15,backgroundColor:'#FFF',color:C.text};
    function doLogin(){
      if(!username.trim()||!password.trim()){Alert.alert('',t.fillAll);return;}
      var u=username.trim().toLowerCase();
      if(u===ADMIN_ID&&password.toLowerCase()===ADMIN_PASS.toLowerCase()){var au={username:ADMIN_ID,name:'Fumiko',isAdmin:true};if(rememberMe){AsyncStorage.setItem('savedUser',JSON.stringify(au));AsyncStorage.setItem('rememberMe','true');}app.setUser(au);return;}
      _getAll('users',function(e,d){
        if(e){Alert.alert('',t.invalidLogin);return;}
        var f=(d||[]).find(function(x){return x.username===u&&x.password===password;});
        if(!f){Alert.alert('',t.invalidLogin);return;}
        app.setUser(f);
      });
    }
    function doRegister(){
      if(!username.trim()||!password.trim()||!name.trim()||!phone.trim()){Alert.alert('',t.fillAll);return;}
      if(password!==confirm){Alert.alert('',t.passNoMatch);return;}
      var u=username.trim().toLowerCase();
      _getAll('users',function(e,d){
        if((d||[]).find(function(x){return x.username===u;})){Alert.alert('',t.userExists);return;}
        var nu={username:u,password:password,name:name,phone:phone};
        _post('users',nu).then(function(){
          app.setUser(nu);
        }).catch(function(){Alert.alert('',t.fillAll);});
      });
    }
    return React.createElement(View,{style:{flex:1,backgroundColor:C.bg}},
      React.createElement(ScrollView,{contentContainerStyle:{flexGrow:1,justifyContent:'center',padding:28}},
        React.createElement(View,{style:{alignItems:'center',marginBottom:28}},
          React.createElement(Image,{source:{uri:SALON_PHOTO},style:{width:120,height:120,borderRadius:60,marginBottom:16,borderWidth:3,borderColor:C.primary},resizeMode:'cover'}),
          React.createElement(Text,{style:{fontSize:24,fontWeight:'bold',color:C.primary}},'Bebelle Hair Salon'),
          React.createElement(Text,{style:{color:C.sub,marginTop:4}},isLogin?t.login:t.register)),
        React.createElement(TextInput,{style:inp,placeholder:t.username,placeholderTextColor:C.sub,value:username,onChangeText:setUsername,autoCapitalize:'none'}),
        !isLogin&&React.createElement(TextInput,{style:inp,placeholder:t.name,placeholderTextColor:C.sub,value:name,onChangeText:setName}),
        !isLogin&&React.createElement(TextInput,{style:inp,placeholder:t.phone,placeholderTextColor:C.sub,value:phone,onChangeText:setPhone,keyboardType:'phone-pad'}),
        React.createElement(TextInput,{style:inp,placeholder:t.password,placeholderTextColor:C.sub,value:password,onChangeText:setPassword,secureTextEntry:true}),
        !isLogin&&React.createElement(TextInput,{style:inp,placeholder:t.confirmPass,placeholderTextColor:C.sub,value:confirm,onChangeText:setConfirm,secureTextEntry:true}),React.createElement(TouchableOpacity,{onPress:function(){setRememberMe(function(v){return !v;});},style:{flexDirection:'row',alignItems:'center',marginBottom:16}},React.createElement(View,{style:{width:20,height:20,borderWidth:2,borderColor:C.primary,borderRadius:4,backgroundColor:rememberMe?C.primary:'transparent',marginRight:8,alignItems:'center',justifyContent:'center'}},rememberMe?React.createElement(MaterialIcons,{name:'check',size:14,color:'#FFF'}):null),React.createElement(Text,{style:{color:C.sub,fontSize:13}},'Remember me')),React.createElement(TouchableOpacity,{style:{backgroundColor:C.primary,padding:16,borderRadius:12,alignItems:'center',marginTop:6},onPress:isLogin?doLogin:doRegister},React.createElement(Text,{style:{color:'#FFF',fontSize:16,fontWeight:'bold'}},isLogin?t.loginBtn:t.registerBtn)),
        React.createElement(TouchableOpacity,{style:{marginTop:18,alignItems:'center'},onPress:function(){setIsLogin(function(p){return!p;});setUsername('');setPassword('');setConfirm('');setName('');setPhone('');}},React.createElement(Text,{style:{color:C.primary,fontSize:14}},isLogin?t.noAccount:t.hasAccount)),
        React.createElement(TouchableOpacity,{style:{marginTop:14,alignItems:'center'},onPress:function(){app.setLang(null);}},React.createElement(Text,{style:{color:C.sub,fontSize:13}},'🌐 '+t.selectLang))));
  }

  function ReservationsScreen(){
    var app=useApp();var t=app.t;
    var insets={top:44,bottom:34,left:0,right:0};
    var svs=useState([]);var services=svs[0];var setServices=svs[1];
    var rvs=useState([]);var reservations=rvs[0];var setReservations=rvs[1];
    var cds=useState([]);var closedDays=cds[0];var setClosedDays=cds[1];
    function refetch(){_getAll('reservations',function(e,d){if(!e)setReservations(d||[]);});}
    var rf=useState(false);var refreshing=rf[0];var setRefreshing=rf[1];
    function onRefresh(){setRefreshing(true);_getAll('reservations',function(e,d){if(!e)setReservations(d||[]);_getAll('closed_days',function(e2,d2){if(!e2)setClosedDays(d2||[]);setRefreshing(false);});});}
    function insertRes(r){return _post('reservations',r);}
    function updateRes(obj){return _findUpd('reservations',obj.id,obj.data);}
    useEffect(function(){
      _getAll('services',function(e,d){if(!e)setServices(d||[]);});
      _getAll('reservations',function(e,d){if(!e)setReservations(d||[]);});
      _getAll('closed_days',function(e,d){if(!e)setClosedDays(d||[]);});
    },[]);
    var sd=useState(new Date().toISOString().split('T')[0]);var selDate=sd[0];var setSelDate=sd[1];
    var st=useState(null);var selTime=st[0];var setSelTime=st[1];
    var ss=useState([]);var selSvcs=ss[0];var setSelSvcs=ss[1];
    var sb=useState(false);var showBook=sb[0];var setShowBook=sb[1];
    var sm=useState(false);var showMng=sm[0];var setShowMng=sm[1];
    var sr=useState(null);var selRes=sr[0];var setSelRes=sr[1];
    var cc=useState(false);var confirmCancel=cc[0];var setConfirmCancel=cc[1];
    var pm=useState('cash');var payMethod=pm[0];var setPayMethod=pm[1];
    var cm=useState(0);var calMonth=cm[0];var setCalMonth=cm[1];
    var cn=useState('');var closedNote=cn[0];var setClosedNote=cn[1];
    var now=new Date();
    var today=now.toISOString().split('T')[0];
    var myRes=useMemo(function(){return(reservations||[]).filter(function(r){return (r.username||'').toLowerCase()===(app.user.username||'').toLowerCase()&&!isCancelledStatus(r.status||'');});},[reservations,app.user.username]);
    var totAmount=useMemo(function(){return myRes.reduce(function(s,r){return s+(r.totalPrice||0);},0);},[myRes]);
    var totDur=useMemo(function(){return selSvcs.reduce(function(s,sv){return s+(parseInt(sv.duration)||0);},0);},[selSvcs]);
    var totPrice=useMemo(function(){return selSvcs.reduce(function(s,sv){return s+(parseInt(sv.price)||0);},0);},[selSvcs]);
    function getSlots(ds){var d=new Date(ds+'T00:00:00');var h=HORARIO[d.getDay()];var sl=[];for(var hr=h.a;hr<h.c;hr++){sl.push(String(hr).padStart(2,'0')+':00');sl.push(String(hr).padStart(2,'0')+':30');}return sl;}
    function isUnavail(ds,ts){
      if(new Date(ds+'T'+ts)<=now)return true;
      if(!app.isAdmin&&isClosedDay(ds))return true;
      var slotMins=parseInt(ts.split(':')[0])*60+parseInt(ts.split(':')[1]);
      var slotEnd=slotMins+(totDur||30);
      return(reservations||[]).some(function(r){if(isCancelledStatus(r.status||''))return false;if(r.date!==ds)return false;var rStart=parseInt((r.time||'0:0').split(':')[0])*60+parseInt((r.time||'0:0').split(':')[1]);var rEnd=rStart+(r.totalDuration||30);return slotMins<rEnd&&slotEnd>rStart;});
    }
    function isClosedDay(ds){return(closedDays||[]).some(function(cd){return cd.date===ds;});}
    function getClosedComment(ds){var cd=(closedDays||[]).find(function(cd){return cd.date===ds;});return cd?cd.comment||'':('');}
    function toggleSvc(sv){var key=sv._id||sv.id;setSelSvcs(function(prev){var ex=prev.find(function(s){return(s._id||s.id)===key;});if(ex)return prev.filter(function(s){return(s._id||s.id)!==key;});return prev.concat([sv]);});}
    function doBook(){console.log('doBook selSvcs:',JSON.stringify(selSvcs.map(function(s){return{id:s.id,name:s.name,price:s.price};})));
      if(selSvcs.length===0){Alert.alert('',app.lang==='ja'?'メニューを選択してください':'Please select at least one service');return;}
      if(!selTime){Alert.alert('',app.lang==='ja'?'カレンダーで時間を選択してください':'Please go back and select a time on the calendar');return;}
      var newId='res_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);
      var r={id:newId,username:app.user.username,clientName:app.user.name||app.user.username,serviceNames:selSvcs.map(function(s){return s.name;}).join(', '),date:selDate,time:selTime,endTime:endTime(selTime,totDur),totalPrice:totPrice,totalDuration:totDur,payment_method:payMethod,status:'confirmed',created_at:new Date().toISOString()};
      insertRes(r).then(function(){
        refetch();setShowBook(false);setSelSvcs([]);setSelTime(null);
        app.pushAdminNotif(t.adminNewBooking+' '+(app.user.name||app.user.username)+' - '+r.serviceNames+' ('+r.date+' '+r.time+')');
        var apptMs=new Date(r.date+'T'+r.time).getTime()-new Date().getTime()-30*60*1000;
        if(apptMs>0&&apptMs<24*60*60*1000){setTimeout(function(){Alert.alert('Bebelle Reminder',app.lang==='ja'?'予約の30分前です！ '+r.serviceNames:'Your appointment is in 30 minutes! '+r.serviceNames);},apptMs);}
        if(payMethod==='online'){app.pushAdminNotif(t.adminOnlinePayment+' '+(app.user.name||app.user.username)+': '+totPrice+' JPY');Alert.alert('',t.paypalOpening,[{text:'OK',onPress:function(){var ppUrl=(salonCfgData&&salonCfgData[0]&&salonCfgData[0].paypal)?salonCfgData[0].paypal:PAYPAL_ME;Linking.openURL(ppUrl+totPrice+'JPY');}}]);}
        else{Alert.alert('',t.bookSuccess);}
      }).catch(function(e){Alert.alert('Error booking',e.message||'Unknown error');});
    }
    function doCancel(resItem){
      var late=isWithin24h(resItem.date,resItem.time||'00:00');
      var newStatus=late?'cancelled_late':'cancelled';
      setShowMng(false);
      updateRes({id:resItem.id,data:{status:newStatus}}).then(function(){
        refetch();
        var notifMsg=t.adminCancelled+' '+(app.user.name||app.user.username)+' ('+resItem.date+' '+resItem.time+')';
        if(late)notifMsg+=' ⚠️ 500 JPY';
        app.pushAdminNotif(notifMsg);
      }).catch(function(){});
    }
    var baseDate=new Date(now.getFullYear(),now.getMonth()+calMonth,1);
    var monthLabel=baseDate.toLocaleString('default',{month:'long',year:'numeric'});
    var firstDay=baseDate.getDay();
    var daysInMonth=new Date(baseDate.getFullYear(),baseDate.getMonth()+1,0).getDate();
    var calDays=[];
    for(var i=0;i<firstDay;i++)calDays.push(null);
    for(var d=1;d<=daysInMonth;d++){var ds2=baseDate.getFullYear()+'-'+String(baseDate.getMonth()+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');calDays.push(ds2);}
    var slots=getSlots(selDate);
    var dayNms=[t.sun,t.mon,t.tue,t.wed,t.thu,t.fri,t.sat];
    return React.createElement(View,{style:{flex:1,backgroundColor:C.bg}},
      React.createElement(ScrollView,{contentContainerStyle:{paddingTop:insets.top,paddingBottom:TAB_BAR_HEIGHT+insets.bottom+80},refreshControl:React.createElement(RefreshControl,{refreshing:refreshing,onRefresh:onRefresh,colors:[C.primary],tintColor:C.primary})},
        React.createElement(View,{style:{padding:20,paddingBottom:0}},React.createElement(Text,{style:{fontSize:26,fontWeight:'bold',color:C.text}},t.reservations)),
        React.createElement(WeatherWidget,null),
        React.createElement(View,{style:{margin:16,backgroundColor:C.card,borderRadius:16,padding:16,elevation:2}},
          React.createElement(View,{style:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}},
            React.createElement(TouchableOpacity,{style:{padding:8,borderRadius:20,backgroundColor:C.bg},onPress:function(){if(calMonth>0)setCalMonth(function(p){return p-1;});}},React.createElement(MaterialIcons,{name:'chevron-left',size:24,color:calMonth>0?C.primary:C.border})),
            React.createElement(Text,{style:{fontSize:16,fontWeight:'700',color:C.text}},monthLabel),
            React.createElement(TouchableOpacity,{style:{padding:8,borderRadius:20,backgroundColor:C.bg},onPress:function(){if(calMonth<12)setCalMonth(function(p){return p+1;});}},React.createElement(MaterialIcons,{name:'chevron-right',size:24,color:C.primary}))),
          React.createElement(View,{style:{flexDirection:'row',marginBottom:8}},dayNms.map(function(dn,i){return React.createElement(View,{key:i,style:{flex:1,alignItems:'center'}},React.createElement(Text,{style:{fontSize:11,fontWeight:'600',color:C.sub}},dn));})),
          React.createElement(View,{style:{flexDirection:'row',flexWrap:'wrap'}},
            calDays.map(function(ds,idx){
              if(!ds)return React.createElement(View,{key:'e'+idx,style:{width:'14.28%',aspectRatio:1}});
              var isSel=selDate===ds;var isPast=ds<today;var isToday=ds===today;
              var dd=new Date(ds+'T00:00:00');
              var isClosed=!isPast&&isClosedDay(ds);
              var bgColor=isSel?C.primary:isToday?C.accent:'transparent';
              return React.createElement(TouchableOpacity,{key:ds,style:{width:'14.28%',aspectRatio:1,justifyContent:'center',alignItems:'center'},onPress:function(){if(!isPast){if(isClosed&&!app.isAdmin){setClosedNote(getClosedComment(ds)||'closed');}else{setClosedNote('');setSelDate(ds);setSelTime(null);}}},disabled:isPast},
                React.createElement(View,{style:{alignItems:'center'}},
                  React.createElement(View,{style:{width:34,height:34,borderRadius:17,justifyContent:'center',alignItems:'center',backgroundColor:isClosed?'#FEE2E2':bgColor,borderWidth:(isToday&&!isSel)||isClosed?1:0,borderColor:isClosed?C.error:C.primary}},
                    React.createElement(Text,{style:{fontSize:14,fontWeight:isSel||isToday?'700':'400',color:isSel?'#FFF':isPast?C.border:isClosed?C.error:C.text}},dd.getDate().toString())),
                  !isPast&&!isSel&&!isClosed&&React.createElement(View,{style:{width:5,height:5,borderRadius:3,backgroundColor:C.success,marginTop:1}})));
            }))),
        closedNote&&React.createElement(View,{style:{marginHorizontal:16,marginBottom:0,backgroundColor:'#FEE2E2',borderRadius:10,padding:12,flexDirection:'row',alignItems:'center'}},
          React.createElement(MaterialIcons,{name:'block',size:18,color:C.error}),
          React.createElement(View,{style:{flex:1,marginLeft:8}},
            React.createElement(Text,{style:{color:C.error,fontWeight:'700',fontSize:13}},app.lang==='ja'?'この日は休業日です':'This day is closed'),
            closedNote!=='closed'&&React.createElement(Text,{style:{color:C.error,fontSize:12,marginTop:2}},closedNote))),
        React.createElement(View,{style:{paddingHorizontal:16,paddingBottom:4,flexDirection:'row',alignItems:'center'}},
          React.createElement(View,{style:{width:8,height:8,borderRadius:4,backgroundColor:C.success,marginRight:4}}),
          React.createElement(Text,{style:{fontSize:10,color:C.sub,marginRight:12}},app.lang==='ja'?'空き':'Open'),
          React.createElement(View,{style:{width:8,height:8,borderRadius:4,backgroundColor:C.error,marginRight:4}}),
          React.createElement(Text,{style:{fontSize:10,color:C.sub}},app.lang==='ja'?'休業':'Closed')),
        React.createElement(View,{style:{paddingHorizontal:16,paddingBottom:16}},
          React.createElement(View,{style:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}},
            React.createElement(Text,{style:{fontSize:15,fontWeight:'600',color:C.text}},t.selectTime),
            React.createElement(Text,{style:{fontSize:12,color:C.sub}},selDate)),
          totDur>0&&React.createElement(View,{style:{backgroundColor:'#FFF3CD',padding:10,borderRadius:8,marginBottom:10,flexDirection:'row',alignItems:'center'}},
            React.createElement(MaterialIcons,{name:'info',size:16,color:C.warning}),
            React.createElement(Text,{style:{fontSize:12,color:'#856404',marginLeft:6}},(app.lang==='ja'?'合計: ':'Total: ')+totDur+(app.lang==='ja'?'分':'min'))),
          React.createElement(View,{style:{flexDirection:'row',flexWrap:'wrap'}},
            slots.map(function(sl){
              var unavail=isUnavail(selDate,sl);var isSel=selTime===sl;
              return React.createElement(TouchableOpacity,{key:sl,style:{paddingHorizontal:14,paddingVertical:10,borderRadius:8,borderWidth:1.5,margin:4,borderColor:isSel?C.primary:C.border,backgroundColor:unavail?'#F3F4F6':isSel?C.primary:C.card,opacity:unavail?0.45:1},onPress:function(){if(!unavail)setSelTime(sl);},disabled:unavail},
                React.createElement(Text,{style:{fontSize:13,fontWeight:isSel?'700':'400',color:unavail?C.sub:isSel?'#FFF':C.text}},unavail&&!isSel?sl+' X':sl));
            }))),
        React.createElement(View,{style:{padding:16}},
          React.createElement(Text,{style:{fontSize:18,fontWeight:'600',color:C.text,marginBottom:12}},t.myAppointments),
          myRes.length===0
            ?React.createElement(View,{style:{backgroundColor:C.card,padding:40,borderRadius:12,alignItems:'center'}},React.createElement(MaterialIcons,{name:'event-available',size:48,color:C.sub}),React.createElement(Text,{style:{color:C.sub,marginTop:12}},t.noAppointments))
            :myRes.slice().sort(function(a,b){var da=new Date((a.date||'2000-01-01').substring(0,10)+'T'+(a.time||'00:00'));var db=new Date((b.date||'2000-01-01').substring(0,10)+'T'+(b.time||'00:00'));return da-db;}).map(function(r,idx){
              var late=isWithin24h(r.date,r.time||'00:00');
              var rCopy=Object.assign({},r);
              return React.createElement(TouchableOpacity,{key:idx,style:{backgroundColor:C.card,borderRadius:12,borderWidth:1,borderColor:late?C.warning:C.border,padding:16,marginBottom:12},onPress:function(){setSelRes(rCopy);setConfirmCancel(false);setShowMng(true);}},
                late&&React.createElement(View,{style:{backgroundColor:'#FFF3CD',borderRadius:6,padding:6,marginBottom:8,flexDirection:'row',alignItems:'center'}},React.createElement(MaterialIcons,{name:'warning',size:14,color:C.warning}),React.createElement(Text,{style:{fontSize:11,color:'#856404',marginLeft:6}},app.lang==='ja'?'24時間以内 - キャンセルは500円':'Within 24h - 500 JPY if cancelled')),
                React.createElement(Text,{style:{fontSize:15,fontWeight:'600',color:C.text,marginBottom:4}},r.serviceNames||'Appointment'),
                React.createElement(Text,{style:{color:C.sub,marginBottom:2}},r.date+'  '+(r.time||'')+' - '+(r.endTime||'')),
                React.createElement(View,{style:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:8}},
                  React.createElement(Text,{style:{color:C.primary,fontWeight:'bold',fontSize:16}},(r.totalPrice||0)+' JPY'),
                  React.createElement(View,{style:{backgroundColor:r.payment_method==='online'?C.success:C.warning,paddingHorizontal:10,paddingVertical:4,borderRadius:6}},React.createElement(Text,{style:{color:'#FFF',fontSize:12}},r.payment_method==='online'?'PayPal':t.cash))));
            }),
          myRes.length>0&&React.createElement(View,{style:{backgroundColor:C.primary,padding:16,borderRadius:12,alignItems:'center',marginTop:8}},React.createElement(Text,{style:{color:'#FFF',fontSize:18,fontWeight:'bold'}},t.total+': '+(totAmount)+' JPY')))),
      (!app.isAdmin&&isClosedDay(selDate))
        ?React.createElement(View,{style:{position:'absolute',right:20,bottom:TAB_BAR_HEIGHT+insets.bottom+16,width:56,height:56,borderRadius:28,backgroundColor:C.error,justifyContent:'center',alignItems:'center',elevation:8}},React.createElement(MaterialIcons,{name:'block',size:28,color:'#FFF'}))
        :React.createElement(TouchableOpacity,{style:{position:'absolute',right:20,bottom:TAB_BAR_HEIGHT+insets.bottom+16,width:56,height:56,borderRadius:28,backgroundColor:C.primary,justifyContent:'center',alignItems:'center',elevation:8},onPress:function(){setShowBook(true);}},React.createElement(MaterialIcons,{name:'add',size:28,color:'#FFF'})),
      React.createElement(Modal,{visible:showBook,animationType:'slide',transparent:true,onRequestClose:function(){setShowBook(false);}},
        React.createElement(View,{style:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end'}},
          React.createElement(View,{style:{backgroundColor:C.bg,borderTopLeftRadius:20,borderTopRightRadius:20,padding:20,maxHeight:'92%'}},
            React.createElement(ScrollView,{showsVerticalScrollIndicator:false},
              React.createElement(View,{style:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16}},React.createElement(Text,{style:{fontSize:20,fontWeight:'bold',color:C.text}},t.bookTitle),React.createElement(TouchableOpacity,{onPress:function(){setShowBook(false);}},React.createElement(MaterialIcons,{name:'close',size:24,color:C.text}))),
              React.createElement(Text,{style:{fontWeight:'600',color:C.text,marginBottom:10,fontSize:15}},t.selectService),
              services.length===0
                ?React.createElement(View,{style:{alignItems:'center',padding:20}},React.createElement(ActivityIndicator,{size:'large',color:C.primary}),React.createElement(Text,{style:{color:C.sub,marginTop:10}},app.lang==='ja'?'読み込み中...':'Loading...'))
                :services.map(function(sv){
                  var isSel=selSvcs.some(function(s){return(s._id||s.id)===(sv._id||sv.id);});
                  return React.createElement(TouchableOpacity,{key:sv.id,style:{flexDirection:'row',alignItems:'center',padding:12,borderRadius:10,borderWidth:1.5,marginBottom:8,borderColor:isSel?C.primary:C.border,backgroundColor:isSel?'#FDF5F7':C.card},onPress:function(){toggleSvc(sv);}},
                    React.createElement(View,{style:{width:20,height:20,borderRadius:4,borderWidth:2,borderColor:isSel?C.primary:C.border,backgroundColor:isSel?C.primary:'#FFF',marginRight:12,justifyContent:'center',alignItems:'center'}},isSel&&React.createElement(MaterialIcons,{name:'check',size:14,color:'#FFF'})),
                    React.createElement(View,{style:{flex:1}},React.createElement(Text,{style:{fontWeight:'600',color:isSel?C.primary:C.text}},sv.name),React.createElement(Text,{style:{fontSize:12,color:C.sub}},(sv.duration||0)+(app.lang==='ja'?'分':'min')+'  '+(sv.price||0)+' JPY')));
                }),
              selSvcs.length>0&&React.createElement(View,{style:{backgroundColor:C.card,borderRadius:10,padding:14,marginTop:14,borderWidth:1,borderColor:C.accent}},
                React.createElement(Text,{style:{fontWeight:'600',color:C.primary,marginBottom:6}},t.selectedServices+' ('+selSvcs.length+')'),
                React.createElement(Text,{style:{color:C.sub}},t.totalDuration+': '+totDur+(app.lang==='ja'?'分':'min')),
                React.createElement(Text,{style:{color:C.primary,fontWeight:'bold',fontSize:16}},t.total+': '+totPrice+' JPY')),
              React.createElement(View,{style:{backgroundColor:selTime?'#ECFDF5':'#FFF3CD',borderRadius:10,padding:14,marginTop:14,borderWidth:1,borderColor:selTime?C.success:C.warning,flexDirection:'row',alignItems:'center'}},
                React.createElement(MaterialIcons,{name:selTime?'check-circle':'schedule',size:20,color:selTime?C.success:C.warning}),
                React.createElement(View,{style:{marginLeft:10,flex:1}},React.createElement(Text,{style:{fontWeight:'600',color:selTime?C.success:'#856404',fontSize:13}},selTime?(app.lang==='ja'?'選択中の時間：':'Selected time: ')+selDate+'  '+selTime+' - '+endTime(selTime,totDur):(app.lang==='ja'?'モーダルを閉じてカレンダーで時間を選んでください':'Close this and select a time on the calendar first')))),
              React.createElement(Text,{style:{fontWeight:'600',color:C.text,marginTop:16,marginBottom:10,fontSize:15}},t.payment),
              React.createElement(View,{style:{flexDirection:'row',marginBottom:18}},
                React.createElement(TouchableOpacity,{style:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',padding:14,borderRadius:10,borderWidth:1.5,marginRight:6,borderColor:payMethod==='cash'?C.primary:C.border,backgroundColor:payMethod==='cash'?C.primary:C.card},onPress:function(){setPayMethod('cash');}},React.createElement(MaterialIcons,{name:'money',size:20,color:payMethod==='cash'?'#FFF':C.text}),React.createElement(Text,{style:{color:payMethod==='cash'?'#FFF':C.text,fontWeight:'600',marginLeft:8}},t.cash)),
                React.createElement(TouchableOpacity,{style:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',padding:14,borderRadius:10,borderWidth:1.5,borderColor:payMethod==='online'?C.primary:C.border,backgroundColor:payMethod==='online'?C.primary:C.card},onPress:function(){setPayMethod('online');}},React.createElement(MaterialIcons,{name:'credit-card',size:20,color:payMethod==='online'?'#FFF':C.text}),React.createElement(Text,{style:{color:payMethod==='online'?'#FFF':C.text,fontWeight:'600',marginLeft:8}},'PayPal'))),
              payMethod==='online'&&React.createElement(View,{style:{backgroundColor:'#EBF5FB',padding:10,borderRadius:8,marginBottom:12,flexDirection:'row',alignItems:'center'}},React.createElement(Text,{style:{fontSize:13,color:'#1A5276',marginLeft:4}},app.lang==='ja'?'確定後、PayPalが開きます':'After confirming, PayPal will open')),
              React.createElement(TouchableOpacity,{style:{backgroundColor:C.primary,padding:16,borderRadius:12,alignItems:'center'},onPress:doBook},React.createElement(Text,{style:{color:'#FFF',fontSize:16,fontWeight:'bold'}},t.bookBtn)))))),
      selRes&&React.createElement(Modal,{visible:showMng,animationType:'slide',transparent:true,onRequestClose:function(){setShowMng(false);}},
        React.createElement(View,{style:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end'}},
          React.createElement(View,{style:{backgroundColor:C.bg,borderTopLeftRadius:20,borderTopRightRadius:20,padding:20}},
            React.createElement(View,{style:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16}},React.createElement(Text,{style:{fontSize:20,fontWeight:'bold',color:C.text}},t.manage),React.createElement(TouchableOpacity,{onPress:function(){setShowMng(false);}},React.createElement(MaterialIcons,{name:'close',size:24,color:C.text}))),
            isWithin24h(selRes.date,selRes.time||'00:00')&&React.createElement(View,{style:{backgroundColor:'#FFF3CD',borderRadius:10,padding:12,marginBottom:12,flexDirection:'row',alignItems:'flex-start'}},React.createElement(MaterialIcons,{name:'warning',size:18,color:C.warning}),React.createElement(Text,{style:{fontSize:13,color:'#856404',flex:1,lineHeight:20,marginLeft:8}},app.lang==='ja'?'この予約まで24時間未満です。キャンセルすると次回来店時に500円の料金が発生します。':'This appointment is within 24 hours. Cancelling will result in a 500 JPY fee at your next visit.')),
            React.createElement(View,{style:{backgroundColor:C.card,borderRadius:12,padding:16,marginBottom:16}},
              React.createElement(Text,{style:{fontSize:16,fontWeight:'bold',color:C.text,marginBottom:6}},selRes.serviceNames||'Appointment'),
              React.createElement(Text,{style:{color:C.sub}},(selRes.date||'')+' '+(selRes.time||'')+' - '+(selRes.endTime||'')),
              React.createElement(Text,{style:{color:C.primary,fontWeight:'bold',marginTop:4}},(selRes.totalPrice||0)+' JPY')),
            React.createElement(View,null,
              confirmCancel
                ?React.createElement(View,null,
                  React.createElement(View,{style:{backgroundColor:'#FEE2E2',borderRadius:10,padding:12,marginBottom:12}},
                    React.createElement(Text,{style:{color:C.error,fontWeight:'600',textAlign:'center',marginBottom:10}},t.cancelConfirm),
                    React.createElement(View,{style:{flexDirection:'row'}},
                      React.createElement(TouchableOpacity,{style:{flex:1,backgroundColor:C.error,padding:14,borderRadius:10,alignItems:'center',marginRight:6},onPress:function(){doCancel(selRes);}},React.createElement(Text,{style:{color:'#FFF',fontWeight:'700'}},t.yes)),
                      React.createElement(TouchableOpacity,{style:{flex:1,backgroundColor:C.bg,padding:14,borderRadius:10,alignItems:'center',borderWidth:1,borderColor:C.border,marginLeft:6},onPress:function(){setConfirmCancel(false);}},React.createElement(Text,{style:{color:C.sub,fontWeight:'700'}},t.no)))))
                :React.createElement(View,null,
                  React.createElement(TouchableOpacity,{style:{flexDirection:'row',alignItems:'center',justifyContent:'center',padding:16,borderRadius:12,backgroundColor:C.error,marginBottom:12},onPress:function(){setConfirmCancel(true);}},React.createElement(MaterialIcons,{name:'cancel',size:20,color:'#FFF'}),React.createElement(Text,{style:{color:'#FFF',fontWeight:'600',fontSize:15,marginLeft:8}},t.cancel)),
                  React.createElement(TouchableOpacity,{style:{flexDirection:'row',alignItems:'center',justifyContent:'center',padding:14,borderRadius:12,backgroundColor:C.bg,borderWidth:1,borderColor:C.border},onPress:function(){setShowMng(false);}},React.createElement(MaterialIcons,{name:'close',size:18,color:C.sub}),React.createElement(Text,{style:{color:C.sub,fontWeight:'600',marginLeft:8}},t.no))))))));
  }

  function ServicesScreen(){
    var app=useApp();var t=app.t;
    var insets={top:44,bottom:34,left:0,right:0};
    var svs=useState([]);var services=svs[0];var setServices=svs[1];
    var sve=useState(null);var svErr=sve[0];var setSvErr=sve[1];
    var svl=useState(true);var svLoading=svl[0];var setSvLoading=svl[1];
    useEffect(function(){_getAll('services',function(e,d){setSvLoading(false);if(e){setSvErr(e.message);return;}setServices(d||[]);});},[]);
    var photos=['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500','https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500','https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500','https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500','https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500','https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500','https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500','https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500','https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500','https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500','https://images.unsplash.com/photo-1582095133179-bfd08e2fb6b8?w=500','https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500'];
    return React.createElement(View,{style:{flex:1,backgroundColor:C.bg}},
      React.createElement(ScrollView,{contentContainerStyle:{paddingTop:insets.top,paddingBottom:TAB_BAR_HEIGHT+insets.bottom+16,padding:20}},
        React.createElement(Text,{style:{fontSize:26,fontWeight:'bold',color:C.text,marginBottom:20}},t.ourServices),
        services.length===0
          ?React.createElement(View,{style:{alignItems:'center',marginTop:60}},React.createElement(ActivityIndicator,{size:'large',color:C.primary}),React.createElement(Text,{style:{color:C.sub,marginTop:12}},app.lang==='ja'?'読み込み中...':'Loading...'))
          :services.map(function(sv,i){
            return React.createElement(View,{key:sv.id,style:{backgroundColor:C.card,borderRadius:16,overflow:'hidden',marginBottom:16,elevation:2}},
              React.createElement(Image,{source:{uri:photos[i%photos.length]},style:{width:'100%',height:180},resizeMode:'cover'}),
              React.createElement(View,{style:{padding:16}},
                React.createElement(Text,{style:{fontSize:17,fontWeight:'700',color:C.text,marginBottom:4}},sv.name),
                sv.description&&React.createElement(Text,{style:{color:C.sub,marginBottom:12,lineHeight:20}},sv.description),
                React.createElement(View,{style:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}},
                  React.createElement(View,{style:{flexDirection:'row',alignItems:'center',backgroundColor:'#FDF5F7',paddingHorizontal:10,paddingVertical:5,borderRadius:20}},React.createElement(MaterialIcons,{name:'schedule',size:14,color:C.primary}),React.createElement(Text,{style:{color:C.primary,fontSize:13,fontWeight:'500',marginLeft:4}},(sv.duration||0)+(app.lang==='ja'?'分':'min'))),
                  React.createElement(Text,{style:{fontSize:20,fontWeight:'bold',color:C.primary}},(sv.price||0)+' JPY'))));
          })));
  }

  function AboutScreen(){
    var app=useApp();var t=app.t;
    var insets={top:44,bottom:34,left:0,right:0};
    var scd=useState([]);var salonCfgData=scd[0];var setSalonCfgData=scd[1];
    useEffect(function(){_getAll('salon_config',function(e,d){if(!e)setSalonCfgData(d||[]);});},[]);
    var cfg=salonCfgData[0]||{};
    var photos=[cfg.photo1||'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500',cfg.photo2||'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',cfg.photo3||'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500'];
    return React.createElement(View,{style:{flex:1,backgroundColor:C.bg}},
      React.createElement(ScrollView,{contentContainerStyle:{paddingTop:insets.top,paddingBottom:TAB_BAR_HEIGHT+insets.bottom+16}},
        React.createElement(Image,{source:{uri:SALON_PHOTO},style:{width:'100%',height:220},resizeMode:'cover'}),
        React.createElement(View,{style:{padding:20}},
          React.createElement(Text,{style:{fontSize:26,fontWeight:'bold',color:C.text,marginBottom:20}},'Bebelle Hair Salon'),
          React.createElement(View,{style:{flexDirection:'row',marginBottom:20}},photos.map(function(ph,i){return React.createElement(Image,{key:i,source:{uri:ph},style:{flex:1,height:90,borderRadius:10,marginHorizontal:4},resizeMode:'cover'});})),
          React.createElement(View,{style:{backgroundColor:C.card,borderRadius:16,padding:18,marginBottom:16}},React.createElement(Text,{style:{fontSize:17,fontWeight:'700',color:C.text,marginBottom:10}},'✨ '+t.history),React.createElement(Text,{style:{color:C.sub,lineHeight:24}},cfg.history||t.historyText)),
          React.createElement(View,{style:{backgroundColor:C.card,borderRadius:16,padding:18,marginBottom:16}},
            React.createElement(Text,{style:{fontSize:17,fontWeight:'700',color:C.text,marginBottom:12}},'🕐 '+t.hours),
            React.createElement(View,{style:{flexDirection:'row',justifyContent:'space-between',paddingVertical:8,borderBottomWidth:1,borderBottomColor:C.border}},React.createElement(Text,{style:{color:C.text,fontWeight:'500'}},t.mondayFriday),React.createElement(Text,{style:{color:C.sub}},'9:00 - 19:00')),
            React.createElement(View,{style:{flexDirection:'row',justifyContent:'space-between',paddingVertical:8,borderBottomWidth:1,borderBottomColor:C.border}},React.createElement(Text,{style:{color:C.text,fontWeight:'500'}},t.saturday),React.createElement(Text,{style:{color:C.sub}},'9:00 - 18:00')),
            React.createElement(View,{style:{flexDirection:'row',justifyContent:'space-between',paddingVertical:8}},React.createElement(Text,{style:{color:C.text,fontWeight:'500'}},t.sunday),React.createElement(Text,{style:{color:C.sub}},'10:00 - 17:00'))),
          React.createElement(View,{style:{backgroundColor:C.card,borderRadius:16,padding:18,marginBottom:16}},
            React.createElement(Text,{style:{fontSize:17,fontWeight:'700',color:C.text,marginBottom:12}},'📞 '+t.contact),
            React.createElement(View,{style:{flexDirection:'row',alignItems:'center',marginBottom:10}},React.createElement(MaterialIcons,{name:'location-on',size:20,color:C.primary}),React.createElement(Text,{style:{color:C.sub,flex:1,marginLeft:10}},cfg.address||t.addressText)),
            React.createElement(View,{style:{flexDirection:'row',alignItems:'center'}},React.createElement(MaterialIcons,{name:'phone',size:20,color:C.primary}),React.createElement(Text,{style:{color:C.sub,flex:1,marginLeft:10}},cfg.phone||t.phoneText))),
          React.createElement(View,{style:{backgroundColor:C.card,borderRadius:16,padding:18,marginBottom:16}},
            React.createElement(Text,{style:{fontSize:17,fontWeight:'700',color:C.text,marginBottom:12}},'📱 '+t.followUs),
            React.createElement(TouchableOpacity,{style:{backgroundColor:'#E1306C',padding:14,borderRadius:12,flexDirection:'row',alignItems:'center',marginBottom:10},onPress:function(){if(cfg.instagram)Linking.openURL('https://instagram.com/'+cfg.instagram.replace('@',''));}},React.createElement(Text,{style:{color:'#FFF',fontWeight:'700',fontSize:15}},'📸  Instagram'),cfg.instagram&&React.createElement(Text,{style:{color:'rgba(255,255,255,0.8)',fontSize:12,flex:1,textAlign:'right'}},cfg.instagram)),
            React.createElement(TouchableOpacity,{style:{backgroundColor:'#4267B2',padding:14,borderRadius:12,flexDirection:'row',alignItems:'center',marginBottom:10}},React.createElement(Text,{style:{color:'#FFF',fontWeight:'700',fontSize:15}},'📘  Facebook'),cfg.facebook&&React.createElement(Text,{style:{color:'rgba(255,255,255,0.8)',fontSize:12,flex:1,textAlign:'right'}},cfg.facebook)),
            React.createElement(TouchableOpacity,{style:{backgroundColor:'#25D366',padding:14,borderRadius:12,flexDirection:'row',alignItems:'center'}},React.createElement(Text,{style:{color:'#FFF',fontWeight:'700',fontSize:15}},'💬  LINE'),cfg.line&&React.createElement(Text,{style:{color:'rgba(255,255,255,0.8)',fontSize:12,flex:1,textAlign:'right'}},cfg.line))),
          React.createElement(TouchableOpacity,{style:{backgroundColor:C.text,padding:14,borderRadius:12,alignItems:'center',flexDirection:'row',justifyContent:'center',marginTop:8},onPress:function(){AsyncStorage.removeItem('savedUser');AsyncStorage.removeItem('rememberMe');app.setUser(null);}},React.createElement(MaterialIcons,{name:'logout',size:20,color:'#FFF'}),React.createElement(Text,{style:{color:'#FFF',fontWeight:'600',marginLeft:8}},t.logout)))));
  }

  function AdminScreen(){
    var app=useApp();var t=app.t;
    var insets={top:44,bottom:34,left:0,right:0};
    var svs=useState([]);var services=svs[0];var setServices=svs[1];
    var rvs=useState([]);var reservations=rvs[0];var setReservations=rvs[1];
    var scd=useState([]);var salonCfgData=scd[0];var setSalonCfgData=scd[1];
    var cds=useState([]);var closedDays=cds[0];var setClosedDays=cds[1];
    function refetchSv(){_getAll('services',function(e,d){if(!e)setServices(d||[]);});}
    function refetchCfg(){_getAll('salon_config',function(e,d){if(!e)setSalonCfgData(d||[]);});}
    function refetchCd(){_getAll('closed_days',function(e,d){if(!e)setClosedDays(d||[]);});}
    function insertCd(f){return _post('closed_days',f);}
    function deleteCd(obj){return _findDel('closed_days',obj.id);}
    function insertSv(f){return _post('services',f);}
    function updateSv(obj){return _findUpd('services',obj.id,obj.data);}
    function deleteSv(obj){return _findDel('services',obj.id);}
    function insertCfg(f){return _post('salon_config',f);}
    function updateCfg(obj){return _findUpd('salon_config',obj.id,obj.data);}
    useEffect(function(){
      _getAll('services',function(e,d){if(!e)setServices(d||[]);});
      _getAll('reservations',function(e,d){if(!e)setReservations(d||[]);});
      _getAll('salon_config',function(e,d){if(!e)setSalonCfgData(d||[]);});
      _getAll('closed_days',function(e,d){if(!e)setClosedDays(d||[]);});
    },[]);
    var sf=useState(false);var showForm=sf[0];var setShowForm=sf[1];
    var ed=useState(null);var editing=ed[0];var setEditing=ed[1];
    var sn=useState('');var svName=sn[0];var setSvName=sn[1];
    var sp=useState('');var svPrice=sp[0];var setSvPrice=sp[1];
    var sdur=useState('');var svDur=sdur[0];var setSvDur=sdur[1];
    var sdc=useState('');var svDesc=sdc[0];var setSvDesc=sdc[1];
    var tab=useState('services');var activeTab=tab[0];var setActiveTab=tab[1];
    var cfg=salonCfgData[0]||{};
    var ci=useState('');var cfgIg=ci[0];var setCfgIg=ci[1];
    var cfb=useState('');var cfgFb=cfb[0];var setCfgFb=cfb[1];
    var cl=useState('');var cfgLine=cl[0];var setCfgLine=cl[1];
    var cp=useState('');var cfgPhone=cp[0];var setCfgPhone=cp[1];
    var ca=useState('');var cfgAddr=ca[0];var setCfgAddr=ca[1];
    var ch=useState('');var cfgHistory=ch[0];var setCfgHistory=ch[1];
    var cph1=useState('');var cfgPhoto1=cph1[0];var setCfgPhoto1=cph1[1];
    var cpp=useState('');var cfgPaypal=cpp[0];var setCfgPaypal=cpp[1];
    var cph2=useState('');var cfgPhoto2=cph2[0];var setCfgPhoto2=cph2[1];
    var cph3=useState('');var cfgPhoto3=cph3[0];var setCfgPhoto3=cph3[1];
    var csaved=useState(false);var configSaved=csaved[0];var setConfigSaved=csaved[1];
    var cdDate=useState('');var newClosedDate=cdDate[0];var setNewClosedDate=cdDate[1];
    var cdComment=useState('');var newClosedComment=cdComment[0];var setNewClosedComment=cdComment[1];
    useEffect(function(){if(cfg.instagram!==undefined){setCfgIg(cfg.instagram||'');setCfgFb(cfg.facebook||'');setCfgLine(cfg.line||'');setCfgPhone(cfg.phone||'');setCfgAddr(cfg.address||'');setCfgHistory(cfg.history||'');setCfgPhoto1(cfg.photo1||'');setCfgPhoto2(cfg.photo2||'');setCfgPhoto3(cfg.photo3||'');setCfgPaypal(cfg.paypal||'');}},[cfg.instagram]);
    var inp={borderWidth:1,borderColor:C.border,borderRadius:10,padding:12,marginBottom:12,fontSize:14,backgroundColor:'#FFF',color:C.text};
    function openAdd(){setEditing(null);setSvName('');setSvPrice('');setSvDur('');setSvDesc('');setShowForm(true);}
    function openEdit(sv){setEditing(sv);setSvName(sv.name||'');setSvPrice(String(sv.price||''));setSvDur(String(sv.duration||''));setSvDesc(sv.description||'');setShowForm(true);}
    function doSave(){
      if(!svName.trim()||!svPrice.trim()||!svDur.trim()){Alert.alert('',t.fillAll);return;}
      var d={name:svName,price:parseInt(svPrice),duration:parseInt(svDur),description:svDesc};
      if(editing){updateSv({id:editing.id,data:d}).then(function(){refetchSv();setShowForm(false);}).catch(function(e){Alert.alert('Error',e.message);});}
      else{insertSv(Object.assign({id:Date.now().toString()},d)).then(function(){refetchSv();setShowForm(false);}).catch(function(e){Alert.alert('Error',e.message);});}
    }
    function saveConfig(){
      var data={instagram:cfgIg,facebook:cfgFb,line:cfgLine,phone:cfgPhone,address:cfgAddr,history:cfgHistory,photo1:cfgPhoto1,photo2:cfgPhoto2,photo3:cfgPhoto3,paypal:cfgPaypal};
      var promise=cfg.id?updateCfg({id:cfg.id,data:data}):insertCfg(Object.assign({id:'main'},data));
      promise.then(function(){refetchCfg();setConfigSaved(true);setTimeout(function(){setConfigSaved(false);},2500);}).catch(function(e){Alert.alert('Error',e.message);});
    }
    var adminRes=(reservations||[]).filter(function(r){return (r.status||'')==='confirmed'||(r.status||'')==='cancelled_late';}).slice().sort(function(a,b){var da=new Date((a.date||'2000-01-01').substring(0,10)+'T'+(a.time||'00:00'));var db=new Date((b.date||'2000-01-01').substring(0,10)+'T'+(b.time||'00:00'));return da-db;});
    var lateCancelCount=(reservations||[]).filter(function(r){return (r.status||'')==='cancelled_late';}).length;
    return React.createElement(View,{style:{flex:1,backgroundColor:C.bg}},
      React.createElement(ScrollView,{contentContainerStyle:{paddingTop:insets.top,paddingBottom:TAB_BAR_HEIGHT+insets.bottom+16,padding:16}},
        React.createElement(View,{style:{flexDirection:'row',alignItems:'center',marginBottom:16}},
          React.createElement(MaterialIcons,{name:'admin-panel-settings',size:28,color:C.primary}),
          React.createElement(Text,{style:{fontSize:22,fontWeight:'bold',color:C.text,marginLeft:10}},t.adminPanel),
          app.adminNotifs.length>0&&React.createElement(View,{style:{backgroundColor:C.error,borderRadius:10,paddingHorizontal:8,paddingVertical:2,marginLeft:10}},React.createElement(Text,{style:{color:'#FFF',fontSize:12,fontWeight:'bold'}},app.adminNotifs.length))),
        app.adminNotifs.length>0&&React.createElement(View,{style:{backgroundColor:'#FFF3CD',borderRadius:12,padding:12,marginBottom:16,borderWidth:1,borderColor:C.warning}},
          React.createElement(View,{style:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8}},
            React.createElement(Text,{style:{fontWeight:'700',color:'#856404',fontSize:13}},(app.lang==='ja'?'通知 (':'Notifications (')+app.adminNotifs.length+')'),
            React.createElement(TouchableOpacity,{onPress:function(){app.clearAdminNotifs();}},React.createElement(Text,{style:{color:C.error,fontWeight:'700',fontSize:11}},app.lang==='ja'?'全消':'Clear all'))),
          app.adminNotifs.slice(0,5).map(function(n){
            return React.createElement(View,{key:n.id,style:{flexDirection:'row',justifyContent:'space-between',paddingVertical:4,borderBottomWidth:1,borderBottomColor:'#FFE8A3'}},
              React.createElement(Text,{style:{fontSize:12,color:'#856404',flex:1}},n.time+' - '+n.msg),
              React.createElement(TouchableOpacity,{onPress:function(){app.dismissAdminNotif(n.id);}},React.createElement(MaterialIcons,{name:'close',size:14,color:'#856404'})));
          })),
        lateCancelCount>0&&React.createElement(View,{style:{backgroundColor:'#FEE2E2',borderRadius:12,padding:14,marginBottom:16,borderWidth:1,borderColor:C.error,flexDirection:'row',alignItems:'center'}},
          React.createElement(MaterialIcons,{name:'warning',size:22,color:C.error}),
          React.createElement(View,{style:{flex:1,marginLeft:10}},
            React.createElement(Text,{style:{color:C.error,fontWeight:'700',fontSize:14}},app.lang==='ja'?'⚠️ 未回収キャンセル料: '+lateCancelCount+'件':'⚠️ Pending 500 JPY fees: '+lateCancelCount+' client'+(lateCancelCount>1?'s':'')),
            React.createElement(Text,{style:{color:C.error,fontSize:12,marginTop:2}},app.lang==='ja'?'「全予約」タブで確認してください。来店時に500円を回収してください。':'See "All Reservations" tab. Collect 500 JPY at next visit.'))),
        React.createElement(View,{style:{flexDirection:'row',backgroundColor:C.card,borderRadius:12,padding:4,marginBottom:16}},
          React.createElement(TouchableOpacity,{style:{flex:1,padding:10,borderRadius:8,backgroundColor:activeTab==='services'?C.primary:'transparent',alignItems:'center'},onPress:function(){setActiveTab('services');}},React.createElement(Text,{style:{color:activeTab==='services'?'#FFF':C.sub,fontWeight:'600',fontSize:12}},t.services)),
          React.createElement(TouchableOpacity,{style:{flex:1,padding:10,borderRadius:8,backgroundColor:activeTab==='reservations'?C.primary:'transparent',alignItems:'center'},onPress:function(){setActiveTab('reservations');}},React.createElement(Text,{style:{color:activeTab==='reservations'?'#FFF':C.sub,fontWeight:'600',fontSize:12}},t.allReservations)),
          React.createElement(TouchableOpacity,{style:{flex:1,padding:10,borderRadius:8,backgroundColor:activeTab==='config'?C.primary:'transparent',alignItems:'center'},onPress:function(){setActiveTab('config');}},React.createElement(Text,{style:{color:activeTab==='config'?'#FFF':C.sub,fontWeight:'600',fontSize:10}},app.lang==='ja'?'設定':'Config')),
          React.createElement(TouchableOpacity,{style:{flex:1,padding:10,borderRadius:8,backgroundColor:activeTab==='closed'?C.primary:'transparent',alignItems:'center'},onPress:function(){setActiveTab('closed');}},React.createElement(Text,{style:{color:activeTab==='closed'?'#FFF':C.sub,fontWeight:'600',fontSize:10}},app.lang==='ja'?'休業日':'Closed'))),
        activeTab==='services'&&React.createElement(View,null,
          React.createElement(TouchableOpacity,{style:{backgroundColor:C.primary,padding:14,borderRadius:12,alignItems:'center',flexDirection:'row',justifyContent:'center',marginBottom:16},onPress:openAdd},React.createElement(MaterialIcons,{name:'add',size:20,color:'#FFF'}),React.createElement(Text,{style:{color:'#FFF',fontWeight:'700',fontSize:15,marginLeft:8}},t.addService)),
          services.map(function(sv){
            return React.createElement(View,{key:sv.id,style:{backgroundColor:C.card,borderRadius:12,padding:16,marginBottom:12,borderWidth:1,borderColor:C.border}},
              React.createElement(Text,{style:{fontWeight:'700',color:C.text,fontSize:15,marginBottom:4}},sv.name),
              React.createElement(Text,{style:{color:C.sub,marginBottom:8}},(sv.duration||0)+(app.lang==='ja'?'分':'min')+'  '+(sv.price||0)+' JPY'),
              sv.description&&React.createElement(Text,{style:{color:C.sub,fontSize:12,marginBottom:8}},sv.description),
              React.createElement(View,{style:{flexDirection:'row'}},
                React.createElement(TouchableOpacity,{style:{flex:1,backgroundColor:C.warning,padding:10,borderRadius:8,alignItems:'center',flexDirection:'row',justifyContent:'center',marginRight:6},onPress:function(){openEdit(sv);}},React.createElement(MaterialIcons,{name:'edit',size:16,color:'#FFF'}),React.createElement(Text,{style:{color:'#FFF',fontWeight:'600',marginLeft:6}},t.editService)),
                React.createElement(TouchableOpacity,{style:{flex:1,backgroundColor:C.error,padding:10,borderRadius:8,alignItems:'center',flexDirection:'row',justifyContent:'center',marginLeft:6},onPress:function(){Alert.alert('',app.lang==='ja'?'削除しますか？':'Delete this service?',[{text:t.no,style:'cancel'},{text:t.yes,onPress:function(){deleteSv({id:sv.id}).then(function(){refetchSv();}).catch(function(e){Alert.alert('Error',e.message);});}}]);}},React.createElement(MaterialIcons,{name:'delete',size:16,color:'#FFF'}),React.createElement(Text,{style:{color:'#FFF',fontWeight:'600',marginLeft:6}},t.deleteService))));
          })),
        activeTab==='reservations'&&React.createElement(View,null,
          React.createElement(Text,{style:{fontSize:14,color:C.sub,marginBottom:12}},(app.lang==='ja'?'合計: ':'Total: ')+adminRes.length+(app.lang==='ja'?'件':' entries')),
          adminRes.length===0
            ?React.createElement(Text,{style:{color:C.sub,textAlign:'center',marginTop:20}},t.noAppointments)
            :adminRes.map(function(r){
              var isLateCancelled=(r.status||'')==='cancelled_late';
              return React.createElement(View,{key:r.id||r.created_at,style:{backgroundColor:C.card,borderRadius:12,padding:16,marginBottom:12,borderWidth:isLateCancelled?2:1,borderColor:isLateCancelled?C.error:C.border}},
                isLateCancelled&&React.createElement(View,{style:{backgroundColor:'#FEE2E2',borderRadius:8,padding:10,marginBottom:10,flexDirection:'row',alignItems:'center'}},React.createElement(MaterialIcons,{name:'attach-money',size:18,color:C.error}),React.createElement(Text,{style:{color:C.error,fontWeight:'700',fontSize:13,marginLeft:6}},app.lang==='ja'?'⚠️ 遅延キャンセル — 来店時に500円を回収':'⚠️ LATE CANCEL — Collect 500 JPY at next visit')),
                React.createElement(Text,{style:{fontWeight:'700',color:isLateCancelled?C.sub:C.text,marginBottom:4,textDecorationLine:isLateCancelled?'line-through':'none'}},r.serviceNames||'Appointment'),
                React.createElement(Text,{style:{color:C.sub}},t.client+': '+(r.clientName||r.username||'')),
                React.createElement(Text,{style:{color:C.sub}},(r.date||'')+' '+(r.time||'')+' - '+(r.endTime||'')),
                React.createElement(View,{style:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:6}},
                  React.createElement(Text,{style:{color:isLateCancelled?C.sub:C.primary,fontWeight:'bold',textDecorationLine:isLateCancelled?'line-through':'none'}},(r.totalPrice||0)+' JPY'+(isLateCancelled?' + 500 JPY fee':'')),
                  React.createElement(View,{style:{backgroundColor:isLateCancelled?C.error:r.payment_method==='online'?C.success:C.warning,paddingHorizontal:8,paddingVertical:3,borderRadius:6}},React.createElement(Text,{style:{color:'#FFF',fontSize:11}},isLateCancelled?(app.lang==='ja'?'遅延キャンセル':'Late Cancel'):r.payment_method==='online'?'PayPal':t.cash))));
            })),
        activeTab==='config'&&React.createElement(View,null,
          React.createElement(View,{style:{backgroundColor:C.card,borderRadius:14,padding:16,marginBottom:14}},
            React.createElement(Text,{style:{fontSize:16,fontWeight:'700',color:C.text,marginBottom:12}},'SNS & Contact'),
            React.createElement(TextInput,{style:inp,placeholder:'Instagram (@...)',placeholderTextColor:C.sub,value:cfgIg,onChangeText:setCfgIg,autoCapitalize:'none'}),
            React.createElement(TextInput,{style:inp,placeholder:'Facebook',placeholderTextColor:C.sub,value:cfgFb,onChangeText:setCfgFb,autoCapitalize:'none'}),
            React.createElement(TextInput,{style:inp,placeholder:'LINE ID',placeholderTextColor:C.sub,value:cfgLine,onChangeText:setCfgLine,autoCapitalize:'none'}),React.createElement(TextInput,{style:inp,placeholder:'PayPal URL',placeholderTextColor:C.sub,value:cfgPaypal,onChangeText:setCfgPaypal,autoCapitalize:'none'}),
            React.createElement(TextInput,{style:inp,placeholder:app.lang==='ja'?'電話番号':'Phone',placeholderTextColor:C.sub,value:cfgPhone,onChangeText:setCfgPhone}),
            React.createElement(TextInput,{style:inp,placeholder:app.lang==='ja'?'住所':'Address',placeholderTextColor:C.sub,value:cfgAddr,onChangeText:setCfgAddr})),
          React.createElement(View,{style:{backgroundColor:C.card,borderRadius:14,padding:16,marginBottom:14}},
            React.createElement(Text,{style:{fontSize:16,fontWeight:'700',color:C.text,marginBottom:10}},app.lang==='ja'?'サロン紹介文':'About Us'),
            React.createElement(TextInput,{style:{borderWidth:1,borderColor:C.border,borderRadius:10,padding:12,fontSize:13,backgroundColor:'#F9F9F9',color:C.text,minHeight:90,textAlignVertical:'top'},placeholder:app.lang==='ja'?'サロンの紹介文...':'Write your salon story...',placeholderTextColor:C.sub,value:cfgHistory,onChangeText:setCfgHistory,multiline:true})),
          React.createElement(View,{style:{backgroundColor:C.card,borderRadius:14,padding:16,marginBottom:14}},
            React.createElement(Text,{style:{fontSize:16,fontWeight:'700',color:C.text,marginBottom:8}},app.lang==='ja'?'写真URL (3枚)':'Photo URLs (3)'),
            React.createElement(View,{style:{flexDirection:'row',marginBottom:10,alignItems:'center'}},React.createElement(TextInput,{style:{flex:1,borderWidth:1,borderColor:C.border,borderRadius:10,padding:10,fontSize:12,backgroundColor:'#F9F9F9',color:C.text},placeholder:'https://...',placeholderTextColor:C.sub,value:cfgPhoto1,onChangeText:setCfgPhoto1,autoCapitalize:'none'}),cfgPhoto1?React.createElement(Image,{source:{uri:cfgPhoto1},style:{width:44,height:44,borderRadius:8,marginLeft:8},resizeMode:'cover'}):null),
            React.createElement(View,{style:{flexDirection:'row',marginBottom:10,alignItems:'center'}},React.createElement(TextInput,{style:{flex:1,borderWidth:1,borderColor:C.border,borderRadius:10,padding:10,fontSize:12,backgroundColor:'#F9F9F9',color:C.text},placeholder:'https://...',placeholderTextColor:C.sub,value:cfgPhoto2,onChangeText:setCfgPhoto2,autoCapitalize:'none'}),cfgPhoto2?React.createElement(Image,{source:{uri:cfgPhoto2},style:{width:44,height:44,borderRadius:8,marginLeft:8},resizeMode:'cover'}):null),
            React.createElement(View,{style:{flexDirection:'row',marginBottom:10,alignItems:'center'}},React.createElement(TextInput,{style:{flex:1,borderWidth:1,borderColor:C.border,borderRadius:10,padding:10,fontSize:12,backgroundColor:'#F9F9F9',color:C.text},placeholder:'https://...',placeholderTextColor:C.sub,value:cfgPhoto3,onChangeText:setCfgPhoto3,autoCapitalize:'none'}),cfgPhoto3?React.createElement(Image,{source:{uri:cfgPhoto3},style:{width:44,height:44,borderRadius:8,marginLeft:8},resizeMode:'cover'}):null)),
          React.createElement(TouchableOpacity,{style:{backgroundColor:configSaved?C.success:C.primary,padding:16,borderRadius:12,alignItems:'center',flexDirection:'row',justifyContent:'center'},onPress:saveConfig},React.createElement(MaterialIcons,{name:configSaved?'check-circle':'save',size:20,color:'#FFF'}),React.createElement(Text,{style:{color:'#FFF',fontSize:16,fontWeight:'bold',marginLeft:8}},configSaved?(app.lang==='ja'?'保存しました！':'Saved!'):(app.lang==='ja'?'保存する':'Save Changes'))))),
        activeTab==='closed'&&React.createElement(View,null,
          React.createElement(View,{style:{backgroundColor:C.card,borderRadius:14,padding:16,marginBottom:14}},
            React.createElement(Text,{style:{fontSize:15,fontWeight:'700',color:C.text,marginBottom:12}},app.lang==='ja'?'休業日を追加':'Add Closed Day'),
            React.createElement(TextInput,{style:{borderWidth:1,borderColor:C.border,borderRadius:10,padding:12,marginBottom:10,fontSize:14,backgroundColor:'#FFF',color:C.text},placeholder:'YYYY-MM-DD',placeholderTextColor:C.sub,value:newClosedDate,onChangeText:setNewClosedDate,autoCapitalize:'none'}),
            React.createElement(TextInput,{style:{borderWidth:1,borderColor:C.border,borderRadius:10,padding:12,marginBottom:12,fontSize:14,backgroundColor:'#FFF',color:C.text},placeholder:app.lang==='ja'?'理由（任意）例：祝日、休暇':'Reason (optional) e.g. Holiday, Vacation',placeholderTextColor:C.sub,value:newClosedComment,onChangeText:setNewClosedComment}),
            React.createElement(TouchableOpacity,{style:{backgroundColor:C.error,padding:14,borderRadius:10,alignItems:'center',flexDirection:'row',justifyContent:'center'},onPress:function(){
              if(!newClosedDate.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(newClosedDate.trim())){Alert.alert('',app.lang==='ja'?'正しい日付を入力してください (YYYY-MM-DD)':'Enter a valid date (YYYY-MM-DD)');return;}
              insertCd({id:'cd_'+newClosedDate.trim(),date:newClosedDate.trim(),comment:newClosedComment.trim()}).then(function(){refetchCd();setNewClosedDate('');setNewClosedComment('');}).catch(function(e){Alert.alert('Error',e.message||'');});
            }},React.createElement(MaterialIcons,{name:'block',size:18,color:'#FFF'}),React.createElement(Text,{style:{color:'#FFF',fontWeight:'700',marginLeft:8}},app.lang==='ja'?'休業日に設定':'Mark as Closed'))),
          closedDays.length===0
            ?React.createElement(View,{style:{backgroundColor:C.card,borderRadius:12,padding:30,alignItems:'center'}},React.createElement(MaterialIcons,{name:'event-available',size:40,color:C.success}),React.createElement(Text,{style:{color:C.sub,marginTop:10,textAlign:'center'}},app.lang==='ja'?'休業日は設定されていません':'No closed days set'))
            :React.createElement(View,null,
              React.createElement(Text,{style:{fontSize:13,color:C.sub,marginBottom:10,fontWeight:'600'}},app.lang==='ja'?'設定済み休業日:':'Closed days:'),
              closedDays.slice().sort(function(a,b){return(a.date||'')>(b.date||'')?1:-1;}).map(function(cd){
                return React.createElement(View,{key:cd.id,style:{backgroundColor:C.card,borderRadius:10,padding:14,marginBottom:8,borderWidth:1,borderColor:'#FECACA',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}},
                  React.createElement(View,{style:{flex:1}},React.createElement(Text,{style:{fontWeight:'700',color:C.error}},cd.date),cd.comment&&React.createElement(Text,{style:{fontSize:12,color:C.sub,marginTop:2}},cd.comment)),
                  React.createElement(TouchableOpacity,{style:{backgroundColor:'#FEE2E2',borderRadius:8,padding:8},onPress:function(){deleteCd({id:cd.id}).then(function(){refetchCd();}).catch(function(e){Alert.alert('Error',e.message||'');});}},React.createElement(MaterialIcons,{name:'delete',size:18,color:C.error})));
              }))),
      React.createElement(Modal,{visible:showForm,animationType:'slide',transparent:true,onRequestClose:function(){setShowForm(false);}},
        React.createElement(View,{style:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end'}},
          React.createElement(View,{style:{backgroundColor:C.bg,borderTopLeftRadius:20,borderTopRightRadius:20,padding:24}},
            React.createElement(View,{style:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:18}},React.createElement(Text,{style:{fontSize:18,fontWeight:'bold',color:C.text}},editing?t.editService:t.addService),React.createElement(TouchableOpacity,{onPress:function(){setShowForm(false);}},React.createElement(MaterialIcons,{name:'close',size:24,color:C.text}))),
            React.createElement(TextInput,{style:inp,placeholder:t.serviceName,placeholderTextColor:C.sub,value:svName,onChangeText:setSvName}),
            React.createElement(TextInput,{style:inp,placeholder:t.servicePrice,placeholderTextColor:C.sub,value:svPrice,onChangeText:setSvPrice,keyboardType:'numeric'}),
            React.createElement(TextInput,{style:inp,placeholder:t.serviceDuration,placeholderTextColor:C.sub,value:svDur,onChangeText:setSvDur,keyboardType:'numeric'}),
            React.createElement(TextInput,{style:inp,placeholder:t.serviceDesc,placeholderTextColor:C.sub,value:svDesc,onChangeText:setSvDesc,multiline:true,numberOfLines:3}),
            React.createElement(TouchableOpacity,{style:{backgroundColor:C.primary,padding:16,borderRadius:12,alignItems:'center'},onPress:doSave},React.createElement(Text,{style:{color:'#FFF',fontSize:16,fontWeight:'bold'}},t.save))))));
  }

  function MainAppUser(){
    var app=useApp();var t=app.t;var insets={top:44,bottom:34,left:0,right:0};
    var tabStyle={position:'absolute',bottom:0,height:TAB_BAR_HEIGHT+insets.bottom,backgroundColor:C.card,borderTopWidth:0,elevation:10};
    return React.createElement(Tab.Navigator,{initialRouteName:'reservations',screenOptions:{headerShown:false,tabBarActiveTintColor:C.primary,tabBarInactiveTintColor:C.sub,tabBarStyle:tabStyle,tabBarLabelStyle:{fontSize:11,fontWeight:'600',marginBottom:4}}},
      React.createElement(Tab.Screen,{name:'reservations',component:ReservationsScreen,options:{tabBarLabel:t.reservations,tabBarIcon:function(p){return React.createElement(MaterialIcons,{name:'event',size:24,color:p.color});}}}),
      React.createElement(Tab.Screen,{name:'services',component:ServicesScreen,options:{tabBarLabel:t.services,tabBarIcon:function(p){return React.createElement(MaterialIcons,{name:'spa',size:24,color:p.color});}}}),
      React.createElement(Tab.Screen,{name:'about',component:AboutScreen,options:{tabBarLabel:t.about,tabBarIcon:function(p){return React.createElement(MaterialIcons,{name:'info',size:24,color:p.color});}}}));
  }

  function MainAppAdmin(){
    var app=useApp();var t=app.t;var insets={top:44,bottom:34,left:0,right:0};
    var tabStyle={position:'absolute',bottom:0,height:TAB_BAR_HEIGHT+insets.bottom,backgroundColor:C.card,borderTopWidth:0,elevation:10};
    var badgeCount=app.adminNotifs.length;
    return React.createElement(Tab.Navigator,{initialRouteName:'reservations',screenOptions:{headerShown:false,tabBarActiveTintColor:C.primary,tabBarInactiveTintColor:C.sub,tabBarStyle:tabStyle,tabBarLabelStyle:{fontSize:11,fontWeight:'600',marginBottom:4}}},
      React.createElement(Tab.Screen,{name:'reservations',component:ReservationsScreen,options:{tabBarLabel:t.reservations,tabBarIcon:function(p){return React.createElement(MaterialIcons,{name:'event',size:24,color:p.color});}}}),
      React.createElement(Tab.Screen,{name:'services',component:ServicesScreen,options:{tabBarLabel:t.services,tabBarIcon:function(p){return React.createElement(MaterialIcons,{name:'spa',size:24,color:p.color});}}}),
      React.createElement(Tab.Screen,{name:'about',component:AboutScreen,options:{tabBarLabel:t.about,tabBarIcon:function(p){return React.createElement(MaterialIcons,{name:'info',size:24,color:p.color});}}}),
      React.createElement(Tab.Screen,{name:'admin',component:AdminScreen,options:{tabBarLabel:t.admin,tabBarBadge:badgeCount>0?badgeCount:undefined,tabBarIcon:function(p){return React.createElement(MaterialIcons,{name:'admin-panel-settings',size:24,color:p.color});}}}));
  }

  function MainApp(){var app=useApp();if(app.isAdmin)return React.createElement(MainAppAdmin,null);return React.createElement(MainAppUser,null);}

  function RootContent(){
    var app=useApp();
    if(!app.lang)return React.createElement(LangScreen,null);
    if(!app.user)return React.createElement(AuthScreen,null);
    return React.createElement(SafeAreaProvider,null,
      React.createElement(View,{style:{flex:1}},
        React.createElement(MusicPlayer,null),
        React.createElement(NavigationContainer,null,React.createElement(MainApp,null))));
  }

  return React.createElement(SafeAreaProvider,null,
    React.createElement(AppProvider,null,
      React.createElement(View,{style:{flex:1,width:'100%',height:'100%'}},
        React.createElement(StatusBar,{barStyle:'dark-content'}),
        React.createElement(RootContent,null))));

}